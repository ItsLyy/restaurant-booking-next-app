import { getDashboardData } from "./_data/dashboard";

import { QuickInformation } from "./_components/sections/quick-information";
import { TableStatus } from "./_components/sections/table-status";
import { TodayBooking } from "./_components/sections/today-booking";
import { parseBookingFilter } from "./_components/booking-filter";

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const data = getDashboardData();
  const { status } = await searchParams;
  const filter = parseBookingFilter(status);

  return (
    <section className="px-4 pt-3 pb-6 h-full flex gap-4">
      <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-4">
        <QuickInformation bookings={data.bookings} />
        <TodayBooking bookings={data.bookings} filter={filter} />
      </div>
      <TableStatus
        tablesByFloor={data.tablesByFloor}
        bookings={data.bookings}
      />
    </section>
  );
}
