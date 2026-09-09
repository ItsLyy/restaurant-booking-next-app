import { Card } from "./card";

import { formatDate, formatDayDate, formatPrice, formatTime } from "@utils";

import type { IBooking, IPayment } from "@types";

interface StatusDescriptionProps {
  bookingId: string;
  bookingDate: string;
  bookingTime: IBooking["time"];
  bookingTable: string;
  bookingPartySize: number;
  bookingStatus: IBooking["status"];
  paymentPrice: number;
  paymentStatus: IPayment["status"];
  cancelledDate?: string;
  cancelledReason?: string;
}

export const StatusDescription = ({
  bookingId,
  bookingDate,
  bookingPartySize,
  bookingTable,
  bookingTime,
  bookingStatus,
  paymentStatus,
  cancelledDate,
  cancelledReason,
  paymentPrice,
}: StatusDescriptionProps) => {
  return (
    <Card className="space-y-2">
      <h2 className="text-c-button text-muted">BOOKING DETAILS</h2>
      <ul>
        <ListItem
          label="Booking ID"
          value={bookingId}
          valueClassName="text-accent-100!"
        />
        <ListItem
          label="Date"
          value={formatDayDate(bookingDate)}
          isMuted={bookingStatus === "cancelled" || bookingStatus === "no_show"}
        />
        <ListItem
          label="Time"
          value={formatTime(bookingTime)}
          isMuted={bookingStatus === "cancelled" || bookingStatus === "no_show"}
        />
        <ListItem
          label="Table"
          value={bookingTable}
          isMuted={bookingStatus === "cancelled" || bookingStatus === "no_show"}
        />
        <ListItem
          label="Party Size"
          value={`${bookingPartySize} People`}
          isMuted={bookingStatus === "cancelled" || bookingStatus === "no_show"}
        />
        <ListItem
          label="Payment"
          value={formatPrice(paymentPrice)}
          valueClassName={
            paymentStatus === "unrefunded"
              ? "text-negative!"
              : paymentStatus === "refunded"
                ? "text-accent-200!"
                : ""
          }
        />
        {cancelledDate && bookingStatus === "cancelled" && (
          <ListItem label="Cancelled On" value={formatDate(cancelledDate)} />
        )}
        {cancelledReason && bookingStatus === "cancelled" && (
          <ListItem label="Reason" value={cancelledReason} />
        )}
      </ul>
    </Card>
  );
};

const ListItem = ({
  label,
  value,
  valueClassName = "",
  isMuted,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  isMuted?: boolean;
}) => {
  return (
    <li className="flex justify-between items-center py-3 px-2 border-b border-muted/40 *:leading-tight">
      <span className="text-c-normal text-foreground/60">{label}</span>
      <span
        className={`text-c-normal text-foreground ${valueClassName} ${isMuted ? "text-muted! line-through" : ""}`}
      >
        {value}
      </span>
    </li>
  );
};
