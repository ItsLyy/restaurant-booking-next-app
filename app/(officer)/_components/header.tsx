"use client";

import { usePathname } from "next/navigation";

import { OfficerUserProfile } from "./user-profile";

import { OFFICER_ROUTE_TITLES } from "../_libs/navigation";

import type { IOfficer } from "@types";

const toTitleCase = (segment: string) =>
  segment.charAt(0).toUpperCase() + segment.slice(1);

export const OfficerHeader = ({
  officer,
  restaurantName,
}: {
  officer: IOfficer;
  restaurantName: string;
}) => {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean).at(-1);
  const title =
    OFFICER_ROUTE_TITLES[pathname] ??
    (segment ? toTitleCase(segment) : "Overview");

  return (
    <header className="shrink-0 pb-1 pt-6 px-4 flex justify-between items-end w-full min-w-0">
      <div className="flex flex-col min-w-0">
        <span className="text-foreground text-d-caption truncate">
          {restaurantName} / <span className="text-muted">{title}</span>
        </span>
        <h1 className="text-d-header-lg text-foreground leading-tight truncate">
          {title}
        </h1>
      </div>
      <OfficerUserProfile officer={officer} />
    </header>
  );
};