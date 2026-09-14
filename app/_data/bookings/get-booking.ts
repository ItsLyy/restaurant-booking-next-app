import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@db/client";
import { bookings, payments, restaurants, reviews, tables } from "@db/schema";

import { toBookingCode } from "./booking-code";
import { getEffectiveBookingStatus } from "./booking-deadline";

import type { BookingRow, PaymentRow, ReviewRow } from "@db/schema";
import type { IBooking, IPayment, IReview } from "@types";

const toIBooking = (row: BookingRow): IBooking => ({
  id: row.id,
  date: row.date,
  time: row.time,
  partySize: row.partySize,
  ...(row.specialRequest ? { specialRequest: row.specialRequest } : {}),
  status: row.status,
  customerId: row.customerId,
  tableId: row.tableId,
  ...(row.cancelledBy
    ? {
        cancelled: {
          date: row.cancelledDate ?? "",
          by: row.cancelledBy,
          reason: row.cancelledReason ?? "",
        },
      }
    : {}),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const toIPayment = (row: PaymentRow): IPayment => ({
  id: row.id,
  price: row.price,
  status: row.status,
  deadline: row.deadline,
  gatewayToken: row.gatewayToken,
  bookingId: row.bookingId,
  paidAt: row.paidAt ?? undefined,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const toIReview = (row: ReviewRow): IReview => ({
  id: row.id,
  customerComment: row.customerComment,
  customerRating: row.customerRating,
  customerCommentAt: row.customerCommentAt,
  ownerReply: row.ownerReply ?? undefined,
  ownerReplyAt: row.ownerReplyAt ?? undefined,
  bookingId: row.bookingId,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

interface GetBookingResponse {
  booking: IBooking;
  bookingCode: string;
  restaurantName: string;
  restaurantSlug: string;
  restaurantAddress: string;
  tableName: string;
  payment: IPayment | null;
  review: IReview | null;
}

export async function getBooking(
  id: string,
): Promise<GetBookingResponse | null> {
  const bookingRows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  const bookingRow = bookingRows[0];
  if (!bookingRow) return null;
  const booking = toIBooking(bookingRow);

  const tableRow = (
    await db
      .select()
      .from(tables)
      .where(eq(tables.id, booking.tableId))
      .limit(1)
  )[0];
  const restaurantRow = tableRow
    ? (
        await db
          .select()
          .from(restaurants)
          .where(eq(restaurants.id, tableRow.restaurantId))
          .limit(1)
      )[0]
    : undefined;

  const paymentRow = (
    await db
      .select()
      .from(payments)
      .where(eq(payments.bookingId, booking.id))
      .limit(1)
  )[0];
  const payment = paymentRow ? toIPayment(paymentRow) : null;

  const reviewRow = (
    await db
      .select()
      .from(reviews)
      .where(eq(reviews.bookingId, booking.id))
      .limit(1)
  )[0];
  const review = reviewRow ? toIReview(reviewRow) : null;

  const effectiveStatus = getEffectiveBookingStatus(booking, payment ?? undefined);
  const effectiveBooking: IBooking =
    effectiveStatus === "cancelled" && booking.status !== "cancelled"
      ? {
          ...booking,
          status: "cancelled",
          cancelled: {
            date: new Date().toISOString().slice(0, 10),
            by: "restaurant",
            reason:
              "Payment deadline passed. The booking was automatically cancelled.",
          },
        }
      : booking;

  return {
    booking: effectiveBooking,
    bookingCode: toBookingCode(booking.id),
    restaurantName: restaurantRow?.name ?? "Restaurant",
    restaurantSlug: restaurantRow?.slug ?? "",
    restaurantAddress: restaurantRow?.address ?? "",
    tableName: tableRow?.name ?? booking.tableId,
    payment,
    review,
  };
}