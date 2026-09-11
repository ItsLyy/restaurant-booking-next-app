import type { ComponentType } from "react";

import type { IconProps } from "@phosphor-icons/react";
import {
  CalendarCheckIcon,
  CoinsIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Card } from "../../_components/card";

import { formatPrice } from "@utils/formatPrice";

import type { BookingCounts, DetailedBooking } from "../_data/bookings";

interface Stat {
  label: string;
  value: string;
  icon: ComponentType<IconProps>;
  accent?: boolean;
}

interface BookingsSummaryProps {
  bookings: DetailedBooking[];
  counts: BookingCounts;
}

const iconChip = (accent: boolean) =>
  `size-10 shrink-0 rounded-lg flex items-center justify-center ${
    accent
      ? "bg-accent-200/10 text-accent-200"
      : "border border-muted/40 bg-base-100 text-muted"
  }`;

export const BookingsSummary = ({ bookings, counts }: BookingsSummaryProps) => {
  const guests = bookings.reduce((sum, booking) => sum + booking.party, 0);
  const revenue = bookings
    .filter(
      (booking) =>
        booking.isPaid &&
        (booking.status === "confirmed" || booking.status === "completed"),
    )
    .reduce((sum, booking) => sum + (booking.price ?? 0), 0);

  const stats: Stat[] = [
    {
      label: "Total Bookings",
      value: String(counts.total),
      icon: CalendarCheckIcon,
    },
    { label: "Total Guests", value: String(guests), icon: UsersIcon },
    { label: "Expected Revenue", value: formatPrice(revenue), icon: CoinsIcon, accent: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ label, value, icon, accent }) => {
        const Icon = icon;
        return (
          <Card
            key={label}
            className={`flex items-center gap-3 py-3 ${
              accent ? "!border-accent-200/40 !bg-accent-200/[0.04]" : ""
            }`}
          >
            <div className={iconChip(Boolean(accent))}>
              <Icon className="size-5" weight="duotone" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span
                className={`text-d-stat leading-tight truncate ${
                  accent ? "text-accent-200" : "text-foreground"
                }`}
              >
                {value}
              </span>
              <span className="text-d-caption text-muted">{label}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};