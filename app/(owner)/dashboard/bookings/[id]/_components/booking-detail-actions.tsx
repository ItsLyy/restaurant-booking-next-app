"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  CheckCircleIcon,
  ChecksIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";
import { BookingActionDialog } from "../../../_components/booking-action-dialog";

import {
  completeBookingAction,
  confirmBookingAction,
  rejectBookingAction,
} from "../../../_actions/booking-actions";

type DetailAction = "confirm" | "reject" | "complete" | null;

interface BookingDetailActionsProps {
  booking: {
    id: string;
    code: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    date: string;
    time: string;
    guest: string;
    party: number;
    table: string;
  };
}

export const BookingDetailActions = ({
  booking,
}: BookingDetailActionsProps) => {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<DetailAction>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const cancelAction = () => {
    setActionError(null);
    setPendingAction(null);
  };

  const runAction = async (reason?: string) => {
    if (!pendingAction || busy) return;
    setBusy(true);
    setActionError(null);
    try {
      if (pendingAction === "confirm") await confirmBookingAction(booking.id);
      else if (pendingAction === "reject")
        await rejectBookingAction(booking.id, reason);
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

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {booking.status === "pending" && (
          <Button onClick={() => setPendingAction("confirm")} disabled={busy}>
            <CheckCircleIcon className="size-4" />
            Confirm
          </Button>
        )}
        {booking.status === "confirmed" && (
          <Button onClick={() => setPendingAction("complete")} disabled={busy}>
            <ChecksIcon className="size-4" />
            Mark as completed
          </Button>
        )}
        {(booking.status === "pending" || booking.status === "confirmed") && (
          <Button
            variant="outline"
            onClick={() => setPendingAction("reject")}
            disabled={busy}
            className="border-negative! text-negative!"
          >
            <XCircleIcon className="size-4" />
            Reject
          </Button>
        )}
      </div>

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
    </>
  );
};