"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getEffectiveBookingStatus } from "@data/bookings/booking-deadline";
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

function readBookings(): IBooking[] {
  return JSON.parse(readFileSync(BOOKINGS_FILE_PATH, "utf8")) as IBooking[];
}

function readPayments(): IPayment[] {
  return JSON.parse(readFileSync(PAYMENTS_FILE_PATH, "utf8")) as IPayment[];
}

export async function cancelBookingAction(
  bookingId: string,
  reason?: string,
): Promise<IBooking> {
  const customer = await getDinerSession();
  if (!customer) redirect("/signin");

  const bookings = readBookings();
  const index = bookings.findIndex((item) => item.id === bookingId);
  if (index === -1) {
    throw new Error("Booking not found.");
  }

  const booking = bookings[index];
  if (booking.customerId !== customer.userId) {
    throw new Error("Booking not found.");
  }
  const payment = readPayments().find((item) => item.bookingId === bookingId);

  if (booking.status !== "pending" && booking.status !== "confirmed") {
    throw new Error("This booking can no longer be cancelled.");
  }
  if (getEffectiveBookingStatus(booking, payment) === "cancelled") {
    throw new Error("This booking has already been cancelled.");
  }

  const cancelledReason = reason?.trim() || "Cancelled by the customer.";

  const updated: IBooking = {
    ...booking,
    status: "cancelled",
    cancelled: {
      date: new Date().toISOString().slice(0, 10),
      by: "user",
      reason: cancelledReason,
    },
    updatedAt: new Date().toISOString(),
  };
  bookings[index] = updated;

  writeFileSync(
    BOOKINGS_FILE_PATH,
    `${JSON.stringify(bookings, null, 2)}\n`,
    "utf8",
  );

  // Sync to database if available
  try {
    const { db } = await import("@db/client");
    const { bookings: bookingsTable } = await import("@db/schema");
    const { eq } = await import("drizzle-orm");

    await db
      .update(bookingsTable)
      .set({
        status: "cancelled",
        cancelledBy: "user",
        cancelledDate: updated.cancelled?.date ?? new Date().toISOString().slice(0, 10),
        cancelledReason,
        updatedAt: updated.updatedAt,
      })
      .where(eq(bookingsTable.id, bookingId));
  } catch {
    // DB sync error handled gracefully
  }

  revalidatePath(`/bookings/${bookingId}`, "page");
  revalidatePath("/bookings", "page");
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/bookings", "page");

  // Broadcast booking:cancelled event
  try {
    const { broadcastBookingEvent } = await import("@db/broadcast");
    const tablesPath = path.join(process.cwd(), "app/_data/dummy/tables.json");
    const rawTables = JSON.parse(readFileSync(tablesPath, "utf8")) as {
      id: string;
      restaurantId: string;
    }[];
    const restaurantId =
      rawTables.find((t) => t.id === booking.tableId)?.restaurantId ?? "rest-001";

    await broadcastBookingEvent("booking:cancelled", {
      bookingId,
      restaurantId,
      customerId: customer.userId,
      tableId: booking.tableId,
      status: "cancelled",
      cancelledBy: "user",
      cancelledReason,
    });
  } catch {
    // Broadcast failure handled gracefully
  }

  return updated;
}