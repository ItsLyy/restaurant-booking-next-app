"use client";

import { useEffect, useRef, useState } from "react";

import {
  CalendarCheckIcon,
  CaretDownIcon,
  StorefrontIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Avatar } from "@components/general/avatar";
import { UserMenuPanel } from "@components/general/user-menu";

import type { UserMenuLink } from "@components/general/user-menu";

interface CustomerUserProfileProps {
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    username?: string;
    avatar?: string;
  };
}

const MENU_ITEMS: UserMenuLink[] = [
  {
    label: "My Profile",
    href: "/profile",
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
    label: "Become restaurant owner",
    href: "/signup",
    icon: StorefrontIcon,
    description: "List your dining tables",
  },
];

export const CustomerUserProfile = ({ customer }: CustomerUserProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fullName = `${customer.firstName} ${customer.lastName}`.trim();

  // Close dropdown on outside click or Esc key
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
      if (event.key === "Escape") {
        setIsOpen(false);
      }
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
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 border border-muted/70 rounded-full pl-1 pr-3 py-1 bg-base-100 hover:bg-base-200 hover:border-accent-200/80 transition-colors cursor-pointer shadow-2xs"
      >
        <Avatar
          src={customer.avatar ?? ""}
          alt={fullName}
          className="size-8! rounded-full!"
        />
        <span className="text-xs font-semibold text-foreground max-w-[100px] truncate">
          {customer.firstName}
        </span>
        <CaretDownIcon
          weight="bold"
          className={`size-3 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <UserMenuPanel
          items={MENU_ITEMS}
          identity={{
            name: fullName,
            avatar: customer.avatar ?? "",
            badge: "Diner",
            subtitle:
              customer.email ??
              (customer.username ? `@${customer.username}` : ""),
          }}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </div>
  );
};
