import { readFileSync } from "fs";
import path from "path";

import type { IBooking, IOfficer, IOwner, IRestaurant, ITable } from "@types";

const OFFICERS_FILE_PATH = path.join(process.cwd(), "app/_data/dummy/officers.json");
const RESTAURANTS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/restaurants.json",
);
const OWNERS_FILE_PATH = path.join(process.cwd(), "app/_data/dummy/owners.json");
const TABLES_FILE_PATH = path.join(process.cwd(), "app/_data/dummy/tables.json");
const BOOKINGS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/bookings.json",
);

export interface OfficerDashboardData {
  officer: IOfficer;
  restaurant: IRestaurant;
  invitedByOwner?: IOwner;
  today: {
    bookings: number;
    active: number;
    guests: number;
  };
}

type JsonFile = "officers" | "restaurants" | "owners" | "tables" | "bookings";

const readJson = <T>(file: JsonFile): T =>
  JSON.parse(
    readFileSync(
      {
        officers: OFFICERS_FILE_PATH,
        restaurants: RESTAURANTS_FILE_PATH,
        owners: OWNERS_FILE_PATH,
        tables: TABLES_FILE_PATH,
        bookings: BOOKINGS_FILE_PATH,
      }[file],
      "utf8",
    ),
  ) as T;

export const getOfficerData = (
  officerId = "officer-001",
): OfficerDashboardData | undefined => {
  const officers = readJson<IOfficer[]>("officers");
  const officer = officers.find((item) => item.id === officerId);
  if (!officer) return undefined;

  const restaurants = readJson<IRestaurant[]>("restaurants");
  const restaurant = restaurants.find(
    (item) => item.id === officer.restaurantId,
  );
  if (!restaurant) return undefined;

  const owners = readJson<IOwner[]>("owners");
  const invitedByOwner = owners.find((item) => item.id === officer.invitedBy);

  const tables = readJson<ITable[]>("tables");
  const restaurantTableIds = new Set<string>();
  for (const table of tables) {
    if (table.restaurantId === officer.restaurantId) {
      restaurantTableIds.add(table.id);
    }
  }

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const todayBookings = readJson<IBooking[]>("bookings").filter(
    (booking) =>
      booking.tableId &&
      restaurantTableIds.has(booking.tableId) &&
      booking.date === today,
  );
  const active = todayBookings.filter(
    (booking) => booking.status !== "cancelled",
  );

  return {
    officer,
    restaurant,
    invitedByOwner: invitedByOwner ?? undefined,
    today: {
      bookings: todayBookings.length,
      active: active.length,
      guests: active.reduce((sum, booking) => sum + booking.partySize, 0),
    },
  };
};