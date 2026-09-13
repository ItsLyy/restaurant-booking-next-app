import { BookingBadge } from "../../_components/booking-badge";
import { InfoCard, InfoRow } from "../../_components/info-card";

import { formatPrice } from "@utils";
import { formatDayDate, formatShortDate } from "@utils/formatDate";

import type { DetailedBookingInfo } from "../_data/bookings";

export const BookingInfo = ({ booking }: { booking: DetailedBookingInfo }) => {
  const formattedCreatedAt = booking.createdAt
    ? formatDayDate(booking.createdAt.slice(0, 10))
    : "—";

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard title="Reservation">
          <InfoRow label="Guest">{booking.guest}</InfoRow>
          <InfoRow label="Party size">{booking.party} people</InfoRow>
          <InfoRow label="Date">{formatShortDate(booking.date)}</InfoRow>
          <InfoRow label="Time">{booking.time}</InfoRow>
          <InfoRow label="Table">{booking.table}</InfoRow>
          <InfoRow label="Special request">
            {booking.specialRequest ?? <span className="text-muted">None</span>}
          </InfoRow>
        </InfoCard>

        <InfoCard title="Payment">
          <InfoRow label="Amount">
            {booking.price !== null ? formatPrice(booking.price) : "—"}
          </InfoRow>
          <InfoRow label="Status">
            <div className="flex justify-end">
              <BookingBadge
                status={booking.isPaid ? "Paid" : "Unpaid"}
                variant={booking.isPaid ? "positive" : "neutral"}
              />
            </div>
          </InfoRow>
          <InfoRow label="Payment deadline">
            {booking.paymentDeadline
              ? formatShortDate(booking.paymentDeadline.slice(0, 10))
              : "—"}
          </InfoRow>
          <InfoRow label="Requested at">{formattedCreatedAt}</InfoRow>
          <InfoRow label="Last updated">
            {booking.updatedAt
              ? formatDayDate(booking.updatedAt.slice(0, 10))
              : "—"}
          </InfoRow>
        </InfoCard>
      </div>

      {booking.cancelled && (
        <InfoCard title="Cancellation">
          <InfoRow label="Cancelled on">
            {formatDayDate(booking.cancelled.date)}
          </InfoRow>
          <InfoRow label="Cancelled by">
            {booking.cancelled.by === "user" ? "Customer" : "Restaurant"}
          </InfoRow>
          <InfoRow label="Reason">{booking.cancelled.reason}</InfoRow>
        </InfoCard>
      )}
    </>
  );
};