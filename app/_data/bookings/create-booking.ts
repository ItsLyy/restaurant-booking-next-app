import "server-only";

import { eq, inArray, like } from "drizzle-orm";

import { db } from "@db/client";
import {
  bookings as bookingsTable,
  payments as paymentsTable,
  restaurants as restaurantsTable,
  tables as tablesTable,
} from "@db/schema";

import {
  derivePaymentDeadline,
  getEffectiveBookingStatus,
  isBookingTooSoon,
} from "./booking-deadline";

import type { BookingRow, PaymentRow, RestaurantRow, TableRow } from "@db/schema";
import type { IBooking, IPayment } from "@types";

export interface CreateBookingInput {
  restaurantId: string;
  date: string;
  time: string;
  partySize: number;
  specialRequest?: string;
}

const CUSTOMER_ID = "user-001";
const INITIAL_STATUS = "pending";

export class RestaurantNotFoundError extends Error {
  name = "RestaurantNotFoundError";
}

export class RestaurantNoTablesError extends Error {
  name = "RestaurantNoTablesError";
}

export class BookingSlotUnavailableError extends Error {
  name = "BookingSlotUnavailableError";
}

export class BookingLeadTimeError extends Error {
  name = "BookingLeadTimeError";
}

export class BookingWriteError extends Error {
  name = "BookingWriteError";
}

