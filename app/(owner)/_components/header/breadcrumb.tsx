"use client";

import { usePathname } from "next/navigation";

import { ROUTE_TITLES } from "../../_libs/navigation";

const toTitleCase = (segment: string) =>
  segment.charAt(0).toUpperCase() + segment.slice(1);

export const Breadcrumb = ({ restaurantName }: { restaurantName: string }) => {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean).at(-1);
  const title =
    ROUTE_TITLES[pathname] ?? (segment ? toTitleCase(segment) : "Overview");

  return (
    <div className="flex flex-col">
      <span className="text-foreground text-d-caption">
        {restaurantName} / <span className="text-muted">{title}</span>
      </span>
      <h1 className="text-d-header-lg text-foreground leading-tight">
        {title}
      </h1>
    </div>
  );
};