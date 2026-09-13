import { StarIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";

import { ReviewButton } from "./review-button";

import type { IReview } from "@types";

export const CompletedState = ({
  bookingId,
  restaurantSlug,
  review,
}: {
  bookingId: string;
  restaurantSlug: string;
  review: IReview | null;
}) => {
  return (
    <>
      {review ? (
        <div className="w-full rounded-2xl border border-positive bg-positive/10 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <StarIcon
              size={20}
              weight="fill"
              className="text-amber-500"
            />
            <span className="text-c-body text-foreground">
              {review.customerRating} / 5
            </span>
            <span className="ml-auto text-c-caption text-muted">
              Review submitted
            </span>
          </div>
          <p className="text-c-body text-foreground">
            {review.customerComment}
          </p>
        </div>
      ) : (
        <ReviewButton bookingId={bookingId} />
      )}
      <Button
        as="link"
        href={`/restaurants/${restaurantSlug}#reviews`}
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        View restaurant reviews
      </Button>
      <Button
        as="link"
        href={`/restaurants/${restaurantSlug}`}
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        Rebook this restaurant
      </Button>
      <Button
        as="link"
        href="/restaurants"
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        Find other restaurants
      </Button>
    </>
  );
};