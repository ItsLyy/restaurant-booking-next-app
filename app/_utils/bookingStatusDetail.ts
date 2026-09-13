import type { IBooking, IBookingCancelled, IPayment } from "@types";
import { formatDate } from "./formatDate";
import { formatPrice } from "./formatPrice";
import { formatTime } from "./formatTime";

export interface BookingStatusDetailParameter {
  bookingStatus: IBooking["status"];
  bookingDate: IBooking["date"];
  bookingTime: IBooking["time"];
  paymentPrice: IPayment["price"];
  paymentStatus: IPayment["status"];
  bookingCancelled?: Omit<IBookingCancelled, "reason">;
}

export function bookingStatusDetail({
  bookingStatus,
  bookingDate,
  bookingTime,
  paymentPrice,
  paymentStatus,
  bookingCancelled,
}: BookingStatusDetailParameter): { status: string; description: string } {
  if (bookingStatus === "confirmed" && paymentStatus === "unpaid")
    return {
      status: "Payment required",
      description: `Complete your payment before ${formatDate(bookingDate)}, ${formatTime(bookingTime)} or your booking will be automatically cancelled.`,
    };
  else if (bookingStatus === "confirmed" && paymentStatus === "paid")
    return {
      status: "Your table is reserved",
      description:
        "Everything is set. Just show up on time and enjoy your meal. Your table will be held for 15 minutes.",
    };
  else if (bookingStatus === "completed")
    return {
      status: "Hope you had a great time!",
      description:
        "Your dining experience is complete. Share your thoughts and help other diners discover this restaurant.",
    };
  else if (bookingStatus === "no_show")
    return {
      status: "You missed your booking",
      description: `Your table was held until ${formatTime(bookingTime)} but you didn't arrive. Unfortunately this booking is non-refundable.`,
    };
  else if (
    bookingStatus === "cancelled" &&
    paymentStatus === "refunded" &&
    bookingCancelled
  )
    return {
      status: `Booking cancelled by ${bookingCancelled.by === "user" ? "you" : "restaurant"}`,
      description: `${formatPrice(paymentPrice)} has been refunded and will arrive in 3–5 business days to your original payment method.`,
    };
  else if (
    bookingStatus === "cancelled" &&
    paymentStatus === "unrefunded" &&
    bookingCancelled
  )
    return {
      status: `Booking cancelled by ${bookingCancelled.by === "user" ? "you" : "restaurant"}`,
      description: `${formatPrice(paymentPrice)} cannot be refunded because cancelling around 24 hours close to show time.`,
    };
  else if (bookingStatus === "cancelled")
    return {
      status: "Booking cancelled",
      description:
        "Your booking has been cancelled. If you're owed a refund, it will be processed and sent to your original payment method.",
    };

  return {
    status: "Waiting for restaurant to confirm",
    description:
      "Your booking request has been sent. The restaurant usually responds within 15 minutes. We'll notify you once confirmed.",
  };
}
