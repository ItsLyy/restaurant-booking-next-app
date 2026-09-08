import { Button } from "@components";

import { PayNowButton } from "./pay-now-button";

export const ConfirmUnpaidState = ({
  bookingId,
  paymentPrice,
}: {
  bookingId: string;
  paymentPrice: number;
}) => {
  return (
    <>
      <PayNowButton bookingId={bookingId} price={paymentPrice} />
      <Button className="w-full border! rounded-2xl!" variant="outline">
        Cancel Booking
      </Button>
    </>
  );
};