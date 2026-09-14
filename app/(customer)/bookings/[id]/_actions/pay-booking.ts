"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { db } from "@db/client";
import { bookings, payments, tables } from "@db/schema";
import { broadcastBookingEvent } from "@db/broadcast";
import { getDinerSession } from "@libs/session";

import type { PaymentRow } from "@db/schema";
import type { IPayment } from "@types";

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

export async function payBookingAction(bookingId: string): Promise<IPayment> {
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
  if (!paymentRow) {
    throw new Error("No payment found for this booking.");
  }

  const now = new Date().toISOString();

  const updatedRows = await db
    .update(payments)
    .set({ status: "paid", paidAt: now, updatedAt: now })
    .where(eq(payments.id, paymentRow.id))
    .returning();
  const updated = toIPayment(updatedRows[0] ?? paymentRow);

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

  await broadcastBookingEvent("booking:paid", {
    bookingId,
    restaurantId,
    customerId: customer.userId,
    tableId: bookingRow.tableId,
    paymentStatus: "paid",
    status: bookingRow.status,
    price: updated.price,
  });

  return updated;
}