"use client";

import { createPortal } from "react-dom";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  CheckCircleIcon,
  ChecksIcon,
  EyeIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { BookingActionDialog } from "../../_components/booking-action-dialog";
import { useRowMenu } from "../../_components/use-row-menu";

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
  base?: string;
}

const menuItemBase =
  "flex w-full items-center gap-2 px-3 py-2 rounded-md text-d-caption disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

export const BookingRowActions = ({
  booking,
  base = "/dashboard/bookings",
}: BookingRowActionsProps) => {
  const router = useRouter();
  const { isOpen, anchor, toggleMenu, closeMenu } = useRowMenu();
  const [pendingAction, setPendingAction] = useState<RowAction>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const requestAction = (action: Exclude<RowAction, null>) => {
    setActionError(null);
    setPendingAction(action);
    closeMenu();
  };

  const cancelAction = () => {
    setActionError(null);
    setPendingAction(null);
  };

  const runAction = async (reason?: string) => {
    if (!pendingAction || busy) return;
    setBusy(true);
    setActionError(null);
    try {
      if (pendingAction === "confirm") {
        await confirmBookingAction(booking.id);
        toast.success(`Booking ${booking.code} confirmed.`);
      } else if (pendingAction === "reject") {
        await rejectBookingAction(booking.id, reason);
        toast.success(`Booking ${booking.code} rejected.`);
      } else {
        await completeBookingAction(booking.id);
        toast.success(`Booking ${booking.code} completed.`);
      }
      setPendingAction(null);
      setBusy(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setBusy(false);
      setActionError(message);
      toast.error(message);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        aria-label={`Actions for booking ${booking.code}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(event) =>
          toggleMenu(
            event,
            1 +
              (booking.status === "pending" || booking.status === "confirmed"
                ? 2
                : 0),
          )
        }
        className="cursor-pointer rounded-md p-1 hover:bg-accent-200/10"
      >
        <ChecksIcon className="size-4 text-accent-100" />
      </button>

      {isOpen &&
        anchor &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div aria-hidden className="fixed inset-0 z-10" onClick={closeMenu} />
            <div
              role="menu"
              style={{
                position: "fixed",
                top: anchor.top,
                right: anchor.right,
                zIndex: 20,
              }}
              className="w-44 border border-muted rounded-lg bg-base-100 shadow-lg p-1"
            >
              <a
                href={`${base}/${booking.id}`}
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
              {(booking.status === "pending" ||
                booking.status === "confirmed") && (
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
          </>,
          document.body,
        )}

      <BookingActionDialog
        open={pendingAction !== null}
        action={pendingAction ?? "confirm"}
        booking={{
          code: booking.code,
          date: booking.date,
          time: booking.time,
          guest: booking.guest,
          party: booking.party,
          table: booking.table,
        }}
        busy={busy}
        error={actionError}
        onConfirm={(reason) => {
          void runAction(reason);
        }}
        onCancel={cancelAction}
      />
    </div>
  );
};