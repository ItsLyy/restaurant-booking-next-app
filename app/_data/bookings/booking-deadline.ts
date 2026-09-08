import type { IBooking, IPayment } from "@types";

export const MIN_BOOKING_LEAD_TIME_MS = 12 * 60 * 60 * 1000;
export const PAYMENT_DEADLINE_MS = 6 * 60 * 60 * 1000;

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

export function getEffectiveBookingStatus(
  booking: IBooking,
  payment: IPayment | undefined,
  now: Date = new Date(),
): IBooking["status"] {
  return isBookingOverdue(booking, payment, now) ? "cancelled" : booking.status;
}