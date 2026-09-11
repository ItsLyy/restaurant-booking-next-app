import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import {
  BookIcon,
  ChartBarIcon,
  LecternIcon,
  SquaresFourIcon,
  StorefrontIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

export interface NavigationItem {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
}

export const ROOT_PATH = "/dashboard";

export const NAV_ITEMS: NavigationItem[] = [
  { label: "Overview", href: ROOT_PATH, icon: SquaresFourIcon },
  { label: "Bookings", href: "/dashboard/bookings", icon: BookIcon },
  { label: "Tables", href: "/dashboard/tables", icon: LecternIcon },
  { label: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { label: "Restaurant", href: "/dashboard/restaurant", icon: StorefrontIcon },
  { label: "Profile", href: "/dashboard/profile", icon: UserCircleIcon },
];

export const ROUTE_TITLES: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map(({ label, href }) => [href, label]),
);