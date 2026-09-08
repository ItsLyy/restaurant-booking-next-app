"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { revalidatePath } from "next/cache";

import type { IPayment } from "@types";

const PAYMENTS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/payments.json",
);

export async function payBookingAction(bookingId: string): Promise<IPayment> {
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