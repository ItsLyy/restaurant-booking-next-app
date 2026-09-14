import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { db } from "@db/client";
import { bookings, payments, restaurants, tables } from "@db/schema";

import { toBookingCode } from "./booking-code";
import { getEffectiveBookingStatus } from "./booking-deadline";

import type { BookingRow, PaymentRow } from "@db/schema";
import type { IBooking, IPayment } from "@types";

interface BookingListItem {
  booking: IBooking;
  bookingCode: string;
  restaurantName: string;
  restaurantSlug: string;
  paymentStatus: IPayment["status"] | undefined;
}

const toIBooking = (row: BookingRow): IBooking => ({
  id: row.id,
  date: row.date,
  time: row.time,
  partySize: row.partySize,
  ...(row.specialRequest ? { specialRequest: row.specialRequest } : {}),
  status: row.status,
  customerId: row.customerId,
  tableId: row.tableId,
  ...(row.cancelledBy
    ? {
        cancelled: {
          date: row.cancelledDate ?? "",
          by: row.cancelledBy,
          reason: row.cancelledReason ?? "",
        },
      }
    : {}),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const toIPayment = (row?: PaymentRow): IPayment | undefined => {
  if (!row) return undefined;
  return {
    id: row.id,
    price: row.price,
    status: row.status,
    deadline: row.deadline,
    gatewayToken: row.gatewayToken,
    bookingId: row.bookingId,
    paidAt: row.paidAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

export async function getAllBookings(
  customerId?: string,
): Promise<BookingListItem[]> {
  const conditions = [];
  if (customerId) conditions.push(eq(bookings.customerId, customerId));

  const bookingRows = conditions.length
    ? await db.select().from(bookings).where(and(...conditions))
    : await db.select().from(bookings);

  const tableIds = [...new Set(bookingRows.map((booking) => booking.tableId))];
  const tableRows = tableIds.length
    ? await db.select().from(tables).where(inArray(tables.id, tableIds))
    : [];
  const tableById = new Map(tableRows.map((row) => [row.id, row]));

  const restaurantIds = [
    ...new Set(tableRows.map((table) => table.restaurantId)),
  ];
  const restaurantRows = restaurantIds.length
    ? await db
        .select()
        .from(restaurants)
        .where(inArray(restaurants.id, restaurantIds))
    : [];
  const restaurantById = new Map(
    restaurantRows.map((row) => [row.id, row]),
  );

  const bookingIds = bookingRows.map((booking) => booking.id);
  const paymentRows = bookingIds.length
    ? await db
        .select()
        .from(payments)
        .where(inArray(payments.bookingId, bookingIds))
    : [];
  const paymentByBookingId = new Map(
    paymentRows.map((row) => [row.bookingId, row] as const),
  );

  return bookingRows.map((booking) => {
    const table = tableById.get(booking.tableId);
    const restaurant = table
      ? restaurantById.get(table.restaurantId)
      : undefined;
    const payment = paymentByBookingId.get(booking.id);

    return {
      booking: {
        ...toIBooking(booking),
        status: getEffectiveBookingStatus(
          toIBooking(booking),
          toIPayment(payment),
        ),
      },
      bookingCode: toBookingCode(booking.id),
      restaurantName: restaurant?.name ?? "Restaurant",
      restaurantSlug: restaurant?.slug ?? "",
      paymentStatus: payment?.status,
    };
  });
}