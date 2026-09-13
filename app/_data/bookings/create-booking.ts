import { readFileSync, writeFileSync } from "fs";
import path from "path";

import restaurants from "@data/dummy/restaurants.json";
import tables from "@data/dummy/tables.json";
import payments from "@data/dummy/payments.json";

import {
  derivePaymentDeadline,
  getEffectiveBookingStatus,
  isBookingTooSoon,
} from "./booking-deadline";

import type { IBooking, IPayment, ITable } from "@types";

export interface CreateBookingInput {
  restaurantId: string;
  date: string;
  time: string;
  partySize: number;
  specialRequest?: string;
}

const BOOKINGS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/bookings.json",
);

const PAYMENTS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/payments.json",
);

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

function readBookings(): IBooking[] {
  try {
    const raw = readFileSync(BOOKINGS_FILE_PATH, "utf8");
    return (JSON.parse(raw) as IBooking[]);
  } catch {
    throw new BookingWriteError("Could not read the bookings data.");
  }
}

function readPayments(): IPayment[] {
  try {
    const raw = readFileSync(PAYMENTS_FILE_PATH, "utf8");
    return (JSON.parse(raw) as IPayment[]);
  } catch {
    throw new BookingWriteError("Could not read the payment data.");
  }
}

function buildNextPaymentId(payments: IPayment[]): string {
  let max = 0;
  for (const payment of payments) {
    const sequence = Number(payment.id.replace("payment-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `payment-${String(max + 1).padStart(3, "0")}`;
}

function buildNextBookingId(bookings: IBooking[]): string {
  let max = 0;
  for (const booking of bookings) {
    const sequence = Number(booking.id.replace("booking-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `booking-${String(max + 1).padStart(3, "0")}`;
}

function findRestaurantTables(restaurantId: string): ITable[] {
  const found: ITable[] = [];
  for (const table of tables) {
    if (table.restaurantId === restaurantId) {
      found.push(table as ITable);
    }
  }
  return found;
}

export interface BookingPreview {
  restaurantName: string;
  restaurantSlug: string;
  tableName: string;
  price: number;
}

function selectBooking(input: CreateBookingInput): {
  restaurant: (typeof restaurants)[number];
  restaurantTables: ITable[];
  busyTableIds: Set<string>;
  bestTable: ITable;
} {
  const { restaurantId, date, time, partySize } = input;

  const restaurant = restaurants.find((item) => item.id === restaurantId);
  if (!restaurant) {
    throw new RestaurantNotFoundError("The restaurant does not exist.");
  }

  if (isBookingTooSoon(date, time)) {
    throw new BookingLeadTimeError(
      "Bookings must be made at least 12 hours in advance.",
    );
  }

  const restaurantTables = findRestaurantTables(restaurantId);
  if (restaurantTables.length === 0) {
    throw new RestaurantNoTablesError("This restaurant has no bookable tables yet.");
  }

  const bookings = readBookings();

  const paymentByBookingId = new Map(
    payments.map((item) => [item.bookingId, item] as const),
  );

  const busyTableIds = new Set<string>();
  for (const booking of bookings) {
    if (booking.status === "cancelled" || booking.status === "no_show") {
      continue;
    }
    const payment = paymentByBookingId.get(booking.id) as
      | IPayment
      | undefined;
    if (getEffectiveBookingStatus(booking, payment) === "cancelled") {
      continue;
    }
    if (booking.date !== date || booking.time !== time) {
      continue;
    }
    busyTableIds.add(booking.tableId);
  }

  let bestTable: ITable | null = null;
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

export function getBookingPreview(input: CreateBookingInput): BookingPreview {
  const { restaurant, bestTable } = selectBooking(input);
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
  const { bestTable } = selectBooking(input);

  const bookings = readBookings();
  const payments = readPayments();
  const now = new Date().toISOString();
  const booking: IBooking = {
    id: buildNextBookingId(bookings),
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

  bookings.push(booking);

  const payment: IPayment = {
    id: buildNextPaymentId(payments),
    price: bestTable.price,
    status: "unpaid",
    deadline: derivePaymentDeadline(),
    gatewayToken: `tok_sandbox_${booking.id}`,
    bookingId: booking.id,
    createdAt: now,
    updatedAt: now,
  };
  payments.push(payment);

  try {
    writeFileSync(
      BOOKINGS_FILE_PATH,
      `${JSON.stringify(bookings, null, 2)}\n`,
      "utf8",
    );
    writeFileSync(
      PAYMENTS_FILE_PATH,
      `${JSON.stringify(payments, null, 2)}\n`,
      "utf8",
    );
  } catch {
    throw new BookingWriteError("Could not save the booking.");
  }

  // Sync to database if available
  try {
    const { db } = await import("@db/client");
    const { bookings: bookingsTable, payments: paymentsTable } = await import("@db/schema");

    await db.insert(bookingsTable).values({
      id: booking.id,
      date: booking.date,
      time: booking.time,
      partySize: booking.partySize,
      specialRequest: booking.specialRequest ?? null,
      status: "pending",
      customerId: booking.customerId,
      tableId: booking.tableId,
      createdAt: booking.createdAt ?? now,
      updatedAt: booking.updatedAt ?? now,
    });

    await db.insert(paymentsTable).values({
      id: payment.id,
      price: payment.price,
      status: "unpaid",
      deadline: payment.deadline,
      gatewayToken: payment.gatewayToken,
      paidAt: null,
      bookingId: payment.bookingId,
      createdAt: payment.createdAt ?? now,
      updatedAt: payment.updatedAt ?? now,
    });
  } catch {
    // DB sync error handled gracefully
  }

  return booking;
}