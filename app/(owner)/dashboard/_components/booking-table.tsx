import { formatShortDate } from "@utils/formatDate";

import { BookingBadge } from "./booking-badge";
import { BookingRowOptions } from "./booking-row-options";

import type { DashboardBooking } from "../_data/dashboard";

const HEADERS = [
  "DATE",
  "TIME",
  "GUEST",
  "PARTY",
  "TABLE",
  "BOOKING",
  "PAYMENT",
  "",
];

const STATUS_LABELS: Record<DashboardBooking["status"], string> = {
  confirmed: "Confirmed",
  pending: "Pending",
};

export const BookingTable = ({
  bookings,
}: {
  bookings: DashboardBooking[];
}) => {
  if (bookings.length === 0) {
    return <p className="text-muted text-d-caption text-center py-10">No bookings to show.</p>;
  }

  return (
    <div className="flex-1 min-h-0 border border-muted rounded-lg px-4 pb-12 overflow-y-auto scrollbar-hidden box-border">
      <table className="w-full border-separate border-spacing-y-4">
        <thead>
          <tr>
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="text-left text-xs font-medium whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="text-d-body text-muted whitespace-nowrap">
                {formatShortDate(booking.date)}
              </td>
              <td className="text-d-body text-foreground whitespace-nowrap">
                {booking.time}
              </td>
              <td className="text-d-body text-foreground whitespace-nowrap">
                {booking.guest}
              </td>
              <td className="text-d-body text-foreground whitespace-nowrap">
                {booking.party} People
              </td>
              <td className="text-d-body text-foreground whitespace-nowrap">
                {booking.table}
              </td>
              <td>
                <BookingBadge
                  status={STATUS_LABELS[booking.status]}
                  variant={
                    booking.status === "confirmed" ? "positive" : "neutral"
                  }
                />
              </td>
              <td>
                <BookingBadge
                  status={booking.isPaid ? "Paid" : "Unpaid"}
                  variant={booking.isPaid ? "positive" : "neutral"}
                />
              </td>
              <td>
                <BookingRowOptions booking={booking} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};