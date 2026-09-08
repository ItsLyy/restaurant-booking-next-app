import { readFileSync } from "fs";
import path from "path";

import restaurants from "@data/dummy/restaurants.json";
import tables from "@data/dummy/tables.json";

import { toBookingCode } from "./booking-code";
import { getEffectiveBookingStatus } from "./booking-deadline";

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

interface GetBookingResponse {
  booking: IBooking;
  bookingCode: string;
  restaurantName: string;
  restaurantSlug: string;
  restaurantAddress: string;
  tableName: string;
  payment: IPayment | null;
}

export async function getBooking(
  id: string,
): Promise<GetBookingResponse | null> {
  const booking = readBookings().find((item) => item.id === id);
  if (!booking) return null;

  const table = tables.find((item) => item.id === booking.tableId);
  const restaurant = restaurants.find(
    (item) => item.id === table?.restaurantId,
  );

  const payment = readPayments().find(
    (item) => item.bookingId === booking.id,
  );

  const effectiveStatus = getEffectiveBookingStatus(booking, payment);
  const effectiveBooking: IBooking =
    effectiveStatus === "cancelled" && booking.status !== "cancelled"
      ? {
          ...booking,
          status: "cancelled",
          cancelled: {
            date: new Date().toISOString().slice(0, 10),
            by: "restaurant",
            reason:
              "Payment deadline passed. The booking was automatically cancelled.",
          },
        }
      : booking;

  return {
    booking: effectiveBooking,
    bookingCode: toBookingCode(booking.id),
    restaurantName: restaurant?.name ?? "Restaurant",
    restaurantSlug: restaurant?.slug ?? "",
    restaurantAddress: restaurant?.address ?? "",
    tableName: table?.name ?? booking.tableId,
    payment: payment ?? null,
  };
}
