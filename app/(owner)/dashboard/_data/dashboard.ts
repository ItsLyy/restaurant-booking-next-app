import { readFileSync } from "fs";
import path from "path";

import rawOwners from "../../../_data/dummy/owners.json";
import rawTables from "../../../_data/dummy/tables.json";
import rawRestaurants from "../../../_data/dummy/restaurants.json";
import rawUsers from "../../../_data/dummy/users.json";
import rawOfficers from "../../../_data/dummy/officers.json";

import { getEffectiveBookingStatus, isPendingVisibleOn } from "../../../_data/bookings/booking-deadline";

import type {
  IBooking,
  IOwner,
  IPayment,
  IRestaurant,
  ITable,
  IUser,
} from "@types";

const RESTAURANTS = rawRestaurants as IRestaurant[];
const OWNERS = rawOwners as IOwner[];
const TABLES = rawTables as ITable[];
const USERS = rawUsers as IUser[];

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

function readBookings(): IBooking[] {
  return readJson<IBooking[]>(BOOKINGS_FILE_PATH);
}

function readPayments(): IPayment[] {
  return readJson<IPayment[]>(PAYMENTS_FILE_PATH);
}

const OWNER_ID = "owner-001";
const RESTAURANT_ID = "rest-001";

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

export interface DashboardBooking {
  id: string;
  date: string;
  time: string;
  guest: string;
  party: number;
  table: string;
  status: "confirmed" | "pending";
  isPaid: boolean;
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

const getTableName = (tableId: string) =>
  TABLES.find((table) => table.id === tableId)?.name ?? "Unknown";

export const getDashboardData = () => {
  const restaurant = RESTAURANTS.find(
    (item) => item.id === RESTAURANT_ID,
  );
  const owner = OWNERS.find((item) => item.id === OWNER_ID);

  const restaurantTables = TABLES.filter(
    (table) => table.restaurantId === RESTAURANT_ID,
  );
  const tableIds = new Set(restaurantTables.map((table) => table.id));

  const BOOKINGS = readBookings();
  const payments = readPayments();

  const restaurantBookings = BOOKINGS.filter((booking) =>
    tableIds.has(booking.tableId),
  );

  const upcoming = restaurantBookings.filter(
    (booking) => booking.status !== "cancelled",
  );

  const paymentByBookingId = new Map(
    payments.map((item) => [item.bookingId, item] as const),
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
  for (const booking of upcoming) {
    const customer = PEOPLE.find((user) => user.id === booking.customerId);
    const payment = paymentByBookingId.get(booking.id);

    const effectiveStatus = getEffectiveBookingStatus(booking, payment);

    if (effectiveStatus === "cancelled") continue;

    const status = effectiveStatus === "confirmed" ? "confirmed" : "pending";

    // Pending requests: exist from the day they were placed until the day
    // before the reserved date (never on the reserved date itself).
    if (status === "pending") {
      if (!isPendingVisibleOn(booking, today)) continue;
    } else if (booking.date !== today) {
      // Confirmed bookings (paid or unpaid): only appear on their booking day.
      continue;
    }

    visibleBookings.push({
      id: booking.id,
      date: booking.date,
      time: toTime(booking.time),
      guest: customer
        ? `${customer.firstName} ${customer.lastName}`
        : "Unknown guest",
      party: booking.partySize,
      table: getTableName(booking.tableId),
      status,
      isPaid: payment?.status === "paid",
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
};