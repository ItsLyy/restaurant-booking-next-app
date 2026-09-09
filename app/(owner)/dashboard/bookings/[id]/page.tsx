import { notFound } from "next/navigation";
import Link from "next/link";

import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { Card } from "../../_components/card";
import { BookingBadge } from "../../_components/booking-badge";
import { BookingDetailActions } from "./_components/booking-detail-actions";

import { getBookingInfo } from "../_data/bookings";

import { formatPrice } from "@utils";
import { formatDayDate, formatShortDate } from "@utils/formatDate";

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

export default async function DashboardBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = getBookingInfo(id);
  if (!booking) notFound();

  const formattedCreatedAt = booking.createdAt
    ? formatDayDate(booking.createdAt.slice(0, 10))
    : "—";

  return (
    <section className="px-4 pt-3 pb-6 size-full">
      <Card className="size-full flex flex-col gap-4">
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

        <div className="grid gap-4 lg:grid-cols-2">
          <InfoCard title="Reservation">
            <InfoRow label="Guest">{booking.guest}</InfoRow>
            <InfoRow label="Party size">{booking.party} people</InfoRow>
            <InfoRow label="Date">{formatShortDate(booking.date)}</InfoRow>
            <InfoRow label="Time">{booking.time}</InfoRow>
            <InfoRow label="Table">{booking.table}</InfoRow>
            <InfoRow label="Special request">
              {booking.specialRequest ?? (
                <span className="text-muted">None</span>
              )}
            </InfoRow>
          </InfoCard>

          <InfoCard title="Payment">
            <InfoRow label="Amount">
              {booking.price !== null ? formatPrice(booking.price) : "—"}
            </InfoRow>
            <InfoRow label="Status">
              <div className="flex justify-end">
                <BookingBadge
                  status={booking.isPaid ? "Paid" : "Unpaid"}
                  variant={booking.isPaid ? "positive" : "neutral"}
                />
              </div>
            </InfoRow>
            <InfoRow label="Payment deadline">
              {booking.paymentDeadline
                ? formatShortDate(booking.paymentDeadline.slice(0, 10))
                : "—"}
            </InfoRow>
            <InfoRow label="Requested at">{formattedCreatedAt}</InfoRow>
            <InfoRow label="Last updated">
              {booking.updatedAt
                ? formatDayDate(booking.updatedAt.slice(0, 10))
                : "—"}
            </InfoRow>
          </InfoCard>
        </div>

        {booking.cancelled && (
          <InfoCard title="Cancellation">
            <InfoRow label="Cancelled on">
              {formatDayDate(booking.cancelled.date)}
            </InfoRow>
            <InfoRow label="Cancelled by">
              {booking.cancelled.by === "user" ? "Customer" : "Restaurant"}
            </InfoRow>
            <InfoRow label="Reason">{booking.cancelled.reason}</InfoRow>
          </InfoCard>
        )}
      </Card>
    </section>
  );
}