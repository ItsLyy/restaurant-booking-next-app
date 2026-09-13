import Link from "next/link";
import {
  CalendarCheckIcon,
  ForkKnifeIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Logo } from "@components/general/logo";
import { BackToTopButton } from "./back-to-top";

export const Footer = () => {
  return (
    <footer className="shrink-0 w-full border-t border-muted/40 bg-base-200/90 text-foreground">
      <div className="w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 flex flex-col gap-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Culinary Philosophy (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Logo />
              <span className="text-xl font-playfair-display font-bold tracking-tight text-foreground group-hover:text-accent-100 transition-colors">
                RES.<span className="text-accent-200">BOOK</span>
              </span>
            </Link>

            <p className="text-xs text-muted leading-relaxed max-w-sm">
              Discover and reserve tables at exceptional restaurants. Handpicked culinary destinations, real-time availability, and automated dietary safeguards.
            </p>

            {/* Culinary Trust Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-base-100 border border-muted/40 text-[11px] font-medium text-foreground">
                <ShieldCheckIcon weight="fill" className="size-3.5 text-positive" />
                <span>Allergy-Protected Dinings</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-base-100 border border-muted/40 text-[11px] font-medium text-foreground">
                <CalendarCheckIcon weight="fill" className="size-3.5 text-accent-100" />
                <span>Instant Confirmation</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation Columns (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {/* Column 1: Explore */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <ForkKnifeIcon weight="bold" className="size-3.5 text-accent-200" />
                <span>Explore</span>
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-muted">
                <li>
                  <Link href="/restaurants" className="hover:text-accent-100 transition-colors">
                    Browse Restaurants
                  </Link>
                </li>
                <li>
                  <Link href="/restaurants?search=" className="hover:text-accent-100 transition-colors">
                    Search Cuisines
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-accent-100 transition-colors">
                    Popular Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-accent-100 transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Diners */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <CalendarCheckIcon weight="bold" className="size-3.5 text-positive" />
                <span>Diner Care</span>
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-muted">
                <li>
                  <Link href="/bookings" className="hover:text-accent-100 transition-colors">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-accent-100 transition-colors">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-accent-100 transition-colors">
                    Dietary Safeguards
                  </Link>
                </li>
                <li>
                  <Link href="/signin" className="hover:text-accent-100 transition-colors">
                    Account Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: For Restaurants */}
            <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <ShieldCheckIcon weight="bold" className="size-3.5 text-accent-100" />
                <span>For Owners</span>
              </h4>
              <ul className="flex flex-col gap-2 text-xs text-muted">
                <li>
                  <Link href="/signup" className="hover:text-accent-100 transition-colors">
                    Partner With Us
                  </Link>
                </li>
                <li>
                  <Link href="/signin" className="hover:text-accent-100 transition-colors">
                    Owner Portal
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent-100 transition-colors">
                    Table Management
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-6 border-t border-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span>&copy; 2026 RES.BOOK. All rights reserved.</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <Link href="/" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/" className="hover:text-foreground transition-colors">
              Security
            </Link>
          </div>

          <BackToTopButton />
        </div>
      </div>
    </footer>
  );
};

