"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getDinerSession } from "@libs/session";

import type { IBooking, IPayment } from "@types";

const BOOKINGS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/bookings.json",
);

const PAYMENTS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/payments.json",
);

export async function payBookingAction(bookingId: string): Promise<IPayment> {
  const customer = await getDinerSession();
  if (!customer) redirect("/signin");

  const bookings = JSON.parse(
    readFileSync(BOOKINGS_FILE_PATH, "utf8"),
  ) as IBooking[];
  const booking = bookings.find((item) => item.id === bookingId);
  if (!booking || booking.customerId !== customer.userId) {
    throw new Error("Booking not found.");
  }

  const payments = JSON.parse(
    readFileSync(PAYMENTS_FILE_PATH, "utf8"),
  ) as IPayment[];

  const index = payments.findIndex((item) => item.bookingId === bookingId);
  if (index === -1) {
    throw new Error("No payment found for this booking.");
  }

  const now = new Date().toISOString();
  const updated = {
    ...payments[index],
    status: "paid" as const,
    paidAt: now,
    updatedAt: now,
  };
  payments[index] = updated;

  writeFileSync(
    PAYMENTS_FILE_PATH,
    `${JSON.stringify(payments, null, 2)}\n`,
    "utf8",
  );

  // Sync to database if available
  try {
    const { db } = await import("@db/client");
    const { payments: paymentsTable } = await import("@db/schema");
    const { eq } = await import("drizzle-orm");

    await db
      .update(paymentsTable)
      .set({ status: "paid", paidAt: now, updatedAt: now })
      .where(eq(paymentsTable.bookingId, bookingId));
  } catch {
    // DB sync error handled gracefully
  }

  revalidatePath(`/bookings/${bookingId}`, "page");
  revalidatePath("/bookings", "page");
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/bookings", "page");

  // Broadcast booking:paid event
  try {
    const { broadcastBookingEvent } = await import("@db/broadcast");
    const tablesPath = path.join(process.cwd(), "app/_data/dummy/tables.json");
    const rawTables = JSON.parse(readFileSync(tablesPath, "utf8")) as {
      id: string;
      restaurantId: string;
    }[];
    const restaurantId =
      rawTables.find((t) => t.id === booking.tableId)?.restaurantId ?? "rest-001";

    await broadcastBookingEvent("booking:paid", {
      bookingId,
      restaurantId,
      customerId: customer.userId,
      tableId: booking.tableId,
      paymentStatus: "paid",
      status: booking.status,
      price: updated.price,
    });
  } catch {
    // Broadcast failure handled gracefully
  }

  return updated;
}