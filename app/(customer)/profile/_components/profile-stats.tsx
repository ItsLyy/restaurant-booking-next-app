import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarBlankIcon,
  CalendarCheckIcon,
  ForkKnifeIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { formatDate } from "@utils";
import type { CustomerProfileStats } from "../_data/profile";

interface ProfileStatsProps {
  stats: CustomerProfileStats;
  memberSince?: string;
}

export const ProfileStats = ({ stats, memberSince }: ProfileStatsProps) => {
  const formattedMemberDate = memberSince ? formatDate(memberSince) : "Member";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Stat 1: Total Reservations */}
      <Link
        href="/bookings"
        className="group relative overflow-hidden rounded-2xl border border-muted/50 bg-base-200/80 p-4 transition-colors hover:bg-base-200 hover:border-accent-200/60 shadow-xs flex flex-col justify-between gap-3"
      >
        <div className="flex items-center justify-between">
          <span className="size-8 rounded-xl bg-accent-100/10 text-accent-100 flex items-center justify-center">
            <ForkKnifeIcon weight="fill" className="size-4" />
          </span>
          <span className="text-[11px] font-medium text-muted flex items-center gap-0.5 group-hover:text-accent-100 transition-colors">
            <span>View all</span>
            <ArrowRightIcon weight="bold" className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
        <div>
          <span className="block text-2xl font-semibold text-foreground">
            {stats.totalBookings}
          </span>
          <span className="text-xs text-muted">Total Reservations</span>
        </div>
      </Link>

      {/* Stat 2: Upcoming Dinings */}
      <Link
        href="/bookings"
        className="group relative overflow-hidden rounded-2xl border border-muted/50 bg-base-200/80 p-4 transition-colors hover:bg-base-200 hover:border-accent-200/60 shadow-xs flex flex-col justify-between gap-3"
      >
        <div className="flex items-center justify-between">
          <span className="size-8 rounded-xl bg-positive/10 text-positive flex items-center justify-center">
            <CalendarCheckIcon weight="fill" className="size-4" />
          </span>
          {stats.upcomingBookings > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-positive/10 text-positive text-[10px] font-semibold">
              Active
            </span>
          )}
        </div>
        <div>
          <span className="block text-2xl font-semibold text-foreground">
            {stats.upcomingBookings}
          </span>
          <span className="text-xs text-muted">Upcoming Bookings</span>
        </div>
      </Link>

      {/* Stat 3: Dietary Safeguards */}
      <div className="relative overflow-hidden rounded-2xl border border-muted/50 bg-base-200/80 p-4 shadow-xs flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="size-8 rounded-xl bg-accent-200/10 text-accent-200 flex items-center justify-center">
            <ShieldCheckIcon weight="fill" className="size-4" />
          </span>
          <span className="text-[10px] font-medium text-muted">
            Safety
          </span>
        </div>
        <div>
          <span className="block text-2xl font-semibold text-foreground">
            {stats.allergiesCount > 0 ? `${stats.allergiesCount} Active` : "None"}
          </span>
          <span className="text-xs text-muted">Dietary Safeguards</span>
        </div>
      </div>

      {/* Stat 4: Member Since */}
      <div className="relative overflow-hidden rounded-2xl border border-muted/50 bg-base-200/80 p-4 shadow-xs flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="size-8 rounded-xl bg-muted/15 text-muted flex items-center justify-center">
            <CalendarBlankIcon weight="fill" className="size-4" />
          </span>
          <span className="text-[10px] font-medium text-muted">Diner</span>
        </div>
        <div>
          <span className="block text-sm font-semibold text-foreground truncate">
            {formattedMemberDate}
          </span>
          <span className="text-xs text-muted">Member Since</span>
        </div>
      </div>
    </div>
  );
};
