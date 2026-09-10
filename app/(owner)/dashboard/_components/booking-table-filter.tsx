import { Button } from "@components";

import type { BookingFilter } from "./booking-filter";

const FILTER_ACTIVE = "border! px-3! py-2! size-fit!";
const FILTER_INACTIVE = `${FILTER_ACTIVE} text-muted! border-muted!`;

interface BookingTableFilterProps {
  current: BookingFilter;
  counts: { pending: number; confirmed: number };
  selectedTableId?: string;
  selectedTableName?: string;
}

export const BookingTableFilter = ({
  current,
  counts,
  selectedTableId,
  selectedTableName,
}: BookingTableFilterProps) => {
  const items: { label: string; value: BookingFilter }[] = [
    { label: "All", value: "all" },
    { label: `Pending (${counts.pending})`, value: "pending" },
    { label: `Confirmed (${counts.confirmed})`, value: "confirmed" },
  ];

  const buildHref = (value: BookingFilter) => {
    const params = new URLSearchParams();
    if (value !== "all") params.set("status", value);
    if (selectedTableId) params.set("table", selectedTableId);
    const query = params.toString();
    return query ? `/dashboard?${query}` : "/dashboard";
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = current === item.value;
        return (
          <Button
            key={item.value}
            as="link"
            variant="outline"
            href={buildHref(item.value)}
            scroll={false}
            aria-pressed={active}
            className={active ? FILTER_ACTIVE : FILTER_INACTIVE}
          >
            {item.label}
          </Button>
        );
      })}
      {selectedTableId && selectedTableName ? (
        <Button
          as="link"
          href={current === "all" ? "/dashboard" : `/dashboard?status=${current}`}
          scroll={false}
          variant="outline"
          aria-label={`Clear table ${selectedTableName} selection`}
          className="flex items-center gap-1 border! px-3! py-2! size-fit! text-muted! border-muted!"
        >
          <span>{selectedTableName}</span>
          <span aria-hidden>×</span>
        </Button>
      ) : null}
    </div>
  );
};