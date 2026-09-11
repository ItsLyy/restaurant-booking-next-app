import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import {
  BookIcon,
  ChartBarIcon,
  LecternIcon,
  SquaresFourIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";

import type { DashboardRole } from "@libs/session";

export interface NavigationItem {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
  access?: DashboardRole[];
}

export const ROOT_PATH = "/dashboard";

export const NAV_ITEMS: NavigationItem[] = [
  { label: "Overview", href: ROOT_PATH, icon: SquaresFourIcon },
  { label: "Bookings", href: "/dashboard/bookings", icon: BookIcon },
  { label: "Tables", href: "/dashboard/tables", icon: LecternIcon },
  {
    label: "Staff",
    href: "/dashboard/staff",
    icon: UsersThreeIcon,
    access: ["owner", "manager"],
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartBarIcon,
    access: ["owner", "manager"],
  },
];

export const getVisibleNavItems = (role: DashboardRole): NavigationItem[] =>
  NAV_ITEMS.filter((item) => !item.access || item.access.includes(role));

export const ROUTE_TITLES: Record<string, string> = {
  ...Object.fromEntries(NAV_ITEMS.map(({ label, href }) => [href, label])),
  "/dashboard/staff/add": "Add Staff",
  "/dashboard/restaurant": "Restaurant",
  "/dashboard/profile": "Profile",
};