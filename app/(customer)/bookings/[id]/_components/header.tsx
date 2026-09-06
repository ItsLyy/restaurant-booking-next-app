import { StatusBadge } from "./status-badge";
import type { IBooking, IPayment } from "@types";

type BookingStatus = IBooking["status"];
type PaymentStatus = IPayment["status"];

const badges: Record<
  BookingStatus | PaymentStatus,
  { status: string; variant: "negative" | "neutral" | "positive" }
> = {
  pending: {
    status: "Waiting for restaurant to confirm",
    variant: "neutral",
  },
  confirmed: {
    status: "Booking confirmed",
    variant: "positive",
  },
  completed: {
    status: "Hope you had a great time!",
    variant: "positive",
  },
  no_show: {
    status: "You missed your booking",
    variant: "negative",
  },
  cancelled: {
    status: "Booking cancelled",
    variant: "negative",
  },
  unpaid: {
    status: "Payment pending",
    variant: "neutral",
  },
  paid: {
    status: "Payment confirmed",
    variant: "positive",
  },
  refunded: {
    status: "Payment refunded",
    variant: "positive",
  },
  unrefunded: {
    status: "Payment unrefunded",
    variant: "negative",
  },
  failed: {
    status: "Payment failed",
    variant: "negative",
  },
};

export const Header = ({
  restaurantName,
  bookingStatus,
  paymentStatus,
}: {
  restaurantName: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
}) => {
  return (
    <header className="space-y-6 bg-base-200 p-8 rounded-3xl border border-muted">
      <div>
        <span className="text-c-caption">Booking Status</span>
        <h1 className="text-c-header-lg text-foreground">{restaurantName}</h1>
      </div>
      <div className="flex gap-2 flex-wrap w-full">
        <StatusBadge
          status={badges[bookingStatus].status}
          variant={badges[bookingStatus].variant}
        />
        <StatusBadge
          status={badges[paymentStatus].status}
          variant={badges[paymentStatus].variant}
        />
      </div>
    </header>
  );
};
