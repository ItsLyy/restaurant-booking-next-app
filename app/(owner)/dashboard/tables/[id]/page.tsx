import { notFound } from "next/navigation";
import Link from "next/link";

import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";
import { Card } from "../../_components/card";
import { BookingBadge } from "../../_components/booking-badge";
import { DateFilter } from "../../_components/date-filter";
import { TableBadge } from "../_components/table-badge";

import { getTablesData, normalizeDate, PLACE_LABELS } from "../_data/tables";
import { TABLE_STATUS_META } from "../_components/variant-styles";

import { formatPrice } from "@utils";
import { formatShortDate } from "@utils/formatDate";

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-muted/50 last:border-b-0">
    <span className="text-d-caption text-muted shrink-0">{label}</span>
    <span className="text-d-body text-foreground text-right">{children}</span>
  </div>
);

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border border-muted rounded-lg p-4">
    <h3 className="text-d-header-md text-foreground mb-2">{title}</h3>
    {children}
  </div>
);

export default async function DashboardTableDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { date: dateParam } = await searchParams;
  const date = normalizeDate(dateParam);

  const table = getTablesData(date).tables.find((item) => item.id === id);
  if (!table) notFound();

  const meta = TABLE_STATUS_META[table.status];

  return (
    <section className="px-4 pt-3 pb-6 size-full">
      <Card className="size-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard/tables"
            className="flex items-center gap-1 text-d-caption text-muted hover:text-foreground w-fit"
          >
            <ArrowLeftIcon className="size-4" />
            Detailed Tables
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-d-header-lg text-foreground leading-tight">
              {table.name}
            </h2>
            <TableBadge status={meta.label} variant={meta.variant} />
          </div>
        </div>

        <DateFilter
          date={date}
          pathname={`/dashboard/tables/${table.id}`}
          params={{}}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <InfoCard title="Table">
            <InfoRow label="Place">{PLACE_LABELS[table.place]}</InfoRow>
            <InfoRow label="Capacity">{table.capacity} people</InfoRow>
            <InfoRow label="Floor">{table.floor}</InfoRow>
            <InfoRow label="Price">
              {formatPrice(table.price)}
            </InfoRow>
          </InfoCard>

          <InfoCard title="Day overview">
            <InfoRow label="Date">{formatShortDate(date)}</InfoRow>
            <InfoRow label="Status">
              <TableBadge status={meta.label} variant={meta.variant} />
            </InfoRow>
            <InfoRow label="Bookings">{table.bookings.length}</InfoRow>
            <InfoRow label="Guests">
              {table.bookings.reduce((sum, booking) => sum + booking.party, 0)}
            </InfoRow>
          </InfoCard>
        </div>

        <section className="flex flex-col gap-2">
          <h3 className="text-d-header-md text-foreground">
            Bookings on {formatShortDate(date)}
          </h3>
          {table.bookings.length === 0 ? (
            <p className="text-muted text-d-caption text-center py-10 border border-muted rounded-lg">
              No bookings on this day.
            </p>
          ) : (
            <div className="border border-muted rounded-lg px-4 overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    {["TIME", "GUEST", "PARTY", "PAYMENT", ""].map(
                      (header) => (
                        <th
                          key={header}
                          scope="col"
                          className="text-left text-xs font-medium whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {table.bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="text-d-body text-foreground whitespace-nowrap">
                        {booking.time}
                      </td>
                      <td className="text-d-body text-foreground whitespace-nowrap">
                        {booking.guest}
                      </td>
                      <td className="text-d-body text-foreground whitespace-nowrap">
                        {booking.party} pax
                      </td>
                      <td>
                        <BookingBadge
                          status={booking.paid ? "Paid" : "Unpaid"}
                          variant={booking.paid ? "positive" : "neutral"}
                        />
                      </td>
                      <td>
                        <Button
                          as="link"
                          variant="outline"
                          className="py-0! px-3! h-8! size-fit! border-muted! text-muted!"
                          href={`/dashboard/bookings/${booking.id}`}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Card>
    </section>
  );
}