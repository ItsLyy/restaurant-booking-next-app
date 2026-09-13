import Link from "next/link";

import type { UrlObject } from "url";

import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";
import { BookingBadge } from "../../_components/booking-badge";

import { BookingRowActions } from "./booking-row-actions";

import { formatShortDate } from "@utils/formatDate";

import type { DetailedBooking } from "../_data/bookings";
import type { Variant } from "../../_components/variant-styles";

const headerCell =
  "text-d-header-card text-muted text-left py-2 px-3 border-b border-muted bg-base-100";

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
  base = "/dashboard/bookings",
  emptyHref,
}: {
  bookings: DetailedBooking[];
  viewDate: string;
  base?: string;
  emptyHref?: string | UrlObject | null;
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-muted">
      <table className="w-full min-w-[720px] border-collapse bg-base-100">
        <thead className="sticky top-0 z-10">
          <tr>
            <th className={headerCell}>Code</th>
            <th className={headerCell}>Time</th>
            <th className={headerCell}>Guest</th>
            <th className={`${headerCell} text-right`}>Party</th>
            <th className={headerCell}>Table</th>
            <th className={headerCell}>Booking</th>
            <th className={headerCell}>Payment</th>
            <th className={`${headerCell} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-14 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-12 rounded-full bg-base-200 flex items-center justify-center">
                    <CalendarBlankIcon className="size-6 text-muted" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-d-body text-foreground">
                      No bookings found
                    </span>
                    <span className="text-d-caption">
                      No bookings match your filters for this day.
                    </span>
                  </div>
                  {emptyHref ? (
                    <Button
                      as="link"
                      variant="outline"
                      href={emptyHref}
                      scroll={false}
                      className="mt-1 py-0! px-3! h-9! w-fit! border-muted! text-muted!"
                    >
                      View all bookings
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-muted/50 last:border-b-0 transition-colors hover:bg-accent-200/[0.03]"
              >
                <td className={cell}>
                  <Link
                    href={`${base}/${booking.id}`}
                    className="text-accent-100 hover:underline font-medium"
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
                <td className={`${cell} text-right`}>{booking.party}</td>
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
                    base={base}
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