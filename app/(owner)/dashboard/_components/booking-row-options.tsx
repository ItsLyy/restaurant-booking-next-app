"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  CheckCircleIcon,
  DotsThreeVerticalIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { formatShortDate } from "@utils/formatDate";

import { ConfirmDialog } from "./confirm-dialog";

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
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const closeMenu = () => setIsOpen(false);

  const requestAction = (action: "confirm" | "reject") => {
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
      if (pendingAction === "confirm") {
        await confirmBookingAction(booking.id);
      } else {
        await rejectBookingAction(booking.id);
      }
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

  const isConfirm = pendingAction === "confirm";
  const slot = `${formatShortDate(booking.date)} · ${booking.time} · ${booking.table}`;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Booking options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="cursor-pointer rounded-md p-1 hover:bg-accent-200/10"
      >
        <DotsThreeVerticalIcon className="size-4 text-accent-100" />
      </button>

      {isOpen && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 z-10"
            onClick={closeMenu}
          />
          <div
            role="menu"
            className="absolute right-0 top-6 z-20 w-44 border border-muted rounded-lg bg-base-100 shadow-lg p-1"
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
        </>
      )}

      <ConfirmDialog
        open={pendingAction !== null}
        title={isConfirm ? "Confirm booking" : "Reject booking"}
        message={
          isConfirm ? (
            <>
              Confirm the reservation for{" "}
              <span className="text-foreground">
                {booking.guest} ({booking.party} people)
              </span>{" "}
              on&nbsp;{slot}? This reserves the table and starts a 6-hour
              payment window.
            </>
          ) : (
            <>
              Reject the reservation for{" "}
              <span className="text-foreground">
                {booking.guest} ({booking.party} people)
              </span>{" "}
              on&nbsp;{slot}? The booking will be cancelled and the table stays
              available.
            </>
          )
        }
        confirmLabel={isConfirm ? "Confirm booking" : "Reject booking"}
        confirmVariant={isConfirm ? "default" : "danger"}
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