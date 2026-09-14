import { and, eq, inArray } from "drizzle-orm";

import { formatTime } from "@utils";
import { db } from "@db/client";
import {
  bookings as bookingsTable,
  payments as paymentsTable,
  tables as tablesTable,
  users as usersTable,
} from "@db/schema";
import { getEffectiveBookingStatus } from "@data/bookings/booking-deadline";

import { normalizeDate, shiftDate, todayString } from "../../_data/dates";

import type { BookingRow, PaymentRow } from "@db/schema";
import type { IBooking, IPayment } from "@types";

export { normalizeDate, shiftDate, todayString };

export type { TableCategory, TablePlace, TableStatus } from "./table-meta";
export { PLACE_LABELS, TABLE_CATEGORIES } from "./table-meta";

import type { TablePlace, TableStatus } from "./table-meta";

const RESTAURANT_ID = "rest-001";

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

const toIPayment = (row: PaymentRow): IPayment => ({
  id: row.id,
  price: row.price,
  status: row.status,
  deadline: row.deadline,
  gatewayToken: row.gatewayToken,
  bookingId: row.bookingId,
  paidAt: row.paidAt ?? undefined,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export interface TableDayBooking {
  id: string;
  guest: string;
  time: string;
  party: number;
  paid: boolean;
}

export interface TableDayInfo {
  id: string;
  name: string;
  place: TablePlace;
  floor: number;
  capacity: number;
  price: number;
  status: TableStatus;
  bookings: TableDayBooking[];
}

export interface TablesData {
  totals: {
    free: number;
    reserved: number;
    occupied: number;
    total: number;
  };
  placeCounts: {
    all: number;
    indoor: number;
    outdoor: number;
    private: number;
  };
  statusCounts: {
    all: number;
    free: number;
    reserved: number;
    occupied: number;
  };
  tables: TableDayInfo[];
}

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

const getPlace = (category: string): TablePlace =>
  category === "outdoor"
    ? "outdoor"
    : category === "private"
      ? "private"
      : "indoor";

export const getTablesData = async (date: string): Promise<TablesData> => {
  const [restaurantTables, userRows] = await Promise.all([
    db
      .select()
      .from(tablesTable)
      .where(eq(tablesTable.restaurantId, RESTAURANT_ID)),
    db
      .select({
        id: usersTable.id,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
      })
      .from(usersTable),
  ]);
  const tableIds = new Set(restaurantTables.map((table) => table.id));
  const people = new Map<string, Person>(
    userRows.map((user) => [
      user.id,
      { id: user.id, firstName: user.firstName, lastName: user.lastName },
    ]),
  );

  const dayBookingRows = await db
    .select()
    .from(bookingsTable)
    .where(
      and(
        inArray(bookingsTable.tableId, [...tableIds]),
        eq(bookingsTable.date, date),
      ),
    );

  const paymentRows = dayBookingRows.length
    ? await db
        .select()
        .from(paymentsTable)
        .where(
          inArray(
            paymentsTable.bookingId,
            dayBookingRows.map((row) => row.id),
          ),
        )
    : [];
  const paymentByBookingId = new Map<string, IPayment>(
    paymentRows.map((row) => [row.bookingId, toIPayment(row)]),
  );

  const dayBookings: IBooking[] = dayBookingRows.map(toIBooking);
  const dayBookingsByTable = new Map<string, IBooking[]>();
  for (const booking of dayBookings) {
    const list = dayBookingsByTable.get(booking.tableId);
    if (list) list.push(booking);
    else dayBookingsByTable.set(booking.tableId, [booking]);
  }

  const tables = restaurantTables.map((table) => {
    const rawTableBookings = [
      ...(dayBookingsByTable.get(table.id) ?? []),
    ].sort((a, b) => a.time.localeCompare(b.time));

    const bookings: TableDayBooking[] = [];
    for (const booking of rawTableBookings) {
      const payment = paymentByBookingId.get(booking.id);
      if (getEffectiveBookingStatus(booking, payment) !== "confirmed") {
        continue;
      }
      const customer = people.get(booking.customerId);
      bookings.push({
        id: booking.id,
        guest: customer
          ? `${customer.firstName} ${customer.lastName}`
          : "Unknown guest",
        time: formatTime(booking.time),
        party: booking.partySize,
        paid: payment?.status === "paid",
      });
    }

    const status: TableStatus = bookings.some((booking) => booking.paid)
      ? "occupied"
      : bookings.length > 0
        ? "reserved"
        : "free";

    return {
      id: table.id,
      name: table.name,
      place: getPlace(table.category),
      floor: table.floor,
      capacity: table.capacity,
      price: table.price,
      status,
      bookings,
    } satisfies TableDayInfo;
  });

  const placeCounts: TablesData["placeCounts"] = {
    all: tables.length,
    indoor: 0,
    outdoor: 0,
    private: 0,
  };
  const statusCounts: TablesData["statusCounts"] = {
    all: tables.length,
    free: 0,
    reserved: 0,
    occupied: 0,
  };

  for (const table of tables) {
    placeCounts[table.place] += 1;
    statusCounts[table.status] += 1;
  }

  return {
    totals: {
      free: statusCounts.free,
      reserved: statusCounts.reserved,
      occupied: statusCounts.occupied,
      total: tables.length,
    },
    placeCounts,
    statusCounts,
    tables,
  };
};