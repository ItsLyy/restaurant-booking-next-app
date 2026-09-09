"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

function buildNextBookingId(bookings: IBooking[]): string {
  let max = 0;
  for (const booking of bookings) {
    const sequence = Number(booking.id.replace("booking-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `booking-${String(max + 1).padStart(3, "0")}`;
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
  revalidatePath("/dashboard/bookings", "page");
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

  if (
    getEffectiveBookingStatus(booking, paymentByBookingId.get(id)) !== "pending"
  ) {
    throw new Error(
      "This booking was auto-cancelled because it was not confirmed within 72 hours.",
    );
  }

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

export async function completeBookingAction(id: string): Promise<IBooking> {
  const bookings = readBookings();
  const index = findBookingIndex(bookings, id);
  const booking = bookings[index];

  if (booking.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be marked as completed.");
  }

  const completed = saveBooking(bookings, {
    ...booking,
    status: "completed",
    updatedAt: new Date().toISOString(),
  });

  const payments = readPayments();
  const payment = payments.find((item) => item.bookingId === id);
  if (payment && payment.status === "unpaid") {
    payment.status = "paid";
    payment.updatedAt = new Date().toISOString();
    writePayments(payments);
  }

  return completed;
}

export interface ManualBookingState {
  ok: boolean;
  error?: string;
}

const RESTAURANT_ID = "rest-001";
const MANUAL_BOOKING_ACTOR_ID = "owner-001";

export async function createManualBookingAction(
  _prevState: ManualBookingState,
  formData: FormData,
): Promise<ManualBookingState> {
  const date = String(formData.get("date") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const partySize = Number(formData.get("partySize"));
  const tableId = String(formData.get("tableId") ?? "");
  const specialRequest = String(formData.get("specialRequest") ?? "").trim();

  const todayClock = new Date();
  const today = [
    todayClock.getFullYear(),
    String(todayClock.getMonth() + 1).padStart(2, "0"),
    String(todayClock.getDate()).padStart(2, "0"),
  ].join("-");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "Please choose a valid date." };
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { ok: false, error: "Please choose a valid time." };
  }
  if (date < today) {
    return { ok: false, error: "Booking date cannot be in the past." };
  }
  if (date === today) {
    const currentTime = `${String(todayClock.getHours()).padStart(2, "0")}:${String(todayClock.getMinutes()).padStart(2, "0")}`;
    if (time <= currentTime) {
      return {
        ok: false,
        error: "Booking time must be later than the current time.",
      };
    }
  }
  const table = tables.find(
    (item) => item.id === tableId && item.restaurantId === RESTAURANT_ID,
  ) as ITable | undefined;
  if (!table) {
    return { ok: false, error: "Please choose a table." };
  }
  if (!Number.isInteger(partySize) || partySize < 1) {
    return { ok: false, error: "Party size must be at least 1." };
  }
  if (partySize > table.capacity) {
    return {
      ok: false,
      error: `${table.name} only holds up to ${table.capacity} people.`,
    };
  }
  if (tableId && date && time) {
    const bookings = readBookings();
    const paymentByBookingId = new Map(
      readPayments().map((payment) => [payment.bookingId, payment]),
    );
    const conflicting = bookings.find(
      (item) =>
        item.tableId === tableId &&
        item.date === date &&
        item.time === time &&
        item.status !== "cancelled" &&
        getEffectiveBookingStatus(item, paymentByBookingId.get(item.id)) ===
          "confirmed",
    );
    if (conflicting) {
      return {
        ok: false,
        error: `That slot on ${table.name} at ${time} is already taken by booking ${conflicting.id}.`,
      };
    }
  }

  const now = new Date().toISOString();
  const bookings = readBookings();
  const id = buildNextBookingId(bookings);

  bookings.push({
    id,
    date,
    time,
    partySize,
    status: "confirmed",
    customerId: MANUAL_BOOKING_ACTOR_ID,
    tableId,
    specialRequest: specialRequest || undefined,
    createdAt: now,
    updatedAt: now,
  });
  writeBookings(bookings);

  const payments = readPayments();
  payments.push({
    id: buildNextPaymentId(payments),
    price: table.price,
    status: "unpaid",
    deadline: derivePaymentDeadline(),
    gatewayToken: `tok_sandbox_${id}`,
    bookingId: id,
    createdAt: now,
    updatedAt: now,
  });
  writePayments(payments);

  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/bookings", "page");
  redirect(`/dashboard/bookings?date=${date}`);
}