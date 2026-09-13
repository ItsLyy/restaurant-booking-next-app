import { PayNowButton } from "./pay-now-button";

import { CancelBookingButton } from "./cancel-booking-button";

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
      <CancelBookingButton bookingId={bookingId} paid={false} />
    </>
  );
};