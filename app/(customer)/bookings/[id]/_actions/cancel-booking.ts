"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { db } from "@db/client";
import { bookings, payments, tables } from "@db/schema";
import { getEffectiveBookingStatus } from "@data/bookings/booking-deadline";
import { broadcastBookingEvent } from "@db/broadcast";
import { getDinerSession } from "@libs/session";

import type { BookingRow, PaymentRow } from "@db/schema";
import type { IBooking } from "@types";

const toIBooking = (row: BookingRow) => ({
  id: row.id,
  date: row.date,
  time: row.time,
  partySize: row.partySize,
  specialRequest: row.specialRequest ?? undefined,
  status: row.status,
  customerId: row.customerId,
  tableId: row.tableId,
  cancelled: row.cancelledBy
    ? {
        date: row.cancelledDate ?? "",
        by: row.cancelledBy,
        reason: row.cancelledReason ?? "",
      }
    : undefined,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const toIPayment = (row: PaymentRow) => ({
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

export async function cancelBookingAction(
  bookingId: string,
  reason?: string,
): Promise<IBooking> {
  const customer = await getDinerSession();
  if (!customer) redirect("/signin");

  const bookingRow = (
    await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1)
  )[0];
  if (!bookingRow || bookingRow.customerId !== customer.userId) {
    throw new Error("Booking not found.");
  }

  const paymentRow = (
    await db
      .select()
      .from(payments)
      .where(eq(payments.bookingId, bookingId))
      .limit(1)
  )[0];

  if (bookingRow.status !== "pending" && bookingRow.status !== "confirmed") {
    throw new Error("This booking can no longer be cancelled.");
  }
  if (
    getEffectiveBookingStatus(toIBooking(bookingRow), paymentRow ? toIPayment(paymentRow) : undefined) ===
    "cancelled"
  ) {
    throw new Error("This booking has already been cancelled.");
  }

  const cancelledReason = reason?.trim() || "Cancelled by the customer.";
  const cancelledDate = new Date().toISOString().slice(0, 10);
  const updatedAt = new Date().toISOString();

  await db
    .update(bookings)
    .set({
      status: "cancelled",
      cancelledBy: "user",
      cancelledDate,
      cancelledReason,
      updatedAt,
    })
    .where(eq(bookings.id, bookingId));

  const tableRow = (
    await db
      .select({ restaurantId: tables.restaurantId })
      .from(tables)
      .where(eq(tables.id, bookingRow.tableId))
      .limit(1)
  )[0];
  const restaurantId = tableRow?.restaurantId ?? "rest-001";

  revalidatePath(`/bookings/${bookingId}`, "page");
  revalidatePath("/bookings", "page");
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/bookings", "page");

  await broadcastBookingEvent("booking:cancelled", {
    bookingId,
    restaurantId,
    customerId: customer.userId,
    tableId: bookingRow.tableId,
    status: "cancelled",
    cancelledBy: "user",
    cancelledReason,
  });

  return {
    id: bookingId,
    date: bookingRow.date,
    time: bookingRow.time,
    partySize: bookingRow.partySize,
    specialRequest: bookingRow.specialRequest ?? undefined,
    status: "cancelled",
    customerId: bookingRow.customerId,
    tableId: bookingRow.tableId,
    cancelled: { date: cancelledDate, by: "user", reason: cancelledReason },
    createdAt: bookingRow.createdAt,
    updatedAt,
  };
}