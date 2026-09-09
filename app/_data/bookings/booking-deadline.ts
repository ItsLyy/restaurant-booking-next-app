import type { IBooking, IPayment } from "@types";

export const MIN_BOOKING_LEAD_TIME_MS = 12 * 60 * 60 * 1000;
export const PAYMENT_DEADLINE_MS = 6 * 60 * 60 * 1000;
export const PENDING_CONFIRM_WINDOW_MS = 72 * 60 * 60 * 1000;

export function isBookingTooSoon(
  date: string,
  time: string,
  now: Date = new Date(),
): boolean {
  const start = new Date(`${date}T${time}:00`).getTime();
  return Number.isFinite(start) && start - now.getTime() < MIN_BOOKING_LEAD_TIME_MS;
}

export function derivePaymentDeadline(now: Date = new Date()): string {
  return new Date(now.getTime() + PAYMENT_DEADLINE_MS).toISOString();
}

export function isBookingOverdue(
  booking: IBooking,
  payment: IPayment | undefined,
  now: Date = new Date(),
): boolean {
  if (booking.status !== "confirmed") return false;
  if (!payment || payment.status !== "unpaid") return false;

  const deadline = new Date(payment.deadline).getTime();
  return Number.isFinite(deadline) && now.getTime() > deadline;
}

export function isPendingExpired(
  booking: IBooking,
  now: Date = new Date(),
): boolean {
  if (booking.status !== "pending") return false;
  const createdAt = booking.createdAt
    ? new Date(booking.createdAt).getTime()
    : Number.NaN;
  return (
    Number.isFinite(createdAt) &&
    now.getTime() - createdAt > PENDING_CONFIRM_WINDOW_MS
  );
}

export function getEffectiveBookingStatus(
  booking: IBooking,
  payment: IPayment | undefined,
  now: Date = new Date(),
): IBooking["status"] {
  if (isBookingOverdue(booking, payment, now)) return "cancelled";
  if (isPendingExpired(booking, now)) return "cancelled";
  return booking.status;
}

/**
 * Pending requests are only shown on the dates from the day the customer
 * placed the booking up to the day before the reserved date. On the
 * reserved date itself a pending entry no longer exists (it must have been
 * confirmed or auto-cancelled in the meantime). Same-day requests are the
 * exception and stay visible on their own date so staff can act on them.
 */
export function isPendingVisibleOn(
  booking: IBooking,
  viewDate: string,
  now: Date = new Date(),
): boolean {
  if (booking.status !== "pending") return false;
  if (getEffectiveBookingStatus(booking, undefined, now) !== "pending") {
    return false;
  }

  const createdDay = booking.createdAt?.split("T")[0];
  if (!createdDay || viewDate < createdDay) return false;
  if (viewDate < booking.date) return true;
  return viewDate === booking.date && booking.date === createdDay;
}