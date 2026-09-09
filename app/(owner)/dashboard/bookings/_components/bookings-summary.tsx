import { Card } from "../../_components/card";

import { formatPrice } from "@utils/formatPrice";

import type { BookingCounts, DetailedBooking } from "../_data/bookings";

interface BookingsSummaryProps {
  bookings: DetailedBooking[];
  counts: BookingCounts;
}

export const BookingsSummary = ({ bookings, counts }: BookingsSummaryProps) => {
  const guests = bookings.reduce((sum, booking) => sum + booking.party, 0);
  const revenue = bookings
    .filter(
      (booking) =>
        booking.isPaid &&
        (booking.status === "confirmed" || booking.status === "completed"),
    )
    .reduce((sum, booking) => sum + (booking.price ?? 0), 0);

  const stats: { label: string; value: string }[] = [
    { label: "Total Bookings", value: String(counts.total) },
    { label: "Total Guests", value: String(guests) },
    { label: "Expected Revenue", value: formatPrice(revenue) },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex flex-col gap-1 py-3">
          <span className="text-d-caption text-muted">{stat.label}</span>
          <span className="text-d-stat text-foreground">{stat.value}</span>
        </Card>
      ))}
    </div>
  );
};