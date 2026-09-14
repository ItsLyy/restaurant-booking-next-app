import { eq, inArray } from "drizzle-orm";

import { db } from "@db/client";
import {
  bookings as bookingsTable,
  payments as paymentsTable,
  restaurants as restaurantsTable,
  tables as tablesTable,
  users as usersTable,
} from "@db/schema";

import {
  getEffectiveBookingStatus,
  isPendingVisibleOn,
} from "@data/bookings/booking-deadline";

import type { BookingRow, PaymentRow } from "@db/schema";
import type { IBooking, IPayment } from "@types";

const OWNER_ID = "owner-001";
const RESTAURANT_ID = "rest-001";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

export interface DashboardBooking {
  id: string;
  date: string;
  time: string;
  guest: string;
  party: number;
  table: string;
  tableId: string;
  status: "confirmed" | "pending";
  isPaid: boolean;
  price: number | null;
}

export interface DashboardTable {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  category: string;
}

export interface DashboardRestaurant {
  id: string;
  name: string;
  city: string;
}

export interface DashboardOwner {
  firstName: string;
  lastName: string;
  avatar: string;
}

const toTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
};

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

export async function getDashboardData() {
  const restaurantTables = await db
    .select()
    .from(tablesTable)
    .where(eq(tablesTable.restaurantId, RESTAURANT_ID));
  const tableIds = new Set(restaurantTables.map((table) => table.id));

  const restaurantRows = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, RESTAURANT_ID))
    .limit(1);
  const restaurant = restaurantRows[0];

  const bookingRows = tableIds.size
    ? await db
        .select()
        .from(bookingsTable)
        .where(inArray(bookingsTable.tableId, [...tableIds]))
    : [];
  const bookingIds = bookingRows.map((booking) => booking.id);
  const paymentRows = bookingIds.length
    ? await db
        .select()
        .from(paymentsTable)
        .where(inArray(paymentsTable.bookingId, bookingIds))
    : [];

  const paymentByBookingId = new Map(
    paymentRows.map((item) => [item.bookingId, item]),
  );

  const ownerId = restaurant?.ownerId ?? OWNER_ID;
  const [ownerRows, userRows] = await Promise.all([
    db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, ownerId))
      .limit(1),
    db
      .select({
        id: usersTable.id,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
      })
      .from(usersTable),
  ]);
  const owner = ownerRows[0];

  const people = new Map<string, Person>(
    userRows.map((user) => [
      user.id,
      { id: user.id, firstName: user.firstName, lastName: user.lastName },
    ]),
  );

  const tableById = new Map(
    restaurantTables.map((table) => [table.id, table]),
  );

  const today = (() => {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  })();

  const visibleBookings: DashboardBooking[] = [];
  for (const booking of bookingRows) {
    if (booking.status === "cancelled" || booking.status === "no_show") {
      continue;
    }
    const payment = paymentByBookingId.get(booking.id);

    const effectiveStatus = getEffectiveBookingStatus(
      toIBooking(booking),
      toIPayment(payment),
    );

    if (effectiveStatus === "cancelled") continue;

    const status = effectiveStatus === "confirmed" ? "confirmed" : "pending";

    if (status === "pending") {
      if (!isPendingVisibleOn(toIBooking(booking), today)) continue;
    } else if (booking.date !== today) {
      continue;
    }

    const customer = people.get(booking.customerId);
    const table = tableById.get(booking.tableId);

    visibleBookings.push({
      id: booking.id,
      date: booking.date,
      time: toTime(booking.time),
      guest: customer
        ? `${customer.firstName} ${customer.lastName}`
        : "Unknown guest",
      party: booking.partySize,
      table: table?.name ?? "Unknown",
      tableId: booking.tableId,
      status,
      isPaid: payment?.status === "paid",
      price: payment?.price ?? null,
    } satisfies DashboardBooking);
  }

  const tablesByFloor = new Map<number, DashboardTable[]>();
  for (const table of restaurantTables) {
    const entry: DashboardTable = {
      id: table.id,
      name: table.name,
      floor: table.floor,
      capacity: table.capacity,
      category: table.category,
    };
    const list = tablesByFloor.get(table.floor) ?? [];
    list.push(entry);
    tablesByFloor.set(table.floor, list);
  }

  return {
    restaurant: {
      id: restaurant?.id ?? RESTAURANT_ID,
      name: restaurant?.name ?? "My Restaurant",
      city: restaurant?.city ?? "",
    } as DashboardRestaurant,
    owner: {
      firstName: owner?.firstName ?? "Restaurant",
      lastName: owner?.lastName ?? "Owner",
      avatar: owner?.avatar ?? "",
    } as DashboardOwner,
    bookings: visibleBookings,
    tablesByFloor,
  };
}