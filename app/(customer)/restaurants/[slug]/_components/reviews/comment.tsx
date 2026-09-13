import { StarIcon } from "@phosphor-icons/react/dist/ssr";

import { Profile } from "./profile";
import { CommentReply } from "./comment-reply";

import type { IReview } from "@types";

interface CommentProps extends Pick<
  IReview,
  | "customerComment"
  | "customerRating"
  | "customerCommentAt"
  | "ownerReply"
  | "ownerReplyAt"
> {
  customerName: string;
  customerAvatar: string;
  ownerName: string;
  ownerAvatar: string;
}

export const Comment = ({
  customerName,
  customerAvatar,
  customerCommentAt,
  customerComment,
  customerRating,
  ownerName,
  ownerAvatar,
  ownerReply,
  ownerReplyAt,
}: CommentProps) => {
  return (
    <article className="py-5 space-y-3.5 border-b border-base-200 transition-colors">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <Profile
          name={customerName}
          avatar={customerAvatar}
          date={customerCommentAt}
        />
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-base-200/80 border border-base-200"
          aria-label={`Rating: ${customerRating} out of 5 stars`}
        >
          <div className="flex items-center gap-0.5 text-accent-100">
            {Array.from({ length: 5 }, (_, i) => (
              <StarIcon
                key={i}
                size={14}
                weight={i < customerRating ? "fill" : "regular"}
                className={
                  i < customerRating ? "text-accent-100" : "text-muted/30"
                }
              />
            ))}
          </div>
          <span className="text-c-caption font-semibold text-foreground">
            {customerRating.toFixed(1)}
          </span>
        </div>
      </header>

      <p className="text-c-body text-foreground/90 leading-relaxed pl-1 sm:pl-2">
        {customerComment}
      </p>

      {ownerReply && ownerReplyAt && (
        <CommentReply
          ownerAvatar={ownerAvatar}
          ownerName={ownerName}
          ownerReply={ownerReply}
          ownerReplyAt={ownerReplyAt}
        />
      )}
    </article>
  );
};
