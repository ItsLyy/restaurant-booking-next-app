"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@components";

import { cancelBookingAction } from "../../_actions/cancel-booking";

export const CancelBookingButton = ({
  bookingId,
  paid,
}: {
  bookingId: string;
  paid: boolean;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
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
    setOpen(true);
  };

  const closeDialog = () => {
    setError(null);
    setOpen(false);
  };

  const handleCancel = () => {
    if (isPending) return;
    setError(null);
    startTransition(async () => {
      try {
        await cancelBookingAction(bookingId, reasonRef.current?.value ?? "");
        toast.success("Booking cancelled. Your table has been released.");
        closeDialog();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not cancel the booking right now.";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <>
      <Button
        className="w-full border! rounded-2xl!"
        variant="outline"
        onClick={openDialog}
      >
        Cancel Booking
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby="cancel-booking-title"
        aria-describedby="cancel-booking-message"
        onCancel={closeDialog}
        className="m-auto bg-transparent p-0 open:flex open:items-center open:justify-center [&::backdrop]:bg-black/40"
      >
        <div className="w-96 max-w-[90vw] rounded-xl border border-muted bg-base-100 shadow-lg text-foreground p-5">
          <h2
            id="cancel-booking-title"
            className="text-d-header-card text-foreground"
          >
            Cancel booking
          </h2>
          <p
            id="cancel-booking-message"
            className="mt-2 text-d-body text-muted"
          >
            Are you sure you want to cancel this booking? Your table will be
            released and can be booked by someone else.
            {paid
              ? " The payment you made will be refunded to your original payment method."
              : ""}
          </p>
          <div className="mt-3">
            <label
              htmlFor="cancel-booking-reason"
              className="block text-d-body text-muted"
            >
              Reason <span className="text-muted/60">(optional)</span>
            </label>
            <textarea
              key={open ? "reason-open" : "reason-closed"}
              ref={reasonRef}
              id="cancel-booking-reason"
              rows={2}
              defaultValue=""
              placeholder="e.g. Plans changed, found another place…"
              className="mt-1 w-full resize-none rounded-md border border-muted bg-base-100 p-2 text-d-body text-foreground outline-none focus:border-accent-100"
            />
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
              Keep booking
            </Button>
            <Button
              variant="outline"
              className="border-negative! text-negative! rounded-md! h-10! px-4!"
              disabled={isPending}
              onClick={handleCancel}
            >
              {isPending ? "Cancelling…" : "Cancel booking"}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
};