"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { StarIcon } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

import { Avatar, Button } from "@components";

import { formatDate } from "@utils";

import { replyReviewAction } from "../_actions/reply-review";

import type { DashboardReview } from "../_data/reviews";

export const ReviewItem = ({ review }: { review: DashboardReview }) => {
  const router = useRouter();
  const [reply, setReply] = useState(review.ownerReply ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      try {
        await replyReviewAction(review.id, reply);
        toast.success("Your reply has been published.");
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Could not save your reply right now.";
        setError(message);
        toast.error(message);
      }
    });
  };

  const hasReply = Boolean(review.ownerReply);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-muted bg-base-100 p-4">
      <header className="flex items-center gap-3">
        <Avatar
          src={review.customerAvatar}
          alt={review.customerName}
          className="size-10"
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-d-body text-foreground leading-tight">
            {review.customerName}
          </span>
          <span className="text-d-caption text-muted">
            {formatDate(review.commentAt)}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-accent-100">
          <StarIcon weight="duotone" size={18} />
          <span className="text-d-body text-accent-100">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </header>

      <p className="text-d-body">{review.comment}</p>

      <div className="flex flex-col gap-1 border-t border-muted pt-4">
        <label
          htmlFor={`reply-${review.id}`}
          className="text-d-caption text-muted"
        >
          {hasReply ? "Your reply" : "Reply to this review"}
          <span className="text-muted/60"> · {reply.length}/{500}</span>
        </label>
        <textarea
          id={`reply-${review.id}`}
          rows={4}
          value={reply}
          maxLength={500}
          onChange={(event) => setReply(event.target.value)}
          placeholder="Thank them for their visit and address their feedback…"
          className="w-full resize-none rounded-md border border-muted bg-base-100 p-2 text-d-body text-foreground outline-none focus:border-accent-100"
        />
        {error ? (
          <p className="text-d-caption text-negative" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button
            className="rounded-md! h-9! px-4!"
            disabled={isPending || reply.trim() === ""}
            onClick={handleSubmit}
          >
            {isPending
              ? "Saving…"
              : hasReply
                ? "Update reply"
                : "Post reply"}
          </Button>
        </div>
      </div>
    </div>
  );
};