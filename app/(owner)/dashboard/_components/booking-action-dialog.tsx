import { useRef } from "react";

import { ConfirmDialog } from "./confirm-dialog";

import { formatShortDate } from "@utils/formatDate";

type DialogAction = "confirm" | "reject" | "complete";

interface DialogBooking {
  code: string;
  date: string;
  time: string;
  guest: string;
  party: number;
  table: string;
}

interface BookingActionDialogProps {
  open: boolean;
  action: DialogAction;
  booking: DialogBooking;
  busy: boolean;
  error: string | null;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export const BookingActionDialog = ({
  open,
  action,
  booking,
  busy,
  error,
  onConfirm,
  onCancel,
}: BookingActionDialogProps) => {
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const slot = `${formatShortDate(booking.date)} · ${booking.time} · ${booking.table}`;
  const title =
    action === "confirm"
      ? "Confirm booking"
      : action === "reject"
        ? "Reject booking"
        : "Mark as completed";

  const message =
    action === "confirm" ? (
      <>
        Confirm the reservation for{" "}
        <span className="text-foreground">
          {booking.guest} ({booking.party} people)
        </span>{" "}
        on&nbsp;{slot}? This reserves the table and starts a 6-hour payment
        window.
      </>
    ) : action === "reject" ? (
      <>
        Reject the reservation for{" "}
        <span className="text-foreground">
          {booking.guest} ({booking.party} people)
        </span>{" "}
        on&nbsp;{slot}? The booking will be cancelled and the table stays
        available.
      </>
    ) : (
      <>
        Mark the booking{" "}
        <span className="text-foreground">{booking.code}</span> for{" "}
        <span className="text-foreground">{booking.guest}</span> on&nbsp;{slot}{" "}
        as completed?
      </>
    );

  return (
    <ConfirmDialog
      open={open}
      title={title}
      message={message}
      confirmLabel={title}
      confirmVariant={action === "reject" ? "danger" : "default"}
      busy={busy}
      error={error}
      onConfirm={() => onConfirm(reasonRef.current?.value ?? "")}
      onCancel={onCancel}
    >
      {action === "reject" ? (
        <div className="mt-3">
          <label
            htmlFor="cancel-reason"
            className="block text-d-body text-muted"
          >
            Reason for cancellation{" "}
            <span className="text-muted/60">(optional)</span>
          </label>
          <textarea
            key={open ? "reject-reason-open" : "reject-reason-closed"}
            ref={reasonRef}
            id="cancel-reason"
            rows={2}
            defaultValue=""
            placeholder="e.g. Table double-booked, kitchen closed, no longer needed…"
            className="mt-1 w-full resize-none rounded-md border border-muted bg-base-100 p-2 text-d-body text-foreground outline-none focus:border-accent-100"
          />
        </div>
      ) : null}
    </ConfirmDialog>
  );
};