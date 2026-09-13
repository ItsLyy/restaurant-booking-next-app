export type BookingFilter = "all" | "pending" | "confirmed";

export const parseBookingFilter = (
  value: string | string[] | undefined,
): BookingFilter =>
  value === "pending" || value === "confirmed" ? value : "all";

export const parseSelectedTable = (
  value: string | string[] | undefined,
  availableTableIds: Set<string>,
): string | undefined =>
  typeof value === "string" && availableTableIds.has(value) ? value : undefined;