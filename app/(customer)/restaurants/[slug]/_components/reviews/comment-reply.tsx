import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";

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
    <div className="mt-3 pl-3 sm:pl-6 border-l-2 border-accent-100/40">
      <div className="rounded-xl border border-base-200 bg-base-200/50 p-4 space-y-2.5">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Profile
              name={ownerName}
              avatar={ownerAvatar}
              date={ownerReplyAt}
            />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-100/10 px-2.5 py-0.5 text-[11px] font-medium text-accent-100 border border-accent-100/20">
            <CheckCircleIcon size={13} weight="fill" />
            Response from restaurant
          </span>
        </header>
        <p className="text-c-body text-foreground/85 leading-relaxed pt-1">
          {ownerReply}
        </p>
      </div>
    </div>
  );
};
