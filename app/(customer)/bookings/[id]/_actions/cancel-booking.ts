"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { revalidatePath } from "next/cache";

import { getEffectiveBookingStatus } from "@data/bookings/booking-deadline";

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
  const bookings = readBookings();
  const index = bookings.findIndex((item) => item.id === bookingId);
  if (index === -1) {
    throw new Error("Booking not found.");
  }

  const booking = bookings[index];
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

  revalidatePath(`/bookings/${bookingId}`, "page");
  revalidatePath("/bookings", "page");
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/bookings", "page");

  return updated;
}