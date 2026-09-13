import { eq, inArray } from "drizzle-orm";

import { db } from "@db/client";
import { bookings, payments, restaurants, restaurantHours, tables } from "@db/schema";

import { getEffectiveBookingStatus } from "../bookings/booking-deadline";

import type { IBooking, IPayment, ITable } from "@types";

export interface RestaurantAvailability {
  slotsByDay: Record<number, string[]>;
  tables: ITable[];
  busyTablesByTime: Record<string, Record<string, string[]>>;
}

const SLOT_INTERVAL_MINUTES = 30;

function toMinutes(time: string): number {
  const hours = Number(time.slice(0, 2));
  const minutes = Number(time.slice(3, 5));
  return hours * 60 + minutes;
}

function toTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function buildTimeSlots(openTime: string, closeTime: string): string[] {
  const open = toMinutes(openTime);
  const close = toMinutes(closeTime);
  const slots: string[] = [];
  for (let time = open; time < close; time += SLOT_INTERVAL_MINUTES) {
    slots.push(toTimeString(time));
  }
  return slots;
}

export async function getRestaurantAvailability(
  slug: string,
): Promise<RestaurantAvailability> {
  const restaurant =
    (
      await db
        .select()
        .from(restaurants)
        .where(eq(restaurants.slug, slug))
        .limit(1)
    )[0] ?? null;
  if (!restaurant) {
    return { slotsByDay: {}, tables: [], busyTablesByTime: {} };
  }

  const [restaurantTables, restaurantHourRows] = await Promise.all([
    db
      .select()
      .from(tables)
      .where(eq(tables.restaurantId, restaurant.id)),
    db
      .select()
      .from(restaurantHours)
      .where(eq(restaurantHours.restaurantId, restaurant.id)),
  ]);

  const restaurantTableIds = new Set(
    restaurantTables.map((table) => table.id),
  );

  const slotsByDay: Record<number, string[]> = {};
  for (const hours of restaurantHourRows) {
    slotsByDay[hours.dayOfWeek] = buildTimeSlots(
      hours.openTime,
      hours.closeTime,
    );
  }

  const restaurantBookings = restaurantTableIds.size
    ? await db
        .select()
        .from(bookings)
        .where(inArray(bookings.tableId, [...restaurantTableIds]))
    : [];

  const bookingIds = restaurantBookings.map((booking) => booking.id);
  const paymentRows = bookingIds.length
    ? await db.select().from(payments).where(inArray(payments.bookingId, bookingIds))
    : [];

  const paymentByBookingId = new Map(
    paymentRows.map((item) => [item.bookingId, item] as const),
  );
  const busySetBySlot = new Map<string, Set<string>>();
  for (const booking of restaurantBookings) {
    if (booking.status === "cancelled" || booking.status === "no_show") {
      continue;
    }
    const payment = paymentByBookingId.get(booking.id) as
      | IPayment
      | undefined;
    if (getEffectiveBookingStatus(booking as IBooking, payment) === "cancelled") {
      continue;
    }

    const slotKey = `${booking.date}|${booking.time}`;
    const busy = busySetBySlot.get(slotKey) ?? new Set<string>();
    busy.add(booking.tableId);
    busySetBySlot.set(slotKey, busy);
  }

  const busyTablesByTime: Record<string, Record<string, string[]>> = {};
  for (const [slotKey, busy] of busySetBySlot) {
    const [date, time] = slotKey.split("|");
    const byDate = busyTablesByTime[date] ?? {};
    byDate[time] = [...busy];
    busyTablesByTime[date] = byDate;
  }

  return {
    slotsByDay,
    tables: restaurantTables as ITable[],
    busyTablesByTime,
  };
}