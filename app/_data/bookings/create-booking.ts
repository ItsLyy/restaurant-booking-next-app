import { readFileSync, writeFileSync } from "fs";
import path from "path";

import restaurants from "@data/dummy/restaurants.json";
import tables from "@data/dummy/tables.json";

import type { IBooking, ITable } from "@types";

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

const CUSTOMER_ID = "user-001";
const CONFIRMED_STATUS = "confirmed";

export class RestaurantNotFoundError extends Error {
  name = "RestaurantNotFoundError";
}

export class RestaurantNoTablesError extends Error {
  name = "RestaurantNoTablesError";
}

export class BookingSlotUnavailableError extends Error {
  name = "BookingSlotUnavailableError";
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

export async function createBooking(
  input: CreateBookingInput,
): Promise<IBooking> {
  const { restaurantId, date, time, partySize, specialRequest } = input;

  const restaurant = restaurants.find((item) => item.id === restaurantId);
  if (!restaurant) {
    throw new RestaurantNotFoundError("The restaurant does not exist.");
  }

  const restaurantTables = findRestaurantTables(restaurantId);
  if (restaurantTables.length === 0) {
    throw new RestaurantNoTablesError("This restaurant has no bookable tables yet.");
  }

  const bookings = readBookings();

  const busyTableIds = new Set<string>();
  for (const booking of bookings) {
    if (booking.status === "cancelled" || booking.status === "no_show") {
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

  const now = new Date().toISOString();
  const booking: IBooking = {
    id: buildNextBookingId(bookings),
    date,
    time,
    partySize,
    ...(specialRequest ? { specialRequest } : {}),
    status: CONFIRMED_STATUS,
    customerId: CUSTOMER_ID,
    tableId: bestTable.id,
    createdAt: now,
    updatedAt: now,
  };

  bookings.push(booking);

  try {
    writeFileSync(
      BOOKINGS_FILE_PATH,
      `${JSON.stringify(bookings, null, 2)}\n`,
      "utf8",
    );
  } catch {
    throw new BookingWriteError("Could not save the booking.");
  }

  return booking;
}