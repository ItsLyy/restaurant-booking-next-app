"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@db/client";
import { reviews } from "@db/schema";
import { getDashboardRole } from "@libs/session";

import type { IReview } from "@types";

import { getRestaurantSlugForReview } from "../_data/reviews";

const MAX_REPLY_LENGTH = 500;

export async function replyReviewAction(
  reviewId: string,
  reply: string,
): Promise<IReview> {
  const role = await getDashboardRole();
  if (!role) {
    throw new Error("You must be signed in to reply to reviews.");
  }

  const reviewRows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, reviewId))
    .limit(1);
  const review = reviewRows[0];
  if (!review) {
    throw new Error("Review not found.");
  }

  const slug = await getRestaurantSlugForReview({
    id: review.id,
    customerComment: review.customerComment,
    customerRating: review.customerRating,
    customerCommentAt: review.customerCommentAt,
    bookingId: review.bookingId,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  });
  if (slug !== "sakura-garden") {
    throw new Error("This review does not belong to your restaurant.");
  }

  const trimmedReply = reply.trim();
  if (!trimmedReply) {
    throw new Error("Please write a reply before saving.");
  }
  if (trimmedReply.length > MAX_REPLY_LENGTH) {
    throw new Error(
      `Your reply must be shorter than ${MAX_REPLY_LENGTH} characters.`,
    );
  }

  const now = new Date().toISOString();
  const updatedReview: IReview = {
    id: review.id,
    customerComment: review.customerComment,
    customerRating: review.customerRating,
    customerCommentAt: review.customerCommentAt,
    bookingId: review.bookingId,
    ownerReply: trimmedReply,
    ownerReplyAt: now,
    createdAt: review.createdAt,
    updatedAt: now,
  };

  try {
    await db
      .update(reviews)
      .set({ ownerReply: trimmedReply, ownerReplyAt: now, updatedAt: now })
      .where(eq(reviews.id, reviewId));
  } catch {
    throw new Error("Your reply could not be saved right now.");
  }

  revalidatePath("/dashboard/reviews", "page");
  if (slug) {
    revalidatePath(`/restaurants/${slug}`, "page");
  }
  revalidatePath("/restaurants", "page");

  return updatedReview;
}