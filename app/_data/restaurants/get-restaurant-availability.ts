import bookings from "../dummy/bookings.json";
import restaurants from "../dummy/restaurants.json";
import restaurantHours from "../dummy/restaurant_hours.json";
import tables from "../dummy/tables.json";

import type { ITable } from "@types";

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
  const restaurant = restaurants.find((item) => item.slug === slug);
  if (!restaurant) {
    return { slotsByDay: {}, tables: [], busyTablesByTime: {} };
  }

  const restaurantTableIds = new Set<string>();
  const restaurantTables: ITable[] = [];
  for (const table of tables) {
    if (table.restaurantId === restaurant.id) {
      restaurantTableIds.add(table.id);
      restaurantTables.push(table as ITable);
    }
  }

  const slotsByDay: Record<number, string[]> = {};
  for (const hours of restaurantHours) {
    if (hours.restaurantId !== restaurant.id) {
      continue;
    }
    slotsByDay[hours.dayOfWeek] = buildTimeSlots(
      hours.openTime,
      hours.closeTime,
    );
  }

  const busySetBySlot = new Map<string, Set<string>>();
  for (const booking of bookings) {
    if (booking.status === "cancelled" || booking.status === "no_show") {
      continue;
    }
    if (!restaurantTableIds.has(booking.tableId)) {
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

  return { slotsByDay, tables: restaurantTables, busyTablesByTime };
}