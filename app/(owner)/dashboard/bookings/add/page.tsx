import { Button } from "@components";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { Card } from "../../_components/card";

import AddBookingContent from "./_components/add-booking-content";

export default async function AddBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
        <AddBookingContent searchParams={searchParams} />
      </Card>
    </section>
  );
}