"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@db/client";
import { bookings, reviews } from "@db/schema";
import { getDinerSession } from "@libs/session";

import restaurants from "@data/dummy/restaurants.json";
import tables from "@data/dummy/tables.json";

import type { IBooking, IReview } from "@types";

const BOOKINGS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/bookings.json",
);

const REVIEWS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/reviews.json",
);

function readBookings(): IBooking[] {
  return JSON.parse(readFileSync(BOOKINGS_FILE_PATH, "utf8")) as IBooking[];
}

function readReviews(): IReview[] {
  return JSON.parse(readFileSync(REVIEWS_FILE_PATH, "utf8")) as IReview[];
}

function buildNextReviewId(reviewsList: IReview[]): string {
  let max = 0;
  for (const review of reviewsList) {
    const sequence = Number(review.id.replace("review-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `review-${String(max + 1).padStart(3, "0")}`;
}

const MAX_COMMENT_LENGTH = 500;

export async function createReviewAction(
  bookingId: string,
  rating: number,
  comment: string,
): Promise<IReview> {
  const customer = await getDinerSession();
  if (!customer) redirect("/signin");

  const bookingsList = readBookings();
  const booking = bookingsList.find((item) => item.id === bookingId);
  if (!booking || booking.customerId !== customer.userId) {
    throw new Error("Booking not found.");
  }

  if (booking.status !== "completed") {
    throw new Error("You can only review a completed booking.");
  }

  const reviewsList = readReviews();
  if (reviewsList.some((item) => item.bookingId === bookingId)) {
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

  const table = tables.find((item) => item.id === booking.tableId);
  const restaurant = restaurants.find(
    (item) => item.id === table?.restaurantId,
  );

  const now = new Date().toISOString();
  const review: IReview = {
    id: buildNextReviewId(reviewsList),
    customerComment: trimmedComment,
    customerRating: rating,
    customerCommentAt: now,
    bookingId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const existingBooking =
      (
        await db
          .select({ id: bookings.id })
          .from(bookings)
          .where(eq(bookings.id, bookingId))
          .limit(1)
      )[0] ?? null;

    if (!existingBooking) {
      await db.insert(bookings).values({
        id: booking.id,
        date: booking.date,
        time: booking.time,
        partySize: booking.partySize,
        specialRequest: booking.specialRequest,
        status: booking.status,
        customerId: booking.customerId,
        tableId: booking.tableId,
        cancelledBy: booking.cancelled?.by,
        cancelledDate: booking.cancelled?.date,
        cancelledReason: booking.cancelled?.reason,
        createdAt: booking.createdAt ?? now,
        updatedAt: booking.updatedAt ?? now,
      }).onConflictDoNothing();
    }

    await db.insert(reviews).values({
      id: review.id,
      customerComment: review.customerComment,
      customerRating: review.customerRating,
      customerCommentAt: review.customerCommentAt,
      bookingId,
      createdAt: review.createdAt ?? now,
      updatedAt: review.updatedAt ?? now,
    });
  } catch {
    throw new Error("Your review could not be submitted right now.");
  }

  writeFileSync(
    REVIEWS_FILE_PATH,
    `${JSON.stringify([...reviewsList, review], null, 2)}\n`,
    "utf8",
  );

  revalidatePath(`/bookings/${bookingId}`, "page");
  revalidatePath("/bookings", "page");
  if (table && restaurant) {
    revalidatePath(`/restaurants/${restaurant.slug}`, "page");
  }
  revalidatePath("/restaurants", "page");

  return review;
}