import { Button } from "@components";

import type { TableDayInfo } from "../../_data/tables";

export const Body = ({ table }: { table: TableDayInfo }) => {
  const primary = table.bookings[0];
  const upcoming = table.bookings[1];

  return (
    <div className="p-2 flex flex-col gap-2 h-full min-h-0">
      {primary ? (
        <>
          <span className="text-d-header-table leading-tight">
            {primary.paid ? "NOW" : "UPCOMING"}
          </span>
          <div className="flex flex-col gap-1 *:leading-tight">
            <span className="text-d-body text-foreground">{primary.guest}</span>
            <span className="text-c-caption">
              {primary.time} · {primary.party} pax
            </span>
          </div>
          {upcoming && (
            <div className="border border-muted rounded-lg flex flex-col gap-2 p-2 opacity-60">
              <span className="text-d-header-table leading-tight">NEXT</span>
              <div className="flex flex-col gap-1 *:leading-tight">
                <span className="text-d-body text-foreground">
                  {upcoming.guest}
                </span>
                <span className="text-c-caption">
                  {upcoming.time} · {upcoming.party} pax
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <NoBooking />
      )}
      <div className="flex gap-1 w-full mt-auto shrink-0">
        <Button
          as="link"
          className="px-6! py-1! h-full! w-full! text-d-caption! font-normal!"
          href={`/dashboard/tables/${table.id}`}
        >
          View
        </Button>
        {primary && (
          <Button
            as="link"
            variant="outline"
            className="px-6! py-1! h-full! w-full! text-d-caption! font-normal!"
            href={`/dashboard/bookings?q=${encodeURIComponent(primary.guest)}`}
            title={`View ${primary.guest}'s bookings`}
          >
            Contact
          </Button>
        )}
      </div>
    </div>
  );
};

const NoBooking = () => (
  <div className="flex-1 min-h-0 flex justify-center items-center">
    <span className="text-muted text-caption">No booking today</span>
  </div>
);
