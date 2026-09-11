import Link from "next/link";

import {
  ArrowRightIcon,
  CalendarBlankIcon,
  UserCircleIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";

import { notFound } from "next/navigation";

import { Avatar, Badge, Button } from "@components";

import { Card } from "../card";
import { getOfficerData } from "../../_data/officer";

export const OfficerOverview = () => {
  const data = getOfficerData();
  if (!data) notFound();

  const { officer, restaurant, invitedByOwner, today } = data;
  const fullName = `${officer.firstName} ${officer.lastName}`;

  const stats = [
    {
      label: "Bookings today",
      value: today.bookings,
      icon: CalendarBlankIcon,
    },
    { label: "Active today", value: today.active, icon: UserCircleIcon },
    { label: "Guests today", value: today.guests, icon: UsersIcon },
  ];

  return (
    <section className="px-4 pt-3 pb-6 size-full flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={officer.avatar ?? ""}
            alt={fullName}
            className="size-16!"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-d-header-md text-foreground truncate">
              Welcome back, {officer.firstName}
            </span>
            <span className="text-d-caption text-muted">
              {restaurant.name} · {restaurant.city}
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge>Officer</Badge>
              <Badge variant="neutral" className="capitalize">
                {officer.position}
              </Badge>
              {invitedByOwner ? (
                <Badge variant="neutral">
                  Invited by {invitedByOwner.firstName}{" "}
                  {invitedByOwner.lastName}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="flex items-center gap-3 py-5">
            <Icon weight="duotone" className="size-9 text-accent-200" />
            <div className="flex flex-col min-w-0">
              <span className="text-d-stat text-foreground">{value}</span>
              <span className="text-d-caption text-muted">{label}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-d-header-md text-foreground">
            Update your profile
          </span>
          <span className="text-d-caption text-muted">
            Keep your name, email and dietary details up to date.
          </span>
        </div>
        <Button
          as="link"
          href="/dashboard/profile"
          className="gap-2 rounded-md! h-10! px-4!"
        >
          <span>View profile</span>
          <ArrowRightIcon className="size-4" />
        </Button>
      </Card>

      <span className="text-d-caption text-muted">
        <Link href="/" className="hover:text-foreground">
          Go back browsing
        </Link>
      </span>
    </section>
  );
};