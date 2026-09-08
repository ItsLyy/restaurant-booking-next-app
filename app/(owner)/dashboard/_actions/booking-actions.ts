"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { revalidatePath } from "next/cache";

import tables from "@data/dummy/tables.json";

import {
  derivePaymentDeadline,
  getEffectiveBookingStatus,
} from "../../../_data/bookings/booking-deadline";

import type { IBooking, IPayment, ITable } from "@types";

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

function writePayments(payments: IPayment[]): void {
  writeFileSync(
    PAYMENTS_FILE_PATH,
    `${JSON.stringify(payments, null, 2)}\n`,
    "utf8",
  );
}

function writeBookings(bookings: IBooking[]): void {
  writeFileSync(
    BOOKINGS_FILE_PATH,
    `${JSON.stringify(bookings, null, 2)}\n`,
    "utf8",
  );
}

function buildNextPaymentId(payments: IPayment[]): string {
  let max = 0;
  for (const payment of payments) {
    const sequence = Number(payment.id.replace("payment-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `payment-${String(max + 1).padStart(3, "0")}`;
}

function findBookingIndex(bookings: IBooking[], id: string): number {
  const index = bookings.findIndex((booking) => booking.id === id);
  if (index === -1) {
    throw new Error("Booking not found.");
  }
  return index;
}

function saveBooking(bookings: IBooking[], booking: IBooking): IBooking {
  const index = findBookingIndex(bookings, booking.id);
  bookings[index] = booking;
  writeBookings(bookings);
  revalidatePath("/dashboard", "page");
  revalidatePath(`/bookings/${booking.id}`, "page");
  return booking;
}

export async function confirmBookingAction(id: string): Promise<IBooking> {
  const bookings = readBookings();
  const index = findBookingIndex(bookings, id);
  const booking = bookings[index];

  if (booking.status !== "pending") {
    throw new Error("Only pending bookings can be confirmed.");
  }

  const table = tables.find((item) => item.id === booking.tableId) as
    | ITable
    | undefined;

  const paymentByBookingId = new Map(
    readPayments().map((payment) => [payment.bookingId, payment]),
  );
  const conflictingBooking = bookings.find(
    (item) =>
      item.id !== id &&
      item.tableId === booking.tableId &&
      item.date === booking.date &&
      item.time === booking.time &&
      item.status !== "cancelled" &&
      getEffectiveBookingStatus(item, paymentByBookingId.get(item.id)) ===
        "confirmed",
  );
  if (conflictingBooking) {
    throw new Error(
      `Cannot confirm: that slot at ${booking.time} on ${table?.name ?? booking.tableId} is already held by booking ${conflictingBooking.id}. Reject that booking first.`,
    );
  }

  const now = new Date().toISOString();
  const confirmed = saveBooking(bookings, {
    ...booking,
    status: "confirmed",
    updatedAt: now,
  });

  const payments = readPayments();
  const existing = payments.find((item) => item.bookingId === id);
  if (existing) {
    return confirmed;
  }

  payments.push({
    id: buildNextPaymentId(payments),
    price: table?.price ?? booking.partySize * 25,
    status: "unpaid",
    deadline: derivePaymentDeadline(),
    gatewayToken: `tok_sandbox_${id}`,
    bookingId: id,
    createdAt: now,
    updatedAt: now,
  });
  writePayments(payments);

  return confirmed;
}

export async function rejectBookingAction(id: string): Promise<IBooking> {
  const bookings = readBookings();
  const index = findBookingIndex(bookings, id);
  const booking = bookings[index];

  if (booking.status === "cancelled") {
    throw new Error("Booking is already cancelled.");
  }

  return saveBooking(bookings, {
    ...booking,
    status: "cancelled",
    cancelled: {
      date: new Date().toISOString().slice(0, 10),
      by: "restaurant",
      reason: "Rejected by the restaurant.",
    },
    updatedAt: new Date().toISOString(),
  });
}