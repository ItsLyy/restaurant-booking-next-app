import type { IBooking, IPayment } from "@types";

export function resolvePaymentStatus(
  bookingStatus: IBooking["status"],
  paymentStatus: IPayment["status"] | undefined,
): IPayment["status"] {
  if (paymentStatus) return paymentStatus;

  switch (bookingStatus) {
    case "cancelled":
      return "refunded";
    case "completed":
      return "paid";
    case "no_show":
      return "failed";
    default:
      return "unpaid";
  }
}