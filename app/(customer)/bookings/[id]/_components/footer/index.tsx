import { CompletedState } from "./completed-state";
import { ConfirmPaidState } from "./confirm-paid-state";
import { ConfirmUnpaidState } from "./confirm-unpaid-state";
import { FailedState } from "./failed-state";
import { PendingState } from "./pending-state";

import { IBooking, IPayment } from "@types";

interface GeneralProps {
  bookingStatus: IBooking["status"];
  paymentStatus: IPayment["status"];
}

interface FooterProps extends GeneralProps {
  paymentPrice: IPayment["price"];
  restaurantName: string;
  restaurantSlug: string;
  restaurantAddress: string;
}

export const Footer = ({
  bookingStatus,
  paymentStatus,
  paymentPrice,
  restaurantName,
  restaurantSlug,
  restaurantAddress,
}: FooterProps) => {
  return (
    <footer className="space-y-2">
      <CallToActions
        bookingStatus={bookingStatus}
        paymentStatus={paymentStatus}
        paymentPrice={paymentPrice}
        restaurantName={restaurantName}
        restaurantSlug={restaurantSlug}
        restaurantAddress={restaurantAddress}
      />
    </footer>
  );
};

const CallToActions = ({
  bookingStatus,
  paymentStatus,
  paymentPrice,
  restaurantName,
  restaurantSlug,
  restaurantAddress,
}: FooterProps) => {
  if (bookingStatus === "confirmed" && paymentStatus === "unpaid")
    return <ConfirmUnpaidState paymentPrice={paymentPrice} />;
  else if (bookingStatus === "confirmed" && paymentStatus === "paid")
    return (
      <ConfirmPaidState
        restaurantName={restaurantName}
        restaurantSlug={restaurantSlug}
        restaurantAddress={restaurantAddress}
      />
    );
  else if (bookingStatus === "completed")
    return <CompletedState restaurantSlug={restaurantSlug} />;
  else if (bookingStatus === "cancelled" || bookingStatus === "no_show")
    return <FailedState restaurantSlug={restaurantSlug} />;
  return <PendingState />;
};
