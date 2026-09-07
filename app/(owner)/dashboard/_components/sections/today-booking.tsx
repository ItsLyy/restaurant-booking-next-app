import { Card } from "../card";
import { BookingInformation } from "../booking-information";
import { WarningNotification } from "../warning-notification";
import { BookingTable } from "../booking-table";
import { TodayBookingDate } from "./today-booking-date";

export const TodayBooking = () => {
  return (
    <Card className="size-full flex flex-col gap-4">
      <div className="flex flex-col">
        <h2 className="text-d-header-md text-foreground">
          Today&apos;s Booking
        </h2>
        <TodayBookingDate />
      </div>
      <BookingInformation
        totalConfirmed={0}
        totalGuest={0}
        totalPending={0}
        totalToday={0}
      />
      <WarningNotification />
      <BookingTable />
    </Card>
  );
};
