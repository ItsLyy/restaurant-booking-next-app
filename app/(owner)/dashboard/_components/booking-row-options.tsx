"use client";

import { createPortal } from "react-dom";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  CheckCircleIcon,
  DotsThreeVerticalIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { BookingActionDialog } from "./booking-action-dialog";
import { useRowMenu } from "./use-row-menu";

import { toBookingCode } from "@data/bookings/booking-code";

import {
  confirmBookingAction,
  rejectBookingAction,
} from "../_actions/booking-actions";

import type { DashboardBooking } from "../_data/dashboard";

interface BookingRowOptionsProps {
  booking: DashboardBooking;
}

type PendingAction = "confirm" | "reject" | null;

export const BookingRowOptions = ({ booking }: BookingRowOptionsProps) => {
  const router = useRouter();
  const { isOpen, anchor, toggleMenu, closeMenu } = useRowMenu();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const requestAction = (action: "confirm" | "reject") => {
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
        toast.success(`Booking ${toBookingCode(booking.id)} confirmed.`);
      } else {
        await rejectBookingAction(booking.id, reason);
        toast.success(`Booking ${toBookingCode(booking.id)} rejected.`);
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
    <div className="relative">
      <button
        type="button"
        aria-label="Booking options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(event) =>
          toggleMenu(event, booking.status === "pending" ? 2 : 1)
        }
        className="cursor-pointer rounded-md p-1 hover:bg-accent-200/10"
      >
        <DotsThreeVerticalIcon className="size-4 text-accent-100" />
      </button>

      {isOpen &&
        anchor &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              aria-hidden
              className="fixed inset-0 z-10"
              onClick={closeMenu}
            />
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
              {booking.status === "pending" && (
                <button
                  type="button"
                  role="menuitem"
                  disabled={busy}
                  onClick={() => requestAction("confirm")}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-d-caption text-foreground hover:bg-positive/10 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <CheckCircleIcon className="size-4 text-positive" />
                  Confirm booking
                </button>
              )}
              <button
                type="button"
                role="menuitem"
                disabled={busy}
                onClick={() => requestAction("reject")}
                className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-d-caption text-negative hover:bg-negative/10 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <XCircleIcon className="size-4 text-negative" />
                Reject booking
              </button>
            </div>
          </>,
          document.body,
        )}

      <BookingActionDialog
        open={pendingAction !== null}
        action={pendingAction ?? "confirm"}
        booking={{
          code: toBookingCode(booking.id),
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