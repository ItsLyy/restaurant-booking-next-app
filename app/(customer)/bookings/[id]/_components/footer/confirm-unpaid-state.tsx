import { Button } from "@components";

import { formatPrice } from "@utils";

export const ConfirmUnpaidState = ({
  paymentPrice,
}: {
  paymentPrice: number;
}) => {
  return (
    <>
      <Button className="w-full border! rounded-2xl!" variant="outline">
        Pay now {formatPrice(paymentPrice)}
      </Button>
      <Button className="w-full border! rounded-2xl!" variant="outline">
        Cancel Booking
      </Button>
    </>
  );
};