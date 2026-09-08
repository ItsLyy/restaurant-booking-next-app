"use client";

import { useState, useTransition } from "react";

import { Button } from "@components";

import { formatPrice } from "@utils";

import { payBookingAction } from "../../_actions/pay-booking";

export const PayNowButton = ({
  bookingId,
  price,
}: {
  bookingId: string;
  price: number;
}) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handlePay = () => {
    setError(null);
    startTransition(async () => {
      try {
        await payBookingAction(bookingId);
      } catch {
        setError("Could not process the payment right now.");
      }
    });
  };

  return (
    <div className="space-y-2">
      <Button
        className="w-full border! rounded-2xl!"
        variant="outline"
        disabled={isPending}
        title="Temporary test action"
        onClick={handlePay}
      >
        {isPending ? "Paying…" : `Pay now ${formatPrice(price)}`}
      </Button>
      <p className="text-c-caption text-muted text-center">
        Test helper: marks this booking as paid immediately.
      </p>
      {error ? <p className="text-c-body text-negative">{error}</p> : null}
    </div>
  );
};