import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  CheckCircleIcon,
  CookieIcon,
  EggIcon,
  EnvelopeSimpleIcon,
  FishIcon,
  ForkKnifeIcon,
  GrainsIcon,
  PencilSimpleIcon,
  PlantIcon,
  ShieldCheckIcon,
  ShrimpIcon,
  UserIcon,
  UsersIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Badge } from "@components";
import { formatDate, formatDayDate, formatTime } from "@utils";
import type { IUser } from "@types";
import type { CustomerRecentBooking } from "../_data/profile";

interface ProfileOverviewProps {
  user: IUser;
  recentBookings: CustomerRecentBooking[];
  onEditClick: () => void;
}

const ALLERGY_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string; weight?: "bold" | "fill" | "regular" }> }
> = {
  dairy: { label: "Dairy", icon: EggIcon },
  gluten: { label: "Gluten", icon: GrainsIcon },
  nuts: { label: "Tree Nuts", icon: CookieIcon },
  peanuts: { label: "Peanuts", icon: PlantIcon },
  seafood: { label: "Seafood", icon: FishIcon },
  shellfish: { label: "Shellfish", icon: ShrimpIcon },
};

export const ProfileOverview = ({
  user,
  recentBookings,
  onEditClick,
}: ProfileOverviewProps) => {
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* 1. Personal Information Card */}
      <div className="rounded-3xl border border-muted/50 bg-base-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-muted/30">
            <div className="flex items-center gap-2">
              <span className="size-8 rounded-xl bg-accent-100/10 text-accent-100 flex items-center justify-center">
                <UserIcon weight="bold" className="size-4" />
              </span>
              <h3 className="text-base font-semibold text-foreground">
                Personal Information
              </h3>
            </div>
            <button
              type="button"
              onClick={onEditClick}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent-100 hover:text-accent-200 transition-colors cursor-pointer"
            >
              <PencilSimpleIcon weight="bold" className="size-3.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 py-1.5 border-b border-muted/20">
              <span className="text-xs text-muted">Full Name</span>
              <span className="font-medium text-foreground text-right">
                {fullName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 py-1.5 border-b border-muted/20">
              <span className="text-xs text-muted">Username</span>
              <span className="font-medium text-foreground text-right">
                @{user.username}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 py-1.5 border-b border-muted/20">
              <span className="text-xs text-muted flex items-center gap-1.5">
                <EnvelopeSimpleIcon className="size-3.5" />
                <span>Email</span>
              </span>
              <span className="font-medium text-foreground text-right truncate max-w-[200px]">
                {user.email}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 py-1.5 border-b border-muted/20">
              <span className="text-xs text-muted">Email Verification</span>
              <span className="text-right">
                <Badge
                  variant={user.emailVerifyAt ? "positive" : "neutral"}
                  className="text-[11px]"
                >
                  {user.emailVerifyAt ? "Verified" : "Unverified"}
                </Badge>
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 py-1.5">
              <span className="text-xs text-muted">Account Role</span>
              <span className="font-medium text-foreground capitalize text-right">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dietary & Allergy Safeguards Card */}
      <div className="rounded-3xl border border-muted/50 bg-base-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-muted/30">
            <div className="flex items-center gap-2">
              <span className="size-8 rounded-xl bg-accent-200/10 text-accent-200 flex items-center justify-center">
                <ShieldCheckIcon weight="bold" className="size-4" />
              </span>
              <h3 className="text-base font-semibold text-foreground">
                Dietary & Allergies
              </h3>
            </div>
            <button
              type="button"
              onClick={onEditClick}
              className="inline-flex items-center gap-1 text-xs font-medium text-accent-100 hover:text-accent-200 transition-colors cursor-pointer"
            >
              <PencilSimpleIcon weight="bold" className="size-3.5" />
              <span>Update</span>
            </button>
          </div>

          {/* Safety Notice Banner */}
          <div className="p-3 rounded-2xl bg-base-100/80 border border-muted/40 mb-4 flex items-start gap-2.5">
            <ShieldCheckIcon
              weight="fill"
              className="size-4 text-accent-200 shrink-0 mt-0.5"
            />
            <p className="text-xs text-muted leading-relaxed">
              These restrictions are automatically shared with host restaurants
              upon reservation to keep your dining safe.
            </p>
          </div>

          {/* Allergy Pills */}
          {user.allergics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.allergics.map((allergy) => {
                const meta = ALLERGY_META[allergy];
                const Icon = meta?.icon ?? ForkKnifeIcon;
                const label = meta?.label ?? allergy;

                return (
                  <span
                    key={allergy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accent-200/40 bg-accent-200/10 text-accent-100 text-xs font-semibold shadow-2xs"
                  >
                    <Icon weight="bold" className="size-3.5" />
                    <span className="capitalize">{label}</span>
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 px-2 rounded-xl bg-base-100/50 border border-dashed border-muted/40">
              <p className="text-xs text-muted mb-2">
                No food allergies or restrictions recorded.
              </p>
              <button
                type="button"
                onClick={onEditClick}
                className="text-xs text-accent-100 font-semibold hover:underline cursor-pointer"
              >
                + Add dietary preferences
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Recent Dining Activity Card */}
      <div className="md:col-span-2 rounded-3xl border border-muted/50 bg-base-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-muted/30">
            <div className="flex items-center gap-2">
              <span className="size-8 rounded-xl bg-positive/10 text-positive flex items-center justify-center">
                <CalendarCheckIcon weight="bold" className="size-4" />
              </span>
              <h3 className="text-base font-semibold text-foreground">
                Recent Dining Activity
              </h3>
            </div>
            <Link
              href="/bookings"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent-100 hover:text-accent-200 transition-colors"
            >
              <span>View all bookings</span>
              <ArrowRightIcon weight="bold" className="size-3" />
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {recentBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/bookings/${b.id}`}
                  className="group block p-3.5 rounded-2xl border border-muted/40 bg-base-100/80 hover:bg-base-100 hover:border-accent-200/60 transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-foreground truncate group-hover:text-accent-100 transition-colors">
                      {b.restaurantName}
                    </span>
                    <Badge
                      variant={
                        b.status === "confirmed"
                          ? "positive"
                          : b.status === "cancelled"
                            ? "neutral"
                            : "default"
                      }
                      className="text-[10px] capitalize px-2 py-0"
                    >
                      {b.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted mb-2">
                    {formatDayDate(b.date)} · {formatTime(b.time)}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-muted border-t border-muted/20 pt-2">
                    <span className="font-mono text-[11px] text-muted">
                      {b.bookingCode}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <UsersIcon className="size-3" />
                      <span>{b.partySize} guests</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-muted mb-2">
                No recent reservations found.
              </p>
              <Link
                href="/restaurants"
                className="text-xs text-accent-100 font-semibold hover:underline"
              >
                Browse restaurants to book a table →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 4. Account Security & Verification Card */}
      <div className="md:col-span-2 rounded-3xl border border-muted/50 bg-base-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <span className="size-10 rounded-2xl bg-base-100 border border-muted/50 text-positive flex items-center justify-center shrink-0">
              <CheckCircleIcon weight="fill" className="size-5" />
            </span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Account Security & Status
              </h4>
              <p className="text-xs text-muted">
                {user.emailVerifyAt
                  ? `Email verified on ${formatDate(user.emailVerifyAt)}`
                  : "Email address pending verification"}
                {user.createdAt ? ` · Member since ${formatDate(user.createdAt)}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-muted/70 bg-base-100 hover:bg-base-200 text-xs font-medium text-foreground transition-colors"
            >
              <span>Restaurant Owner Portal</span>
              <ArrowRightIcon weight="bold" className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
