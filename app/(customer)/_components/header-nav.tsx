"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheckIcon,
  CompassIcon,
  HouseIcon,
  ListIcon,
  MagnifyingGlassIcon,
  StorefrontIcon,
  UserCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";
import { CustomerUserProfile } from "./user-profile";

interface HeaderNavProps {
  hasDashboardAccess?: boolean;
  customer?: {
    firstName: string;
    lastName: string;
    email?: string;
    username?: string;
    avatar?: string;
  };
}

export const HeaderNav = ({
  hasDashboardAccess,
  customer,
}: HeaderNavProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Close mobile drawer on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isRestaurantsActive = pathname.startsWith("/restaurants");
  const isBookingsActive = pathname.startsWith("/bookings");

  return (
    <>
      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-1">
        <Link
          href="/restaurants"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-colors ${
            isRestaurantsActive
              ? "bg-accent-100/10 text-accent-100 font-semibold"
              : "text-muted hover:text-foreground hover:bg-base-200/60 font-medium"
          }`}
        >
          <CompassIcon weight={isRestaurantsActive ? "fill" : "bold"} className="size-4" />
          <span>Restaurants</span>
        </Link>

        <Link
          href="/bookings"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-colors ${
            isBookingsActive
              ? "bg-accent-100/10 text-accent-100 font-semibold"
              : "text-muted hover:text-foreground hover:bg-base-200/60 font-medium"
          }`}
        >
          <CalendarCheckIcon weight={isBookingsActive ? "fill" : "bold"} className="size-4" />
          <span>Bookings</span>
        </Link>
      </div>

      {/* Right Controls: Search, User Menu, Mobile Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Desktop Search Trigger Pill */}
        <Link
          href="/restaurants?search="
          className="hidden sm:flex items-center justify-between gap-2 px-3.5 h-9 rounded-full border border-muted/60 bg-base-200/60 hover:bg-base-200 hover:border-accent-200/80 text-xs text-muted transition-colors w-44 lg:w-56"
        >
          <div className="flex items-center gap-2 truncate">
            <MagnifyingGlassIcon weight="bold" className="size-3.5 text-accent-200 shrink-0" />
            <span className="truncate">Search restaurants…</span>
          </div>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-muted/80 bg-base-100 border border-muted/40 rounded-md">
            /
          </kbd>
        </Link>

        {/* Mobile Search Icon Button */}
        <Link
          href="/restaurants?search="
          aria-label="Search restaurants"
          className="sm:hidden size-9 rounded-full border border-muted/60 bg-base-100 flex items-center justify-center text-muted hover:text-foreground hover:border-accent-200 transition-colors"
        >
          <MagnifyingGlassIcon weight="bold" className="size-4" />
        </Link>

        {/* User Account / Sign In */}
        {customer ? (
          <CustomerUserProfile customer={customer} />
        ) : hasDashboardAccess ? (
          <Button
            as="link"
            href="/dashboard"
            className="rounded-full! h-9! px-4! text-xs!"
          >
            Dashboard
          </Button>
        ) : (
          <Button
            as="link"
            href="/signin"
            className="rounded-full! h-9! px-4! text-xs!"
          >
            Sign in
          </Button>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="md:hidden size-9 rounded-full border border-muted/60 bg-base-100 flex items-center justify-center text-foreground hover:bg-base-200 transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? (
            <XIcon weight="bold" className="size-4" />
          ) : (
            <ListIcon weight="bold" className="size-4" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="rise-in md:hidden absolute top-full left-0 w-full bg-base-100/98 backdrop-blur-lg border-b border-muted/40 shadow-xl px-4 py-4 z-40 flex flex-col gap-3">
          {/* Mobile Search Input */}
          <Link
            href="/restaurants?search="
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3.5 h-10 rounded-xl border border-muted/60 bg-base-200/60 text-xs text-muted"
          >
            <MagnifyingGlassIcon weight="bold" className="size-4 text-accent-200" />
            <span>Search restaurants, cuisines, cities…</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1 border-t border-muted/30 pt-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-foreground hover:bg-base-200 transition-colors"
            >
              <HouseIcon weight="bold" className="size-4 text-muted" />
              <span>Home</span>
            </Link>

            <Link
              href="/restaurants"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ${
                isRestaurantsActive
                  ? "bg-accent-100/10 text-accent-100 font-semibold"
                  : "text-foreground hover:bg-base-200 font-medium"
              }`}
            >
              <CompassIcon weight={isRestaurantsActive ? "fill" : "bold"} className="size-4 text-accent-200" />
              <span>Explore Restaurants</span>
            </Link>

            <Link
              href="/bookings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors ${
                isBookingsActive
                  ? "bg-accent-100/10 text-accent-100 font-semibold"
                  : "text-foreground hover:bg-base-200 font-medium"
              }`}
            >
              <CalendarCheckIcon weight={isBookingsActive ? "fill" : "bold"} className="size-4 text-positive" />
              <span>My Bookings</span>
            </Link>

            {customer ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-foreground hover:bg-base-200 transition-colors"
              >
                <UserCircleIcon weight="bold" className="size-4 text-accent-100" />
                <span>My Profile & Preferences</span>
              </Link>
            ) : null}

            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-muted hover:text-foreground hover:bg-base-200 transition-colors"
            >
              <StorefrontIcon weight="bold" className="size-4 text-muted" />
              <span>Become Restaurant Owner</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
