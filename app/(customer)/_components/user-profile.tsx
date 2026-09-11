"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheckIcon,
  CaretDownIcon,
  ShieldCheckIcon,
  SignOutIcon,
  StorefrontIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Avatar, Badge } from "@components";

interface CustomerUserProfileProps {
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    username?: string;
    avatar?: string;
  };
}

const MENU_ITEMS = [
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
    label: "Dietary Preferences",
    href: "/profile",
    icon: ShieldCheckIcon,
    description: "Allergies & restrictions",
  },
  {
    label: "Become restaurant owner",
    href: "/signup",
    icon: StorefrontIcon,
    description: "List your dining tables",
  },
];

export const CustomerUserProfile = ({
  customer,
}: CustomerUserProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

      {isOpen && (
        <div
          role="menu"
          className="rise-in absolute right-0 mt-2 w-64 border border-muted/50 rounded-2xl bg-base-100 shadow-xl p-1.5 z-30"
        >
          {/* User Identity Header Card */}
          <div className="px-3 py-2.5 mb-1 rounded-xl bg-base-200/80 border border-muted/30 flex items-center gap-3">
            <Avatar
              src={customer.avatar ?? ""}
              alt={fullName}
              className="size-10! rounded-xl!"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground truncate">
                  {fullName}
                </span>
                <Badge variant="default" className="text-[10px] px-1.5 py-0">
                  Diner
                </Badge>
              </div>
              <span className="text-[11px] text-muted truncate">
                {customer.email ?? (customer.username ? `@${customer.username}` : "")}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-0.5">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    isActive
                      ? "bg-accent-100/10 text-accent-100 font-semibold"
                      : "text-foreground hover:bg-base-200 text-muted/90 hover:text-foreground"
                  }`}
                >
                  <Icon
                    weight={isActive ? "fill" : "bold"}
                    className={`size-4 mt-0.5 shrink-0 ${
                      isActive ? "text-accent-100" : "text-muted"
                    }`}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-foreground truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-muted truncate">
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Divider & Sign Out */}
          <div className="mt-1 pt-1 border-t border-muted/30">
            <Link
              href="/"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-negative hover:bg-negative/10 font-medium transition-colors"
            >
              <SignOutIcon weight="bold" className="size-4 shrink-0" />
              <span>Log out</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};