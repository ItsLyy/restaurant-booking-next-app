import { readFileSync } from "fs";
import path from "path";

import type { IBooking, IUser } from "@types";
import { toBookingCode } from "@data/bookings/booking-code";

const DUMMY_DIR = path.join(process.cwd(), "app/_data/dummy");
const USERS_FILE_PATH = path.join(DUMMY_DIR, "users.json");
const BOOKINGS_FILE_PATH = path.join(DUMMY_DIR, "bookings.json");
const TABLES_FILE_PATH = path.join(DUMMY_DIR, "tables.json");
const RESTAURANTS_FILE_PATH = path.join(DUMMY_DIR, "restaurants.json");

export interface CustomerRecentBooking {
  id: string;
  bookingCode: string;
  restaurantName: string;
  restaurantSlug: string;
  restaurantCity?: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
}

export interface CustomerProfileStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  allergiesCount: number;
}

export interface CustomerProfileData {
  user: IUser;
  stats: CustomerProfileStats;
  recentBookings: CustomerRecentBooking[];
}

export const getCustomerById = (customerId: string): IUser | undefined => {
  try {
    const users = JSON.parse(readFileSync(USERS_FILE_PATH, "utf8")) as IUser[];
    return users.find((user) => user.id === customerId) ?? undefined;
  } catch {
    return undefined;
  }
};

export const getCustomerProfile = (customerId: string): IUser | undefined =>
  getCustomerById(customerId);

interface TableItem {
  id: string;
  restaurantId: string;
}

interface RestaurantItem {
  id: string;
  name: string;
  slug: string;
  city?: string;
}

export const getCustomerProfileData = (
  customerId: string,
): CustomerProfileData | undefined => {
  const user = getCustomerById(customerId);
  if (!user) return undefined;

  let bookings: IBooking[] = [];
  let tables: TableItem[] = [];
  let restaurants: RestaurantItem[] = [];

  try {
    bookings = JSON.parse(readFileSync(BOOKINGS_FILE_PATH, "utf8")) as IBooking[];
  } catch {
    bookings = [];
  }

  try {
    tables = JSON.parse(readFileSync(TABLES_FILE_PATH, "utf8")) as TableItem[];
  } catch {
    tables = [];
  }

  try {
    restaurants = JSON.parse(
      readFileSync(RESTAURANTS_FILE_PATH, "utf8"),
    ) as RestaurantItem[];
  } catch {
    restaurants = [];
  }

  const userBookings = bookings.filter((b) => b.customerId === customerId);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = userBookings.filter(
    (b) =>
      b.date >= today && (b.status === "confirmed" || b.status === "pending"),
  );
  const completed = userBookings.filter((b) => b.status === "completed");

  // Sort: upcoming bookings first, then by date descending
  const sorted = [...userBookings].sort((a, b) => {
    const isUpcomingA =
      a.date >= today && (a.status === "confirmed" || a.status === "pending");
    const isUpcomingB =
      b.date >= today && (b.status === "confirmed" || b.status === "pending");

    if (isUpcomingA && !isUpcomingB) return -1;
    if (!isUpcomingA && isUpcomingB) return 1;

    const dtA = `${a.date}T${a.time}`;
    const dtB = `${b.date}T${b.time}`;
    return dtB.localeCompare(dtA);
  });

  const recentBookings: CustomerRecentBooking[] = sorted
    .slice(0, 3)
    .map((b) => {
      const table = tables.find((t) => t.id === b.tableId);
      const rest = restaurants.find((r) => r.id === table?.restaurantId);

      return {
        id: b.id,
        bookingCode: toBookingCode(b.id),
        restaurantName: rest?.name ?? "Restaurant",
        restaurantSlug: rest?.slug ?? "",
        restaurantCity: rest?.city,
        date: b.date,
        time: b.time,
        partySize: b.partySize,
        status: b.status,
      };
    });

  return {
    user,
    stats: {
      totalBookings: userBookings.length,
      upcomingBookings: upcoming.length,
      completedBookings: completed.length,
      allergiesCount: user.allergics.length,
    },
    recentBookings,
  };
};