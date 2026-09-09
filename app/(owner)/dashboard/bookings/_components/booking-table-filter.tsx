import { Button } from "@components";

import { buildBookingsHref } from "./url-params";

import type { BookingCounts } from "../_data/bookings";
import type { BookingFilter } from "./booking-filter";

const FILTER_ACTIVE = "border! px-3! py-2! size-fit!";
const FILTER_INACTIVE = `${FILTER_ACTIVE} text-muted! border-muted!`;

interface BookingTableFilterProps {
  current: BookingFilter;
  counts: BookingCounts;
  date: string;
  query: string;
}

export const BookingTableFilter = ({
  current,
  counts,
  date,
  query,
}: BookingTableFilterProps) => {
  const items: { label: string; value: BookingFilter }[] = [
    { label: `All (${counts.total})`, value: "all" },
    { label: `Pending (${counts.pending})`, value: "pending" },
    { label: `Confirmed (${counts.confirmed})`, value: "confirmed" },
    { label: `Cancelled (${counts.cancelled})`, value: "cancelled" },
    { label: `Completed (${counts.completed})`, value: "completed" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = current === item.value;
        return (
          <Button
            key={item.value}
            as="link"
            variant="outline"
            href={buildBookingsHref({ date, filter: item.value, query })}
            scroll={false}
            aria-pressed={active}
            className={active ? FILTER_ACTIVE : FILTER_INACTIVE}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};