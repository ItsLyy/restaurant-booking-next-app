"use client";

import { useState } from "react";

import { StarIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";

import { Comment } from "./comment";

import type { IOwner, IReview, IUser } from "@types";

const INITIAL_VISIBLE = 3;

interface ReviewsProps {
  reviews: (IReview & { customer: Omit<IUser, "role"> })[];
  owner: Omit<IOwner, "role">;
}

export const Reviews = ({ reviews, owner }: ReviewsProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const totalReviews = reviews.length;
  const isLimited = visibleCount < totalReviews;
  const visibleReviews = reviews.slice(0, visibleCount);

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.customerRating, 0) /
          totalReviews
        ).toFixed(1)
      : "0.0";

  const numRating = Number.parseFloat(averageRating);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-base-200 bg-base-200/60 rounded-2xl">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-100/10 text-accent-100">
            <StarIcon size={26} weight="duotone" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {averageRating}
              </span>
              <span className="text-c-caption text-muted">/ 5.0</span>
              <div className="flex items-center gap-0.5 ml-1 text-accent-100">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon
                    key={i}
                    size={15}
                    weight={i < Math.round(numRating) ? "fill" : "regular"}
                    className={
                      i < Math.round(numRating)
                        ? "text-accent-100"
                        : "text-muted/30"
                    }
                  />
                ))}
              </div>
            </div>
            <span className="text-c-caption text-muted">
              {totalReviews === 0
                ? "No reviews yet"
                : `Based on ${totalReviews} verified guest review${totalReviews === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>

        {totalReviews > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-positive/30 bg-positive/10 text-positive text-xs font-medium w-fit">
            <span>
              {Math.round(
                (reviews.filter((r) => r.customerRating >= 4).length /
                  totalReviews) *
                  100,
              )}
              % positive ratings
            </span>
          </div>
        )}
      </div>

      {totalReviews === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-base-200 py-12 text-center">
          <StarIcon size={32} weight="duotone" className="text-muted/60" />
          <p className="text-c-body text-foreground font-medium">
            No reviews yet
          </p>
          <p className="text-c-caption text-muted max-w-sm">
            Be the first guest to share your dining experience after booking a
            table.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleReviews.map((review) => (
            <Comment
              key={review.id}
              customerComment={review.customerComment}
              customerName={`${review.customer.firstName} ${review.customer.lastName}`}
              customerCommentAt={review.customerCommentAt}
              customerRating={review.customerRating}
              customerAvatar={review.customer.avatar ?? "/"}
              ownerAvatar={owner.avatar ?? "/"}
              ownerName={`${owner.firstName} ${owner.lastName}`}
              ownerReply={review.ownerReply}
              ownerReplyAt={review.ownerReplyAt}
            />
          ))}
        </div>
      )}

      {totalReviews > INITIAL_VISIBLE && (
        <div className="pt-2">
          {isLimited ? (
            <Button
              variant="outline"
              className="w-full border! rounded-2xl! cursor-pointer transition hover:bg-base-200"
              onClick={() => setVisibleCount(totalReviews)}
            >
              Load More ({totalReviews})
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full border! border-dashed! rounded-2xl! text-muted hover:text-foreground cursor-pointer"
              onClick={() => setVisibleCount(INITIAL_VISIBLE)}
            >
              Show less
            </Button>
          )}
        </div>
      )}
    </>
  );
};