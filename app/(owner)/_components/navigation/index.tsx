"use client";

import { DashboardNavFooter } from "@components";

import { NavItem } from "./nav-item";

import { NAV_ITEMS } from "../../_libs/navigation";

export const Navigation = ({
  restaurantName,
}: {
  restaurantName: string;
}) => {
  return (
    <nav className="grow size-full flex flex-col justify-between p-8">
      <ul className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <NavItem icon={item.icon} label={item.label} href={item.href} />
          </li>
        ))}
      </ul>
      <DashboardNavFooter restaurantName={restaurantName} />
    </nav>
  );
};