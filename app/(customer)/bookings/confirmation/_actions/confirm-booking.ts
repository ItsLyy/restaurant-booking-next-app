"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { revalidatePath } from "next/cache";

import type { IBooking } from "@types";

const BOOKINGS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/bookings.json",
);

function readBookings(): IBooking[] {
  return JSON.parse(readFileSync(BOOKINGS_FILE_PATH, "utf8")) as IBooking[];
}

export interface ConfirmBookingState {
  ok: boolean;
  error?: string;
}

export async function confirmBookingAction(
  _prevState: ConfirmBookingState,
  formData: FormData,
): Promise<ConfirmBookingState> {
  const bookingId = String(formData.get("bookingId") ?? "").trim();
  const specialRequest = String(formData.get("specialRequest") ?? "")
    .trim()
    .slice(0, 500);

  if (!bookingId) {
    return { ok: false, error: "The booking reference is missing." };
  }

  const bookings = readBookings();
  const index = bookings.findIndex((booking) => booking.id === bookingId);
  if (index === -1) {
    return { ok: false, error: "This booking no longer exists." };
  }

  const booking = bookings[index];
  if (booking.status === "cancelled" || booking.status === "no_show") {
    return { ok: false, error: "This booking can no longer be confirmed." };
  }

  bookings[index] = {
    ...booking,
    ...(specialRequest ? { specialRequest } : {}),
    updatedAt: new Date().toISOString(),
  };

  try {
    writeFileSync(
      BOOKINGS_FILE_PATH,
      `${JSON.stringify(bookings, null, 2)}\n`,
      "utf8",
    );
  } catch {
    return { ok: false, error: "Could not save the booking right now." };
  }

  revalidatePath(`/bookings/${bookingId}`, "page");
  revalidatePath("/bookings", "page");
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/bookings", "page");

  return { ok: true };
}