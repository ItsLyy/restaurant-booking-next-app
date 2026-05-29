import { Profile } from "./profile";

interface CommentReplyProps {
  ownerName: string;
  ownerAvatar: string;
  ownerReply: string;
  ownerReplyAt: string;
}

export const CommentReply = ({
  ownerName,
  ownerAvatar,
  ownerReply,
  ownerReplyAt,
}: CommentReplyProps) => {
  return (
    <div className="px-1">
      <div className="rounded-lg border border-muted bg-base-200 p-3 space-y-4">
        <header>
          <Profile name={ownerName} avatar={ownerAvatar} date={ownerReplyAt} />
        </header>
        <p>{ownerReply}</p>
      </div>
    </div>
  );
};
