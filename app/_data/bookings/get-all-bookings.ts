import bookings from "@data/dummy/bookings.json";
import payments from "@data/dummy/payments.json";
import restaurants from "@data/dummy/restaurants.json";
import tables from "@data/dummy/tables.json";

import { toBookingCode } from "./booking-code";
import { getEffectiveBookingStatus } from "./booking-deadline";

import type { IBooking, IPayment } from "@types";

interface BookingListItem {
  booking: IBooking;
  bookingCode: string;
  restaurantName: string;
  restaurantSlug: string;
  paymentStatus: IPayment["status"] | undefined;
}

export async function getAllBookings(): Promise<BookingListItem[]> {
  return bookings.map((booking) => {
    const table = tables.find((item) => item.id === booking.tableId);
    const restaurant = restaurants.find(
      (item) => item.id === table?.restaurantId,
    );
    const payment = payments.find(
      (item) => item.bookingId === booking.id,
    ) as IPayment | undefined;

    return {
      booking: {
        ...(booking as IBooking),
        status: getEffectiveBookingStatus(booking as IBooking, payment),
      },
      bookingCode: toBookingCode(booking.id),
      restaurantName: restaurant?.name ?? "Restaurant",
      restaurantSlug: restaurant?.slug ?? "",
      paymentStatus: payment?.status,
    };
  });
}