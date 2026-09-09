"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  CheckCircleIcon,
  ChecksIcon,
  EyeIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { formatShortDate } from "@utils/formatDate";

import { ConfirmDialog } from "../../_components/confirm-dialog";

import {
  completeBookingAction,
  confirmBookingAction,
  rejectBookingAction,
} from "../../_actions/booking-actions";

type RowAction = "confirm" | "reject" | "complete" | null;

interface RowBooking {
  id: string;
  code: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  date: string;
  time: string;
  guest: string;
  party: number;
  table: string;
}

interface BookingRowActionsProps {
  booking: RowBooking;
}

const menuItemBase =
  "flex w-full items-center gap-2 px-3 py-2 rounded-md text-d-caption disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

export const BookingRowActions = ({ booking }: BookingRowActionsProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<RowAction>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const closeMenu = () => setIsOpen(false);

  const requestAction = (action: Exclude<RowAction, null>) => {
    setActionError(null);
    setPendingAction(action);
    closeMenu();
  };

  const cancelAction = () => {
    setActionError(null);
    setPendingAction(null);
  };

  const runAction = async () => {
    if (!pendingAction || busy) return;
    setBusy(true);
    setActionError(null);
    try {
      if (pendingAction === "confirm") await confirmBookingAction(booking.id);
      else if (pendingAction === "reject") await rejectBookingAction(booking.id);
      else await completeBookingAction(booking.id);
      setPendingAction(null);
      setBusy(false);
      router.refresh();
    } catch (error) {
      setBusy(false);
      setActionError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  const slot = `${formatShortDate(booking.date)} · ${booking.time} · ${booking.table}`;
  const action = pendingAction;
  const dialogTitle =
    action === "confirm"
      ? "Confirm booking"
      : action === "reject"
        ? "Reject booking"
        : "Mark as completed";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        aria-label={`Actions for booking ${booking.code}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="cursor-pointer rounded-md p-1 hover:bg-accent-200/10"
      >
        <ChecksIcon className="size-4 text-accent-100" />
      </button>

      {isOpen && (
        <>
          <div aria-hidden className="fixed inset-0 z-10" onClick={closeMenu} />
          <div
            role="menu"
            className="absolute right-0 top-6 z-20 w-44 border border-muted rounded-lg bg-base-100 shadow-lg p-1"
          >
            <a
              href={`/bookings/${booking.id}`}
              className={`${menuItemBase} text-foreground hover:bg-accent-200/10`}
            >
              <EyeIcon className="size-4 text-accent-100" />
              View booking
            </a>
            {booking.status === "pending" && (
              <button
                type="button"
                role="menuitem"
                disabled={busy}
                onClick={() => requestAction("confirm")}
                className={`${menuItemBase} text-foreground hover:bg-positive/10`}
              >
                <CheckCircleIcon className="size-4 text-positive" />
                Confirm booking
              </button>
            )}
            {booking.status === "confirmed" && (
              <button
                type="button"
                role="menuitem"
                disabled={busy}
                onClick={() => requestAction("complete")}
                className={`${menuItemBase} text-foreground hover:bg-positive/10`}
              >
                <ChecksIcon className="size-4 text-positive" />
                Mark as completed
              </button>
            )}
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <button
                type="button"
                role="menuitem"
                disabled={busy}
                onClick={() => requestAction("reject")}
                className={`${menuItemBase} text-negative hover:bg-negative/10`}
              >
                <XCircleIcon className="size-4 text-negative" />
                Reject booking
              </button>
            )}
          </div>
        </>
      )}

      <ConfirmDialog
        open={action !== null}
        title={dialogTitle}
        message={
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
              <span className="text-foreground">{booking.guest}</span> on
              &nbsp;{slot} as completed?
            </>
          )
        }
        confirmLabel={dialogTitle}
        confirmVariant={action === "reject" ? "danger" : "default"}
        busy={busy}
        error={actionError}
        onConfirm={() => {
          void runAction();
        }}
        onCancel={cancelAction}
      />
    </div>
  );
};