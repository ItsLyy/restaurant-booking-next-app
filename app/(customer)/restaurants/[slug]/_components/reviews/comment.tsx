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
    <div className="py-6 space-y-4 border-b-2 border-b-base-200">
      <header className="flex justify-between">
        <Profile
          name={customerName}
          avatar={customerAvatar}
          date={customerCommentAt}
        />
        <div className="flex gap-3 h-fit items-center text-accent-100">
          <StarIcon weight="duotone" size={24} />
          <span className="text-c-body text-accent-100">{customerRating}</span>
        </div>
      </header>
      <p className="text-c-body">{customerComment}</p>
      {ownerReply && ownerReplyAt && (
        <CommentReply
          ownerAvatar={ownerAvatar}
          ownerName={ownerName}
          ownerReply={ownerReply}
          ownerReplyAt={ownerReplyAt}
        />
      )}
    </div>
  );
};
