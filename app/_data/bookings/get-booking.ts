import bookings from "@data/dummy/bookings.json";
import payments from "@data/dummy/payments.json";
import restaurants from "@data/dummy/restaurants.json";
import tables from "@data/dummy/tables.json";

import { toBookingCode } from "./booking-code";

import type { IBooking, IPayment } from "@types";

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
  const booking = bookings.find((item) => item.id === id) as
    | IBooking
    | undefined;
  if (!booking) return null;

  const table = tables.find((item) => item.id === booking.tableId);
  const restaurant = restaurants.find(
    (item) => item.id === table?.restaurantId,
  );

  const payment = payments.find(
    (item) => item.bookingId === booking.id,
  ) as IPayment | undefined;

  return {
    booking,
    bookingCode: toBookingCode(booking.id),
    restaurantName: restaurant?.name ?? "Restaurant",
    restaurantSlug: restaurant?.slug ?? "",
    restaurantAddress: restaurant?.address ?? "",
    tableName: table?.name ?? booking.tableId,
    payment: payment ?? null,
  };
}
