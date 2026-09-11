import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import {
  BookIcon,
  SquaresFourIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

export interface OfficerNavigationItem {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
}

export const OFFICER_ROOT_PATH = "/officer";

export const OFFICER_NAV_ITEMS: OfficerNavigationItem[] = [
  { label: "Overview", href: OFFICER_ROOT_PATH, icon: SquaresFourIcon },
  { label: "Bookings", href: "/officer/bookings", icon: BookIcon },
  { label: "Profile", href: "/officer/profile", icon: UserCircleIcon },
];

export const OFFICER_ROUTE_TITLES: Record<string, string> =
  Object.fromEntries(
    OFFICER_NAV_ITEMS.map(({ label, href }) => [href, label]),
  );