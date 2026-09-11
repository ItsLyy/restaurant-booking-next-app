"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCustomerSession } from "@libs/session";

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
  const customer = await getCustomerSession();
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

  revalidatePath(`/bookings/${bookingId}`, "page");
  revalidatePath("/bookings", "page");
  revalidatePath("/dashboard", "page");

  return updated;
}