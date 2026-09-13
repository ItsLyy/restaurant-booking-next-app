"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@db/client";
import { reviews } from "@db/schema";
import { getDashboardRole } from "@libs/session";

import type { IReview } from "@types";

import {
  readAllReviews,
  writeAllReviews,
  getRestaurantSlugForReview,
} from "../_data/reviews";

const MAX_REPLY_LENGTH = 500;

export async function replyReviewAction(
  reviewId: string,
  reply: string,
): Promise<IReview> {
  const role = await getDashboardRole();
  if (!role) {
    throw new Error("You must be signed in to reply to reviews.");
  }

  const reviewsList = readAllReviews();
  const review = reviewsList.find((item) => item.id === reviewId);
  if (!review) {
    throw new Error("Review not found.");
  }

  const slug = getRestaurantSlugForReview(review);
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
    ...review,
    ownerReply: trimmedReply,
    ownerReplyAt: now,
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

  const synced = reviewsList.map((item) =>
    item.id === reviewId ? updatedReview : item,
  );
  writeAllReviews(synced);

  revalidatePath("/dashboard/reviews", "page");
  if (slug) {
    revalidatePath(`/restaurants/${slug}`, "page");
  }
  revalidatePath("/restaurants", "page");

  return updatedReview;
}