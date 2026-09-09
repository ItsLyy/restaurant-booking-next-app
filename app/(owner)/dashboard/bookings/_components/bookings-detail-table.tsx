import Link from "next/link";

import { BookingBadge } from "../../_components/booking-badge";

import { BookingRowActions } from "./booking-row-actions";

import { formatShortDate } from "@utils/formatDate";

import type { DetailedBooking } from "../_data/bookings";
import type { Variant } from "../../_components/variant-styles";

const headerCell =
  "text-d-header-card text-muted text-left py-2 px-3 border-b border-muted";

const cell = "py-3 px-3 text-d-body text-foreground";

const getBookingVariant = (status: DetailedBooking["status"]): Variant => {
  switch (status) {
    case "pending":
      return "neutral";
    case "cancelled":
      return "negative";
    case "confirmed":
    case "completed":
      return "positive";
  }
};

export const BookingDetailTable = ({
  bookings,
  viewDate,
}: {
  bookings: DetailedBooking[];
  viewDate: string;
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-muted">
      <table className="w-full min-w-[720px] border-collapse bg-base-100">
        <thead>
          <tr>
            <th className={headerCell}>Code</th>
            <th className={headerCell}>Time</th>
            <th className={headerCell}>Guest</th>
            <th className={headerCell}>Party</th>
            <th className={headerCell}>Table</th>
            <th className={headerCell}>Booking</th>
            <th className={headerCell}>Payment</th>
            <th className={`${headerCell} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="py-8 text-center text-d-body text-muted"
              >
                No bookings match your filters for this day.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-muted/50 last:border-b-0"
              >
                <td className={cell}>
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="text-accent-100 hover:underline"
                  >
                    {booking.code}
                  </Link>
                </td>
                <td className={cell}>
                  {booking.time}
                  {booking.date !== viewDate ? (
                    <span className="ml-1 text-d-caption text-muted">
                      ({formatShortDate(booking.date)})
                    </span>
                  ) : null}
                </td>
                <td className={cell}>{booking.guest}</td>
                <td className={cell}>{booking.party}</td>
                <td className={cell}>{booking.table}</td>
                <td className={cell}>
                  <BookingBadge
                    status={booking.status}
                    variant={getBookingVariant(booking.status)}
                  />
                </td>
                <td className={cell}>
                  <BookingBadge
                    status={booking.isPaid ? "Paid" : "Unpaid"}
                    variant={booking.isPaid ? "positive" : "neutral"}
                  />
                </td>
                <td className={`${cell} text-right`}>
                  <BookingRowActions
                    booking={{
                      id: booking.id,
                      code: booking.code,
                      status: booking.status,
                      date: booking.date,
                      time: booking.time,
                      guest: booking.guest,
                      party: booking.party,
                      table: booking.table,
                    }}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
