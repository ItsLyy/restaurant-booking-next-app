import Link from "next/link";

import { getAllBookings } from "@data/bookings/get-all-bookings";

import { formatDayDate, formatTime, resolvePaymentStatus } from "@utils";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View your restaurant bookings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BookingsPage() {
  const bookings = await getAllBookings();

  return (
    <section className="space-y-4">
      <h1 className="text-c-header-lg text-foreground">My Bookings</h1>
      <ul className="space-y-4">
        {bookings.map(
          ({ booking, bookingCode, restaurantName, paymentStatus }) => (
            <li key={booking.id}>
              <Link
                href={`/bookings/${booking.id}`}
                className="block bg-base-200 p-6 rounded-3xl border border-muted space-y-2"
              >
                <span className="text-c-header-md text-foreground">
                  {restaurantName}
                </span>
                <span className="text-c-normal text-muted block">
                  {bookingCode} ·{" "}
                  {resolvePaymentStatus(booking.status, paymentStatus)}
                </span>
                <span className="text-c-normal text-muted block">
                  {formatDayDate(booking.date)} · {formatTime(booking.time)} ·{" "}
                  {booking.partySize} people
                </span>
              </Link>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}