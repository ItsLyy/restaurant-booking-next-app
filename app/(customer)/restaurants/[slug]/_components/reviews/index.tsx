import { StarIcon } from "@phosphor-icons/react/dist/ssr";

import { Comment } from "./comment";

import type { IOwner, IReview, IUser } from "@types";

interface ReviewsProps {
  reviews: (IReview & { customer: Omit<IUser, "role"> })[];
  owner: Omit<IOwner, "role">;
}

export const Reviews = ({ reviews, owner }: ReviewsProps) => {
  return (
    <>
      <div className="flex items-center gap-3 px-6 py-3 border border-positive bg-positive/20 text-positive rounded-lg">
        <StarIcon size={20} weight="duotone" />
        <span className="text-c-button font-normal">
          <span className="text-[20px] font-medium">
            {reviews.reduce((acc, curr) => acc + curr.customerRating, 0) /
              reviews.length}{" "}
          </span>
          / 5.0 out of total {reviews.length}
        </span>
      </div>
      <div className="space-y-6">
        {reviews?.map((review) => (
          <Comment
            key={review.id}
            customerComment={review.customerComment}
            customerName={review.customer.username}
            customerCommentAt={review.customerCommentAt}
            customerRating={review.customerRating}
            customerAvatar={review.customer.avatar ?? "/"}
            ownerAvatar={owner?.avatar ?? "/"}
            ownerName={owner?.username}
            ownerReply={review.ownerReply}
            ownerReplyAt={review.ownerReplyAt}
          />
        ))}
      </div>
    </>
  );
};
