import {
  CalendarCheckIcon,
  StorefrontIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import type { UserMenuLink } from "@components/general/user-menu";

export const DASHBOARD_MENU_ITEMS: Record<
  "owner" | "manager" | "staff",
  { badge: string; items: UserMenuLink[] }
> = {
  owner: {
    badge: "Owner",
    items: [
      {
        label: "My Profile",
        href: "/dashboard/profile",
        icon: UserCircleIcon,
        description: "Manage personal details",
      },
      {
        label: "My Bookings",
        href: "/bookings",
        icon: CalendarCheckIcon,
        description: "View reservation history",
      },
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: UserCircleIcon,
        description: "Open the dashboard",
      },
      {
        label: "Restaurant setting",
        href: "/dashboard/restaurant",
        icon: StorefrontIcon,
        description: "Update your restaurant",
      },
    ],
  },
  manager: {
    badge: "Manager",
    items: [
      {
        label: "My Profile",
        href: "/dashboard/profile",
        icon: UserCircleIcon,
        description: "Manage personal details",
      },
      {
        label: "My Bookings",
        href: "/bookings",
        icon: CalendarCheckIcon,
        description: "View reservation history",
      },
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: UserCircleIcon,
        description: "Open the dashboard",
      },
    ],
  },
  staff: {
    badge: "Staff",
    items: [
      {
        label: "My Profile",
        href: "/dashboard/profile",
        icon: UserCircleIcon,
        description: "Manage personal details",
      },
      {
        label: "My Bookings",
        href: "/bookings",
        icon: CalendarCheckIcon,
        description: "View reservation history",
      },
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: UserCircleIcon,
        description: "Open the dashboard",
      },
    ],
  },
};
