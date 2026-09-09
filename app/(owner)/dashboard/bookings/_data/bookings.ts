import { readFileSync } from "fs";
import path from "path";

import { toBookingCode } from "@data/bookings/booking-code";
import rawTables from "@data/dummy/tables.json";
import rawUsers from "@data/dummy/users.json";
import rawOwners from "@data/dummy/owners.json";
import rawOfficers from "@data/dummy/officers.json";
import { formatTime } from "@utils";

import { getEffectiveBookingStatus, isPendingVisibleOn } from "../../../../_data/bookings/booking-deadline";

import type { IBooking, IPayment, ITable, IUser } from "@types";

const TABLES = rawTables as ITable[];
const USERS = rawUsers as IUser[];

interface Person {
  id: string;
  firstName: string;
  lastName: string;
}

const PEOPLE: Person[] = [
  ...USERS.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  })),
  ...(rawOwners as Person[]),
  ...(rawOfficers as Person[]),
];

const BOOKINGS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/bookings.json",
);
const PAYMENTS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/payments.json",
);

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

export const getBookingsData = (
  date: string = todayString(),
): { date: string; bookings: DetailedBooking[] } => {
  const untilToday = todayString();
  const restaurantTables = TABLES.filter(
    (table) => table.restaurantId === RESTAURANT_ID,
  );
  const tableIds = new Set(restaurantTables.map((table) => table.id));

  const raw: IBooking[] = JSON.parse(
    readFileSync(BOOKINGS_FILE_PATH, "utf8"),
  ) as IBooking[];
  const payments: IPayment[] = JSON.parse(
    readFileSync(PAYMENTS_FILE_PATH, "utf8"),
  ) as IPayment[];

  const paymentByBookingId = new Map(
    payments.map((item) => [item.bookingId, item] as const),
  );

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

  const bookings = selected
    .map((booking) => {
      const guest = PEOPLE.find((user) => user.id === booking.customerId);
      const payment = paymentByBookingId.get(booking.id);
      const status = deriveStatus(booking, payment, untilToday);
      const table = TABLES.find((item) => item.id === booking.tableId);

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