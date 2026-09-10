import { Button } from "@components";

import { buildTablesHref } from "./url-params";

import type { PlaceFilter, StatusFilter } from "./filters";

const FILTER_ACTIVE = "border! px-3! py-2! size-fit!";
const FILTER_INACTIVE = `${FILTER_ACTIVE} text-muted! border-muted!`;

const PLACE_OPTIONS: { value: PlaceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "private", label: "Private" },
];

interface TablePlaceFilterProps {
  current: PlaceFilter;
  date: string;
  status: StatusFilter;
  counts: { all: number; indoor: number; outdoor: number; private: number };
}

export const TablePlaceFilter = ({
  current,
  date,
  status,
  counts,
}: TablePlaceFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {PLACE_OPTIONS.map((item) => {
        const active = current === item.value;
        return (
          <Button
            key={item.value}
            as="link"
            variant="outline"
            href={buildTablesHref({ date, status, place: item.value })}
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