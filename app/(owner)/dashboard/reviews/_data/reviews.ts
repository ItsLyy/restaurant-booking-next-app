import { eq, inArray } from "drizzle-orm";

import { db } from "@db/client";
import {
  bookings,
  restaurants,
  reviews,
  tables,
  users,
} from "@db/schema";

import type { ReviewRow } from "@db/schema";
import type { IReview } from "@types";

const RESTAURANT_ID = "rest-001";

const toIReview = (row: ReviewRow): IReview => ({
  id: row.id,
  customerComment: row.customerComment,
  customerRating: row.customerRating,
  customerCommentAt: row.customerCommentAt,
  bookingId: row.bookingId,
  ...(row.ownerReply ? { ownerReply: row.ownerReply } : {}),
  ...(row.ownerReplyAt ? { ownerReplyAt: row.ownerReplyAt } : {}),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export async function readAllReviews(): Promise<IReview[]> {
  const rows = await db.select().from(reviews);
  return rows.map(toIReview);
}

export async function getRestaurantSlugForReview(
  review: IReview,
): Promise<string | null> {
  const bookingRows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, review.bookingId))
    .limit(1);
  const booking = bookingRows[0];
  if (!booking) return null;
  const table = await db
    .select()
    .from(tables)
    .where(eq(tables.id, booking.tableId))
    .limit(1);
  const tableRow = table[0];
  if (!tableRow) return null;
  const restaurant = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, tableRow.restaurantId))
    .limit(1);
  return restaurant[0]?.slug ?? null;
}

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface DashboardReview {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  commentAt: string;
  ownerReply?: string;
  ownerReplyAt?: string;
}

export async function getDashboardReviews(): Promise<DashboardReview[]> {
  const [restaurantTables, userRows, reviewRows] = await Promise.all([
    db
      .select()
      .from(tables)
      .where(eq(tables.restaurantId, RESTAURANT_ID)),
    db
      .select()
      .from(users),
    db.select().from(reviews),
  ]);
  const tableIds = new Set(restaurantTables.map((table) => table.id));

  const bookingRows = await db
    .select()
    .from(bookings)
    .where(inArray(bookings.tableId, [...tableIds]));
  const bookingById = new Map(bookingRows.map((booking) => [booking.id, booking]));

  const personById = new Map<string, Person>(
    userRows.map((user) => [
      user.id,
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar ?? "",
      },
    ]),
  );

  return reviewRows
    .map((row) => {
      const review = toIReview(row);
      const booking = bookingById.get(review.bookingId);
      if (!booking || !tableIds.has(booking.tableId)) return null;

      const person = personById.get(booking.customerId);

      return {
        id: review.id,
        bookingId: review.bookingId,
        customerId: booking.customerId,
        customerName: person
          ? `${person.firstName} ${person.lastName}`
          : "Unknown guest",
        customerAvatar: person?.avatar ?? "",
        rating: review.customerRating,
        comment: review.customerComment,
        commentAt: review.customerCommentAt,
        ownerReply: review.ownerReply,
        ownerReplyAt: review.ownerReplyAt,
      } as DashboardReview;
    })
    .filter((review): review is DashboardReview => review !== null)
    .sort((a, b) => b.commentAt.localeCompare(a.commentAt));
}