"use client";

import { DashboardNavFooter } from "@components";

import { NavItem } from "./nav-item";

import { getVisibleNavItems } from "../../_libs/navigation";

import type { DashboardRole } from "@libs/session";

export const Navigation = ({
  restaurantName,
  role,
}: {
  restaurantName: string;
  role: DashboardRole;
}) => {
  const items = getVisibleNavItems(role);

  return (
    <nav className="grow size-full flex flex-col justify-between p-8">
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <NavItem icon={item.icon} label={item.label} href={item.href} />
          </li>
        ))}
      </ul>
      <DashboardNavFooter restaurantName={restaurantName} />
    </nav>
  );
};