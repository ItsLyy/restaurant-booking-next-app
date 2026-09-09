export type BookingFilter = "all" | "pending" | "confirmed";

export const parseBookingFilter = (
  value: string | string[] | undefined,
): BookingFilter =>
  value === "pending" || value === "confirmed" ? value : "all";