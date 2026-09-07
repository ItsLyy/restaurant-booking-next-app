import { QuickInformation } from "./_components/sections/quick-information";
import { TableStatus } from "./_components/sections/table-status";
import { TodayBooking } from "./_components/sections/today-booking";

export default function OverviewPage() {
  return (
    <section className="px-4 pt-3 pb-6 size-full flex gap-4">
      <div className="size-full flex flex-col gap-4">
        <QuickInformation />
        <TodayBooking />
      </div>
      <TableStatus />
    </section>
  );
}
