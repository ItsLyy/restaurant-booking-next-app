"use client";

import { useEffect } from "react";
import { useActionState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@components";

import { confirmBookingAction } from "../_actions/confirm-booking";

import { formatDayDate, formatPrice, formatTime } from "@utils";

interface ConfirmBookingFormProps {
  bookingId: string;
  restaurantName: string;
  bookingCode: string;
  date: string;
  time: string;
  tableName: string;
  partySize: number;
  price: number;
  initialSpecialRequest?: string;
}

export const ConfirmBookingForm = ({
  bookingId,
  restaurantName,
  bookingCode,
  date,
  time,
  tableName,
  partySize,
  price,
  initialSpecialRequest,
}: ConfirmBookingFormProps) => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(confirmBookingAction, {
    ok: false,
  });

  useEffect(() => {
    if (!state.ok) return;
    toast.success("Booking confirmed — see you soon!");
    // react-doctor-disable-next-line nextjs-no-client-side-redirect
    router.push(`/bookings/${bookingId}`);
  }, [state.ok, bookingId, router]);

  return (
    <div className="space-y-4">
      <dl className="divide-y divide-muted/50">
        <SummaryRow label="Restaurant" value={restaurantName} />
        <SummaryRow label="Booking code" value={bookingCode} />
        <SummaryRow label="Date" value={formatDayDate(date)} />
        <SummaryRow label="Time" value={formatTime(time)} />
        <SummaryRow label="Table" value={tableName} />
        <SummaryRow label="Party size" value={`${partySize} people`} />
        <SummaryRow label="Deposit" value={formatPrice(price)} />
      </dl>

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="bookingId" value={bookingId} />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="special-request"
            className="text-c-caption text-foreground"
          >
            Special note{" "}
            <span className="text-muted/60">(optional, max 500 chars)</span>
          </label>
          <textarea
            id="special-request"
            name="specialRequest"
            rows={3}
            maxLength={500}
            defaultValue={initialSpecialRequest ?? ""}
            placeholder="Anniversary celebration, allergies, seating preference…"
            className="h-auto w-full resize-none px-4 py-2 border border-muted bg-base-200 text-foreground placeholder:text-muted/60 rounded-lg text-c-button focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 ease-in-out transition-colors duration-300"
          />
        </div>

        {state.error ? (
          <p role="alert" className="text-c-body text-negative">
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            disabled={pending}
            className="w-full border! rounded-2xl!"
          >
            {pending ? "Confirming…" : "Confirm booking"}
          </Button>
          <Button
            as="link"
            variant="outline"
            className="w-full border! rounded-2xl! text-muted!"
            href="/bookings"
          >
            View my bookings
          </Button>
        </div>
      </form>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 py-2.5">
    <span className="text-c-normal text-muted">{label}</span>
    <span className="text-c-normal text-foreground text-right">{value}</span>
  </div>
);