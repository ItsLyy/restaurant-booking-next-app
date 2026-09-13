import { CancelBookingButton } from "./cancel-booking-button";

export const PendingState = ({
  bookingId,
}: {
  bookingId: string;
}) => {
  return <CancelBookingButton bookingId={bookingId} paid={false} />;
};