const toIBooking = (row: BookingRow): IBooking => ({
  id: row.id,
  date: row.date,
  time: row.time,
  partySize: row.partySize,
  ...(row.specialRequest ? { specialRequest: row.specialRequest } : {}),
  status: row.status,
  customerId: row.customerId,
  tableId: row.tableId,
  ...(row.cancelledBy
    ? {
        cancelled: {
          date: row.cancelledDate ?? "",
          by: row.cancelledBy,
          reason: row.cancelledReason ?? "",
        },
      }
    : {}),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const toIPayment = (row?: PaymentRow): IPayment | undefined => {
  if (!row) return undefined;
  return {
    id: row.id,
    price: row.price,
    status: row.status,
    deadline: row.deadline,
    gatewayToken: row.gatewayToken,
    bookingId: row.bookingId,
    paidAt: row.paidAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

const findRestaurantTables = async (
  restaurantId: string,
): Promise<TableRow[]> =>
  db
    .select()
    .from(tablesTable)
    .where(eq(tablesTable.restaurantId, restaurantId));

const buildNextPaymentId = async (): Promise<string> => {
  const rows = await db
    .select({ id: paymentsTable.id })
    .from(paymentsTable)
    .where(like(paymentsTable.id, "payment-%"));
  let max = 0;
  for (const row of rows) {
    const sequence = Number(row.id.replace("payment-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `payment-${String(max + 1).padStart(3, "0")}`;
};

const buildNextBookingId = async (): Promise<string> => {
  const rows = await db
    .select({ id: bookingsTable.id })
    .from(bookingsTable)
    .where(like(bookingsTable.id, "booking-%"));
  let max = 0;
  for (const row of rows) {
    const sequence = Number(row.id.replace("booking-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `booking-${String(max + 1).padStart(3, "0")}`;
};

export interface BookingPreview {
  restaurantName: string;
  restaurantSlug: string;
  tableName: string;
  price: number;
}

interface SelectedBooking {
  restaurant: RestaurantRow;
  bestTable: TableRow;
  busyTableIds: Set<string>;
  restaurantTables: TableRow[];
}

async function selectBooking(input: CreateBookingInput): Promise<SelectedBooking> {
  const { restaurantId, date, time, partySize } = input;

  const restaurantRows = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, restaurantId))
    .limit(1);
  const restaurant = restaurantRows[0];
  if (!restaurant) {
    throw new RestaurantNotFoundError("The restaurant does not exist.");
  }

  if (isBookingTooSoon(date, time)) {
    throw new BookingLeadTimeError(
      "Bookings must be made at least 12 hours in advance.",
    );
  }

  const restaurantTables = await findRestaurantTables(restaurantId);
  if (restaurantTables.length === 0) {
    throw new RestaurantNoTablesError(
      "This restaurant has no bookable tables yet.",
    );
  }

  const tableIds = restaurantTables.map((table) => table.id);
  const bookingRows = await db
    .select()
    .from(bookingsTable)
    .where(inArray(bookingsTable.tableId, tableIds));

  const bookingIds = bookingRows.map((booking) => booking.id);
  const paymentRows = bookingIds.length
    ? await db
        .select()
        .from(paymentsTable)
        .where(inArray(paymentsTable.bookingId, bookingIds))
    : [];

  const paymentByBookingId = new Map(
    paymentRows.map((item) => [item.bookingId, item] as const),
  );

  const busyTableIds = new Set<string>();
  for (const booking of bookingRows) {
    if (booking.status === "cancelled" || booking.status === "no_show") {
      continue;
    }
    const payment = paymentByBookingId.get(booking.id);
    if (getEffectiveBookingStatus(toIBooking(booking), toIPayment(payment)) === "cancelled") {
      continue;
    }
    if (booking.date !== date || booking.time !== time) {
      continue;
    }
    busyTableIds.add(booking.tableId);
  }

  let bestTable: TableRow | null = null;
  for (const table of restaurantTables) {
    if (busyTableIds.has(table.id)) {
      continue;
    }
    if (table.capacity < partySize) {
      continue;
    }
    if (bestTable === null || table.capacity < bestTable.capacity) {
      bestTable = table;
    }
  }

  if (!bestTable) {
    throw new BookingSlotUnavailableError(
      busyTableIds.size === restaurantTables.length
        ? "That time slot has just been booked. Please pick another time."
        : "No available table can fit your party size. Please pick a smaller party or another time.",
    );
  }

  return { restaurant, restaurantTables, busyTableIds, bestTable };
}

export async function getBookingPreview(
  input: CreateBookingInput,
): Promise<BookingPreview> {
  const { restaurant, bestTable } = await selectBooking(input);
  return {
    restaurantName: restaurant.name,
    restaurantSlug: restaurant.slug,
    tableName: bestTable.name,
    price: bestTable.price,
  };
}

export async function createBooking(
  input: CreateBookingInput,
  customerId: string = CUSTOMER_ID,
): Promise<IBooking> {
  const { date, time, partySize, specialRequest } = input;
  const { bestTable } = await selectBooking(input);

  const now = new Date().toISOString();
  const bookingId = await buildNextBookingId();
  const paymentId = await buildNextPaymentId();
  const booking: IBooking = {
    id: bookingId,
    date,
    time,
    partySize,
    ...(specialRequest ? { specialRequest } : {}),
    status: INITIAL_STATUS,
    customerId,
    tableId: bestTable.id,
    createdAt: now,
    updatedAt: now,
  };

  const payment: IPayment = {
    id: paymentId,
    price: bestTable.price,
    status: "unpaid",
    deadline: derivePaymentDeadline(),
    gatewayToken: `tok_sandbox_${bookingId}`,
    bookingId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.transaction(async (tx) => {
      await tx.insert(bookingsTable).values({
        id: bookingId,
        date,
        time,
        partySize,
        specialRequest: specialRequest ?? null,
        status: "pending",
        customerId,
        tableId: bestTable.id,
        createdAt: now,
        updatedAt: now,
      });

      await tx.insert(paymentsTable).values({
        id: paymentId,
        price: payment.price,
        status: "unpaid",
        deadline: payment.deadline,
        gatewayToken: payment.gatewayToken,
        paidAt: null,
        bookingId,
        createdAt: now,
        updatedAt: now,
      });
    });
  } catch {
    throw new BookingWriteError("Could not save the booking.");
  }

  return booking;
}