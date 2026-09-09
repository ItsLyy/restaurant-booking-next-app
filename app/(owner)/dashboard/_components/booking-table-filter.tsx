import { Button } from "@components";

import type { BookingFilter } from "./booking-filter";

const FILTER_ACTIVE = "border! px-3! py-2! size-fit!";
const FILTER_INACTIVE = `${FILTER_ACTIVE} text-muted! border-muted!`;

interface BookingTableFilterProps {
  current: BookingFilter;
  counts: { pending: number; confirmed: number };
}

export const BookingTableFilter = ({
  current,
  counts,
}: BookingTableFilterProps) => {
  const items: { label: string; value: BookingFilter }[] = [
    { label: "All", value: "all" },
    { label: `Pending (${counts.pending})`, value: "pending" },
    { label: `Confirmed (${counts.confirmed})`, value: "confirmed" },
  ];

  return (
    <div className="flex gap-2">
      {items.map((item) => {
        const active = current === item.value;
        return (
          <Button
            key={item.value}
            as="link"
            variant="outline"
            href={
              item.value === "all"
                ? "/dashboard"
                : {
                    pathname: "/dashboard",
                    query: { status: item.value },
                  }
            }
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