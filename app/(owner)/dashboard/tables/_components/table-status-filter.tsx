import { Button } from "@components";

import { buildTablesHref } from "./url-params";

import type { PlaceFilter, StatusFilter } from "./filters";

const FILTER_ACTIVE = "border! px-3! py-2! size-fit!";
const FILTER_INACTIVE = `${FILTER_ACTIVE} text-muted! border-muted!`;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "free", label: "Free" },
  { value: "reserved", label: "Reserved" },
  { value: "occupied", label: "Occupied" },
];

interface TableStatusFilterProps {
  current: StatusFilter;
  date: string;
  place: PlaceFilter;
  counts: { all: number; free: number; reserved: number; occupied: number };
}

export const TableStatusFilter = ({
  current,
  date,
  place,
  counts,
}: TableStatusFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((item) => {
        const active = current === item.value;
        return (
          <Button
            key={item.value}
            as="link"
            variant="outline"
            href={buildTablesHref({ date, place, status: item.value })}
            scroll={false}
            aria-pressed={active}
            className={active ? FILTER_ACTIVE : FILTER_INACTIVE}
          >
            {item.label} ({counts[item.value]})
          </Button>
        );
      })}
    </div>
  );
};