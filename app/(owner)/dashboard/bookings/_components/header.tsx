import { Button } from "@components";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

import { formatDayDate } from "@utils";
import { todayString } from "../../_data/dates";

export const Header = ({
  date,
  canManage,
}: {
  date: string;
  canManage: boolean;
}) => {
  const isToday = date === todayString();

  return (
    <header className="w-full flex justify-between">
      <div className="flex flex-col">
        <h2 className="text-d-header-md text-foreground">Detailed Bookings</h2>
        <span className="text-d-caption">
          {formatDayDate(date)}
          {isToday ? " · today" : ""}
        </span>
      </div>
      {canManage ? (
        <Button
          as="link"
          variant="outline"
          className="flex justify-center items-center gap-1 py-0! px-3! w-fit! h-9! border-accent-200! text-accent-200!"
          href={`/dashboard/bookings/add?date=${date}`}
        >
          <PlusIcon className="size-4" />
          <span>Add Manual Book</span>
        </Button>
      ) : null}
    </header>
  );
};