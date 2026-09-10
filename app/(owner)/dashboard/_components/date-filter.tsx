import { Button } from "@components";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import type { UrlObject } from "url";

import { shiftDate, todayString } from "../_data/dates";
import { DatePickerButton } from "./date-picker-dialog";

interface DateFilterProps {
  date: string;
  pathname: string;
  params: Record<string, string>;
}

const ARROW_BUTTON =
  "flex justify-center items-center gap-1 p-2! size-9! border-muted! text-muted!";
const TODAY_BUTTON =
  "flex justify-center items-center gap-1 py-2! px-4! h-9! w-fit! border-muted! text-muted!";

const buildHref = (
  pathname: string,
  params: Record<string, string>,
  date?: string,
): string | UrlObject => {
  const query: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value) query[key] = value;
  }
  if (date) query.date = date;

  const entries = Object.entries(query);
  if (entries.length === 0) return pathname;
  return { pathname, query };
};

export const DateFilter = ({ date, pathname, params }: DateFilterProps) => {
  const today = todayString();
  const isToday = date === today;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        as="link"
        variant="outline"
        className={ARROW_BUTTON}
        href={buildHref(pathname, params, shiftDate(date, -1))}
        scroll={false}
        aria-label="Previous day"
      >
        <ArrowLeftIcon className="size-4" />
      </Button>
      <DatePickerButton date={date} pathname={pathname} params={params} />
      <Button
        as="link"
        variant="outline"
        className={ARROW_BUTTON}
        href={buildHref(pathname, params, shiftDate(date, 1))}
        scroll={false}
        aria-label="Next day"
      >
        <ArrowRightIcon className="size-4" />
      </Button>
      <Button
        as="link"
        variant="outline"
        className={`${TODAY_BUTTON} ${
          isToday ? "border-accent-100! text-accent-100!" : ""
        }`}
        href={buildHref(pathname, params)}
        scroll={false}
        aria-current={isToday ? "date" : undefined}
      >
        Today
      </Button>
    </div>
  );
};