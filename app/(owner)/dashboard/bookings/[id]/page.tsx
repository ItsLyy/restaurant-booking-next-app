import { notFound } from "next/navigation";
import Link from "next/link";

import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { Card } from "../../_components/card";
import { BookingBadge } from "../../_components/booking-badge";
import { BookingInfo } from "../_components/booking-info";
import { BookingDetailActions } from "./_components/booking-detail-actions";
import { RealtimeDashboardBookings } from "../../_components/realtime-dashboard-bookings";

import { getBookingInfo } from "../_data/bookings";

import type { DetailStatus } from "../_data/bookings";
import type { Variant } from "../../_components/variant-styles";

const getStatusVariant = (status: DetailStatus): Variant => {
  switch (status) {
    case "pending":
      return "neutral";
    case "cancelled":
      return "negative";
    case "confirmed":
    case "completed":
      return "positive";
  }
};

export default async function DashboardBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBookingInfo(id);
  if (!booking) notFound();

  return (
    <section className="px-4 pt-3 pb-6 size-full">
      <Card className="size-full flex flex-col gap-4">
        <RealtimeDashboardBookings restaurantId="rest-001" showLiveBadge={false} />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-1 text-d-caption text-muted hover:text-foreground w-fit"
            >
              <ArrowLeftIcon className="size-4" />
              Detailed Bookings
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-d-header-lg text-foreground leading-tight">
                {booking.code}
              </h2>
              <BookingBadge
                status={booking.status}
                variant={getStatusVariant(booking.status)}
              />
            </div>
          </div>
          <BookingDetailActions
            booking={{
              id: booking.id,
              code: booking.code,
              status: booking.status,
              date: booking.date,
              time: booking.time,
              guest: booking.guest,
              party: booking.party,
              table: booking.table,
            }}
          />
        </div>

        <BookingInfo booking={booking} />
      </Card>
    </section>
  );
}