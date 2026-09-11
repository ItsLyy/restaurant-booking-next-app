"use client";

import { useEffect, useRef, useState } from "react";

import {
  ArrowsLeftRightIcon,
  CalendarCheckIcon,
  CaretDownIcon,
  StorefrontIcon,
  UserCircleIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Avatar } from "@components/general/avatar";
import { UserMenuPanel } from "@components/general/user-menu";

import { switchDashboardRoleAction } from "../../_actions/switch-role";

import type {
  UserMenuAction,
  UserMenuLink,
} from "@components/general/user-menu";
import type { DashboardRole } from "@libs/session";

export interface DashboardUser {
  name: string;
  avatar: string;
  email: string;
  role: DashboardRole;
  position?: string;
}

const OWNER_MENU_ITEMS: UserMenuLink[] = [
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: UserCircleIcon,
    description: "Manage personal details",
  },
  {
    label: "Restaurant setting",
    href: "/dashboard/restaurant",
    icon: StorefrontIcon,
    description: "Update your restaurant",
  },
  {
    label: "Staff",
    href: "/dashboard/staff",
    icon: UsersThreeIcon,
    description: "Hire and manage staff",
  },
  {
    label: "My Booking",
    href: "/bookings",
    icon: CalendarCheckIcon,
    description: "View your reservations",
  },
];

const OFFICER_MENU_ITEMS: UserMenuLink[] = [
  {
    label: "My Profile",
    href: "/dashboard/profile",
    icon: UserCircleIcon,
    description: "Manage personal details",
  },
  {
    label: "My Booking",
    href: "/bookings",
    icon: CalendarCheckIcon,
    description: "View your reservations",
  },
];

export const UserProfile = ({ user }: { user: DashboardUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isOwner = user.role === "owner";
  const menuItems = isOwner ? OWNER_MENU_ITEMS : OFFICER_MENU_ITEMS;
  const actions: UserMenuAction[] = [
    {
      label: isOwner ? "View as Officer" : "View as Owner",
      icon: ArrowsLeftRightIcon,
      onClick: () =>
        switchDashboardRoleAction(isOwner ? "officer" : "owner"),
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, {
      passive: true,
    });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="py-4 relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-4 cursor-pointer"
      >
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-foreground text-d-caption">{user.name}</span>
          <span className="text-muted text-d-caption">
            {isOwner ? "Owner" : `Officer · ${user.position ?? "staff"}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar
            src={user.avatar}
            alt="User Profile"
            className="size-13 rounded-full!"
          />
          <CaretDownIcon
            className={`size-4 text-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen ? (
        <UserMenuPanel
          items={menuItems}
          actions={actions}
          identity={{
            name: user.name,
            avatar: user.avatar,
            badge: isOwner ? "Owner" : "Officer",
            subtitle: isOwner ? "Restaurant owner" : user.email,
          }}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </div>
  );
};