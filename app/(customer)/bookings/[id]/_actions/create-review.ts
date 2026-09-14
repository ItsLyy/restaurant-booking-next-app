"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { like, eq } from "drizzle-orm";

import { db } from "@db/client";
import { bookings, restaurants, reviews, tables } from "@db/schema";
import { getDinerSession } from "@libs/session";

import type { IReview } from "@types";

const MAX_COMMENT_LENGTH = 500;

async function buildNextReviewId(): Promise<string> {
  const rows = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(like(reviews.id, "review-%"));
  let max = 0;
  for (const row of rows) {
    const sequence = Number(row.id.replace("review-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `review-${String(max + 1).padStart(3, "0")}`;
}

export async function createReviewAction(
  bookingId: string,
  rating: number,
  comment: string,
): Promise<IReview> {
  const customer = await getDinerSession();
  if (!customer) redirect("/signin");

  const bookingRow = (
    await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1)
  )[0];
  if (!bookingRow || bookingRow.customerId !== customer.userId) {
    throw new Error("Booking not found.");
  }

  if (bookingRow.status !== "completed") {
    throw new Error("You can only review a completed booking.");
  }

  const existingReview = (
    await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.bookingId, bookingId))
      .limit(1)
  )[0];
  if (existingReview) {
    throw new Error("You have already reviewed this booking.");
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Please choose a rating from 1 to 5 stars.");
  }

  const trimmedComment = comment.trim();
  if (!trimmedComment) {
    throw new Error("Please write a short comment about your visit.");
  }
  if (trimmedComment.length > MAX_COMMENT_LENGTH) {
    throw new Error(
      `Your comment must be shorter than ${MAX_COMMENT_LENGTH} characters.`,
    );
  }

  const tableRow = (
    await db
      .select({ restaurantId: tables.restaurantId })
      .from(tables)
      .where(eq(tables.id, bookingRow.tableId))
      .limit(1)
  )[0];
  const restaurantRow = tableRow
    ? (
        await db
          .select()
          .from(restaurants)
          .where(eq(restaurants.id, tableRow.restaurantId))
          .limit(1)
      )[0]
    : undefined;

  const now = new Date().toISOString();
  const review: IReview = {
    id: await buildNextReviewId(),
    customerComment: trimmedComment,
    customerRating: rating,
    customerCommentAt: now,
    bookingId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.insert(reviews).values({
      id: review.id,
      customerComment: review.customerComment,
      customerRating: review.customerRating,
      customerCommentAt: review.customerCommentAt,
      bookingId,
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    throw new Error("Your review could not be submitted right now.");
  }

  revalidatePath(`/bookings/${bookingId}`, "page");
  revalidatePath("/bookings", "page");
  if (restaurantRow) {
    revalidatePath(`/restaurants/${restaurantRow.slug}`, "page");
  }
  revalidatePath("/restaurants", "page");

  return review;
}