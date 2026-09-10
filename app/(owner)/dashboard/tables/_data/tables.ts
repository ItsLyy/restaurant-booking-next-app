import { readFileSync } from "fs";
import path from "path";

import { formatTime } from "@utils";
import rawUsers from "@data/dummy/users.json";
import rawOwners from "@data/dummy/owners.json";
import rawOfficers from "@data/dummy/officers.json";

import { getEffectiveBookingStatus } from "../../../../_data/bookings/booking-deadline";

import { normalizeDate, shiftDate, todayString } from "../../_data/dates";

import type { IBooking, IPayment, ITable, IUser } from "@types";

export { normalizeDate, shiftDate, todayString };

export type { TableCategory, TablePlace, TableStatus } from "./table-meta";
export { PLACE_LABELS, TABLE_CATEGORIES } from "./table-meta";

import type { TablePlace, TableStatus } from "./table-meta";

const RESTAURANT_ID = "rest-001";

const USERS = rawUsers as IUser[];

const TABLES_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/tables.json",
);
const BOOKINGS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/bookings.json",
);
const PAYMENTS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/payments.json",
);

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

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

const PEOPLE: Person[] = [
  ...(rawOwners as Person[]),
  ...(rawOfficers as Person[]),
  ...USERS.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
  })),
];

const getPlace = (category: string): TablePlace =>
  category === "outdoor"
    ? "outdoor"
    : category === "private"
      ? "private"
      : "indoor";

export const getTablesData = (date: string): TablesData => {
  const restaurantTables = readJson<ITable[]>(TABLES_FILE_PATH).filter(
    (table) => table.restaurantId === RESTAURANT_ID,
  );
  const tableIds = new Set(restaurantTables.map((table) => table.id));

  const BOOKINGS = readJson<IBooking[]>(BOOKINGS_FILE_PATH);
  const payments = readJson<IPayment[]>(PAYMENTS_FILE_PATH);

  const paymentByBookingId = new Map(
    payments.map((item) => [item.bookingId, item] as const),
  );

  const dayBookings = BOOKINGS.filter(
    (booking) => tableIds.has(booking.tableId) && booking.date === date,
  );

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
      const customer = PEOPLE.find(
        (person) => person.id === booking.customerId,
      );
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
    };
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