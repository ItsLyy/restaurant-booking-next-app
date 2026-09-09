import { Button } from "@components";

import { CancelBookingButton } from "./cancel-booking-button";

export const ConfirmPaidState = ({
  bookingId,
  restaurantName,
  restaurantSlug,
  restaurantAddress,
}: {
  bookingId: string;
  restaurantName: string;
  restaurantSlug: string;
  restaurantAddress: string;
}) => {
  return (
    <>
      <Button
        as="link"
        href={`https://maps.google.com/?q=${encodeURIComponent(`${restaurantName} ${restaurantAddress}`)}`}
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        Get Direction
      </Button>
      <Button
        as="link"
        href={`/restaurants/${restaurantSlug}`}
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        View Restaurant
      </Button>
      <CancelBookingButton bookingId={bookingId} paid />
    </>
  );
};