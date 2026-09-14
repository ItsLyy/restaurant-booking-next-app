import { eq, inArray } from "drizzle-orm";

import { db } from "@db/client";
import {
  bookings as bookingsTable,
  payments as paymentsTable,
  tables as tablesTable,
  users as usersTable,
} from "@db/schema";
import { toBookingCode } from "@data/bookings/booking-code";
import { getEffectiveBookingStatus, isPendingVisibleOn } from "@data/bookings/booking-deadline";
import { formatTime } from "@utils";

import type { BookingRow, PaymentRow } from "@db/schema";
import type { IBooking, IBookingCancelled, IPayment } from "@types";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

const RESTAURANT_ID = "rest-001";

export type DetailStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface DetailedBooking {
  id: string;
  code: string;
  date: string;
  time: string;
  guest: string;
  party: number;
  table: string;
  status: DetailStatus;
  isPaid: boolean;
  price: number | null;
}

export interface BookingsData {
  date: string;
  bookings: DetailedBooking[];
}

export const todayString = (): string => {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

export const normalizeDate = (value: string | string[] | undefined): string => {
  if (typeof value !== "string") return todayString();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return todayString();
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return todayString();
  return value;
};

export const shiftDate = (date: string, offsetDays: number): string => {
  const dateObj = new Date(`${date}T00:00:00`);
  dateObj.setDate(dateObj.getDate() + offsetDays);
  return [
    dateObj.getFullYear(),
    String(dateObj.getMonth() + 1).padStart(2, "0"),
    String(dateObj.getDate()).padStart(2, "0"),
  ].join("-");
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

const deriveStatus = (
  booking: IBooking,
  payment: IPayment | undefined,
  today: string,
): DetailStatus => {
  if (
    booking.status === "cancelled" ||
    booking.status === "no_show" ||
    getEffectiveBookingStatus(booking, payment) === "cancelled"
  ) {
    return "cancelled";
  }
  if (booking.status === "completed") return "completed";
  if (booking.status === "pending") return "pending";

  if (booking.date < today) {
    return payment?.status === "paid" ? "completed" : "cancelled";
  }
  return "confirmed";
};

export const getBookingsData = async (
  date: string = todayString(),
): Promise<BookingsData> => {
  const untilToday = todayString();

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

  const bookingRows = await db
    .select()
    .from(bookingsTable)
    .where(inArray(bookingsTable.tableId, [...tableIds]));
  const paymentRows = bookingRows.length
    ? await db
        .select()
        .from(paymentsTable)
        .where(
          inArray(
            paymentsTable.bookingId,
            bookingRows.map((row) => row.id),
          ),
        )
    : [];
  const paymentByBookingId = new Map<string, IPayment>(
    paymentRows.map((row) => [row.bookingId, toIPayment(row)]),
  );

  const raw: IBooking[] = bookingRows.map(toIBooking);

  const selected: IBooking[] = [];
  for (const booking of raw) {
    if (!tableIds.has(booking.tableId)) continue;
    const payment = paymentByBookingId.get(booking.id);
    const status = deriveStatus(booking, payment, untilToday);

    if (status === "cancelled") {
      if (booking.date === date) selected.push(booking);
      continue;
    }
    if (booking.date === date) {
      const sameDayRequest =
        booking.createdAt?.split("T")[0] === booking.date;
      if (status === "pending" && !sameDayRequest) continue;
      selected.push(booking);
      continue;
    }
    if (status === "pending" && isPendingVisibleOn(booking, date)) {
      selected.push(booking);
    }
  }
  selected.sort((a, b) => a.time.localeCompare(b.time));

  const bookings = selected.map((booking) => {
    const guest = people.get(booking.customerId);
    const payment = paymentByBookingId.get(booking.id);
    const status = deriveStatus(booking, payment, untilToday);
    const table = restaurantTables.find((item) => item.id === booking.tableId);

    return {
      id: booking.id,
      code: toBookingCode(booking.id),
      date: booking.date,
      time: formatTime(booking.time),
      guest: guest
        ? `${guest.firstName} ${guest.lastName}`
        : "Unknown guest",
      party: booking.partySize,
      table: table?.name ?? "Unknown",
      status,
      isPaid: payment?.status === "paid",
      price: payment?.price ?? null,
    } satisfies DetailedBooking;
  });

  return { date, bookings };
};

export interface BookingCounts {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export const getBookingsCounts = (
  bookings: DetailedBooking[],
): BookingCounts => ({
  total: bookings.length,
  pending: bookings.filter((item) => item.status === "pending").length,
  confirmed: bookings.filter((item) => item.status === "confirmed").length,
  completed: bookings.filter((item) => item.status === "completed").length,
  cancelled: bookings.filter((item) => item.status === "cancelled").length,
});

export interface DetailedBookingInfo {
  id: string;
  code: string;
  date: string;
  time: string;
  guest: string;
  party: number;
  table: string;
  status: DetailStatus;
  specialRequest: string | null;
  isPaid: boolean;
  price: number | null;
  paymentDeadline: string | null;
  createdAt: string;
  updatedAt: string | null;
  cancelled: IBookingCancelled | null;
}

export const getBookingInfo = async (
  id: string,
): Promise<DetailedBookingInfo | null> => {
  const bookingRows = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, id))
    .limit(1);
  const bookingRow = bookingRows[0];
  if (!bookingRow) return null;
  const booking = toIBooking(bookingRow);

  const tableRows = await db
    .select()
    .from(tablesTable)
    .where(eq(tablesTable.id, booking.tableId))
    .limit(1);
  const table = tableRows[0];
  if (!table || table.restaurantId !== RESTAURANT_ID) return null;

  const paymentRows = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.bookingId, id))
    .limit(1);
  const paymentRow = paymentRows[0];
  const payment = paymentRow ? toIPayment(paymentRow) : undefined;

  const guestRows = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
    })
    .from(usersTable)
    .where(eq(usersTable.id, booking.customerId))
    .limit(1);
  const guest = guestRows[0];

  const status = deriveStatus(booking, payment, todayString());

  let cancelled: IBookingCancelled | null = null;
  if (status === "cancelled") {
    if (booking.cancelled) {
      cancelled = booking.cancelled;
    } else {
      const overdue =
        payment !== undefined &&
        payment.status === "unpaid" &&
        payment.deadline !== undefined &&
        payment.deadline < new Date().toISOString();
      cancelled = {
        date: todayString(),
        by: "restaurant",
        reason: overdue
          ? "Payment deadline passed. The booking was automatically cancelled."
          : "The booking was not confirmed within 72 hours and was automatically cancelled.",
      };
    }
  }

  return {
    id: booking.id,
    code: toBookingCode(booking.id),
    date: booking.date,
    time: formatTime(booking.time),
    guest: guest
      ? `${guest.firstName} ${guest.lastName}`
      : "Unknown guest",
    party: booking.partySize,
    table: table.name,
    status,
    specialRequest: booking.specialRequest ?? null,
    isPaid: payment?.status === "paid",
    price: payment?.price ?? null,
    paymentDeadline: payment?.deadline ?? null,
    createdAt: booking.createdAt ?? "",
    updatedAt: booking.updatedAt ?? null,
    cancelled,
  };
};