import { Button } from "@components";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";

import { shiftDate, todayString } from "../_data/bookings";

import { buildBookingsHref } from "./url-params";
import { DatePickerButton } from "./date-picker-button";

import type { BookingFilter } from "./booking-filter";

interface DateFilterProps {
  date: string;
  filter: BookingFilter;
  query: string;
}

const ARROW_BUTTON =
  "flex justify-center items-center gap-1 p-2! size-9! border-muted! text-muted!";
const TODAY_BUTTON =
  "flex justify-center items-center gap-1 py-2! px-4! h-9! w-fit! border-muted! text-muted!";

export const DateFilter = ({ date, filter, query }: DateFilterProps) => {
  const today = todayString();
  const isToday = date === today;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        as="link"
        variant="outline"
        className={ARROW_BUTTON}
        href={buildBookingsHref({ date: shiftDate(date, -1), filter, query })}
        scroll={false}
        aria-label="Previous day"
      >
        <ArrowLeftIcon className="size-4" />
      </Button>
      <DatePickerButton date={date} />
      <Button
        as="link"
        variant="outline"
        className={ARROW_BUTTON}
        href={buildBookingsHref({ date: shiftDate(date, 1), filter, query })}
        scroll={false}
        aria-label="Next day"
      >
        <ArrowRightIcon className="size-4" />
      </Button>
      <Button
        as="link"
        variant="outline"
        className={`${TODAY_BUTTON} ${isToday ? "border-accent-100! text-accent-100!" : ""}`}
        href={buildBookingsHref({ filter, query })}
        scroll={false}
        aria-current={isToday ? "date" : undefined}
      >
        Today
      </Button>
    </div>
  );
};