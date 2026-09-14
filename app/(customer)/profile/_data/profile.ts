import "server-only";

import { eq, inArray } from "drizzle-orm";

import { db } from "@db/client";
import { bookings, restaurants, tables, users } from "@db/schema";
import { toBookingCode } from "@data/bookings/booking-code";

import type { IUser } from "@types";

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

export const getCustomerById = async (
  customerId: string,
): Promise<IUser | undefined> => {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, customerId))
    .limit(1);
  const row = rows[0];
  if (!row) return undefined;

  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    firstName: row.firstName,
    lastName: row.lastName,
    role: row.role,
    emailVerifyAt: row.emailVerifyAt,
    allergics: row.allergics,
    avatar: row.avatar ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

export const getCustomerProfile = async (
  customerId: string,
): Promise<IUser | undefined> => getCustomerById(customerId);

export const getCustomerProfileData = async (
  customerId: string,
): Promise<CustomerProfileData | undefined> => {
  const user = await getCustomerById(customerId);
  if (!user) return undefined;

  const userBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.customerId, customerId));

  const tableIds = [...new Set(userBookings.map((b) => b.tableId))];
  const tableRows = tableIds.length
    ? await db.select().from(tables).where(inArray(tables.id, tableIds))
    : [];

  const restaurantIds = [
    ...new Set(tableRows.map((t) => t.restaurantId)),
  ];
  const restaurantRows = restaurantIds.length
    ? await db
        .select()
        .from(restaurants)
        .where(inArray(restaurants.id, restaurantIds))
    : [];

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
      const table = tableRows.find((t) => t.id === b.tableId);
      const rest = restaurantRows.find((r) => r.id === table?.restaurantId);

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