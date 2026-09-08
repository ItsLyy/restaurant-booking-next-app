import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import {
  HandDepositIcon,
  MoneyWavyIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Card } from "../card";

import { formatPrice } from "@utils/formatPrice";

import type { DashboardBooking } from "../../_data/dashboard";

interface Stat {
  label: string;
  value: string;
  icon: ComponentType<IconProps>;
  className: string;
}

export const QuickInformation = ({
  bookings,
}: {
  bookings: DashboardBooking[];
}) => {
  const totalBooking = bookings.length;
  const pending = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const stats: Stat[] = [
    {
      label: "Total Booking",
      value: String(totalBooking),
      icon: UsersIcon,
      className: "w-50 shrink-0",
    },
    {
      label: "Pending Confirmation",
      value: String(pending),
      icon: HandDepositIcon,
      className: "w-50 shrink-0",
    },
    {
      label: "Revenue Today",
      value: formatPrice(200000),
      icon: MoneyWavyIcon,
      className: "w-full",
    },
  ];

  return (
    <div className="flex gap-4 w-full h-30 shrink-0">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className={`${stat.className} flex flex-col justify-between`}
          >
            <Icon className="size-5" weight="duotone" />
            <div className="flex flex-col gap-1">
              <span className="text-d-header-card leading-tight">
                {stat.label}
              </span>
              <span className="text-d-stat leading-tight">{stat.value}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};