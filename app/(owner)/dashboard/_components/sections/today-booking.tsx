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
  selectedTableId?: string;
  selectedTableName?: string;
}

export const TodayBooking = ({
  bookings,
  filter,
  selectedTableId,
  selectedTableName,
}: TodayBookingProps) => {
  const tableBookings = selectedTableId
    ? bookings.filter((booking) => booking.tableId === selectedTableId)
    : bookings;

  const totalToday = tableBookings.length;
  const totalPending = tableBookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const totalConfirmed = tableBookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;
  const totalGuest = tableBookings.reduce(
    (sum, booking) => sum + booking.party,
    0,
  );

  const filteredBookings =
    filter === "all"
      ? tableBookings
      : tableBookings.filter((booking) => booking.status === filter);

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
        selectedTableId={selectedTableId}
        selectedTableName={selectedTableName}
      />
      <BookingTable bookings={filteredBookings} />
    </Card>
  );
};