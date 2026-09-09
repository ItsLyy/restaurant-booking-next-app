import { Button } from "@components";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { Card } from "../../_components/card";

import { normalizeDate } from "../_data/bookings";
import { ManualBookingForm } from "./_components/manual-booking-form";

import rawUsers from "@data/dummy/users.json";
import tables from "@data/dummy/tables.json";

const restaurantTables = tables.flatMap((table) =>
  table.restaurantId === "rest-001"
    ? [{ id: table.id, name: table.name, capacity: table.capacity }]
    : [],
);

const customers = (
  rawUsers as Array<{ id: string; firstName: string; lastName: string }>
).flatMap((user) =>
  user.id.startsWith("user-")
    ? [
        {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
        },
      ]
    : [],
);

export default async function AddBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date } = await searchParams;
  const defaultDate = normalizeDate(date);

  return (
    <section className="px-4 pt-3 pb-6 size-full">
      <Card className="size-full flex flex-col gap-6">
        <header className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-d-header-md text-foreground">
              Add Manual Booking
            </h2>
            <span className="text-d-caption">
              Create a confirmed reservation on behalf of a guest
            </span>
          </div>
          <Button
            as="link"
            variant="outline"
            className="flex justify-center items-center gap-1 py-0! px-3! w-fit! h-9! border-muted! text-muted!"
            href="/dashboard/bookings"
          >
            <ArrowLeftIcon className="size-4" />
            <span>Back</span>
          </Button>
        </header>
        <ManualBookingForm
          defaultDate={defaultDate}
          tables={restaurantTables}
          customers={customers}
        />
      </Card>
    </section>
  );
}