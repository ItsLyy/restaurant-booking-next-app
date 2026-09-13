export type BookingFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export const parseBookingFilter = (
  value: string | string[] | undefined,
): BookingFilter =>
  value === "pending" ||
  value === "confirmed" ||
  value === "cancelled" ||
  value === "completed"
    ? value
    : "all";
