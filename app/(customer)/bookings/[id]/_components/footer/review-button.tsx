"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { StarIcon } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

import { Button } from "@components";

import { createReviewAction } from "../../_actions/create-review";

export const ReviewButton = ({ bookingId }: { bookingId: string }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const openDialog = () => {
    setError(null);
    setRating(0);
    setComment("");
    setOpen(true);
  };

  const closeDialog = () => {
    setError(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      try {
        await createReviewAction(bookingId, rating, comment);
        toast.success("Thank you! Your review has been published.");
        closeDialog();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not submit your review right now.";
        setError(message);
        toast.error(message);
      }
    });
  };

  const activeStars = hovered || rating;

  return (
    <>
      <Button
        className="w-full border! rounded-2xl!"
        variant="outline"
        onClick={openDialog}
      >
        Leave a review
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby="review-title"
        aria-describedby="review-description"
        onCancel={closeDialog}
        className="m-auto bg-transparent p-0 open:flex open:items-center open:justify-center [&::backdrop]:bg-black/40"
      >
        <div className="w-96 max-w-[90vw] rounded-xl border border-muted bg-base-100 shadow-lg text-foreground p-5">
          <h2 id="review-title" className="text-d-header-card text-foreground">
            Rate your visit
          </h2>
          <p id="review-description" className="mt-2 text-d-body text-muted">
            How was your experience? Your review will be shown publicly once
            submitted.
          </p>

          <div className="mt-4">
            <span className="block text-d-body text-muted">Your rating</span>
            <div
              className="mt-1 flex gap-1"
              role="radiogroup"
              aria-label="Rating"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  className="cursor-pointer rounded p-0.5 transition-transform hover:scale-110"
                  onMouseEnter={() => setHovered(value)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(value)}
                >
                  <StarIcon
                    size={28}
                    weight="fill"
                    className={
                      value <= activeStars ? "text-amber-500" : "text-muted/40"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <label
              htmlFor="review-comment"
              className="block text-d-body text-muted"
            >
              Comment <span className="text-muted/60">(required)</span>
            </label>
            <textarea
              key={open ? "comment-open" : "comment-closed"}
              id="review-comment"
              rows={4}
              value={comment}
              maxLength={500}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Tell others about your visit…"
              className="mt-1 w-full resize-none rounded-md border border-muted bg-base-100 p-2 text-d-body text-foreground outline-none focus:border-accent-100"
            />
            <span className="mt-1 block text-right text-d-caption text-muted">
              {comment.length}/500
            </span>
          </div>

          {error ? (
            <p className="mt-3 text-d-body text-negative" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              className="border! rounded-md! h-10! px-4!"
              disabled={isPending}
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="border-positive! text-positive! rounded-md! h-10! px-4!"
              disabled={isPending || rating === 0 || comment.trim() === ""}
              onClick={handleSubmit}
            >
              {isPending ? "Submitting…" : "Submit review"}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
};