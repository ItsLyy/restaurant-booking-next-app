import { Card } from "../card";
import { BookingInformation } from "../booking-information";
import { WarningNotification } from "../warning-notification";
import { BookingTable } from "../booking-table";
import { BookingTableFilter } from "../booking-table-filter";
import { TodayBookingDate } from "./today-booking-date";

import type { BookingFilter } from "../booking-filter";
import type { DashboardBooking } from "../../_data/dashboard";

interface TodayBookingProps {
  bookings: DashboardBooking[];
  filter: BookingFilter;
}

export const TodayBooking = ({ bookings, filter }: TodayBookingProps) => {
  const totalToday = bookings.length;
  const totalPending = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const totalConfirmed = bookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;
  const totalGuest = bookings.reduce((sum, booking) => sum + booking.party, 0);

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  return (
    <Card className="flex-1 min-h-0 flex flex-col gap-4">
      <div className="flex flex-col">
        <h2 className="text-d-header-md text-foreground">
          Today&apos;s Booking
        </h2>
        <TodayBookingDate />
      </div>
      <BookingInformation
        totalToday={totalToday}
        totalPending={totalPending}
        totalConfirmed={totalConfirmed}
        totalGuest={totalGuest}
      />
      <WarningNotification pendingCount={totalPending} />
      <BookingTableFilter
        current={filter}
        counts={{ pending: totalPending, confirmed: totalConfirmed }}
      />
      <BookingTable bookings={filteredBookings} />
    </Card>
  );
};