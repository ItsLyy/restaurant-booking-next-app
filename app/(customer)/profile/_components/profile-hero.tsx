import {
  CheckCircleIcon,
  PencilSimpleIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar, Badge } from "@components";
import type { IUser } from "@types";

interface ProfileHeroProps {
  user: IUser;
  onEditClick: () => void;
}

export const ProfileHero = ({ user, onEditClick }: ProfileHeroProps) => {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-muted/60 bg-gradient-to-br from-base-200 via-base-200 to-accent-200/10 p-6 sm:p-8 shadow-xs">
      {/* Decorative ambient background accents */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent-200/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 size-48 rounded-full bg-accent-100/5 blur-2xl" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar frame */}
          <div className="relative group">
            <div className="size-20 sm:size-24 rounded-2xl overflow-hidden bg-base-100 border-2 border-accent-200/40 shadow-sm flex items-center justify-center">
              {user.avatar ? (
                <Avatar
                  src={user.avatar}
                  alt={fullName}
                  className="size-full rounded-2xl!"
                />
              ) : (
                <span className="text-2xl font-semibold text-accent-100">
                  {initials || <UserIcon className="size-10 text-muted" />}
                </span>
              )}
            </div>
            {user.emailVerifyAt && (
              <span
                title="Verified Account"
                className="absolute -bottom-1 -right-1 size-6 rounded-full bg-positive text-base-100 flex items-center justify-center ring-2 ring-base-100 shadow-xs"
              >
                <CheckCircleIcon weight="fill" className="size-4" />
              </span>
            )}
          </div>

          {/* Name, handle, and badges */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-playfair-display font-semibold text-foreground tracking-tight">
                {fullName}
              </h1>
              <Badge variant="default" className="text-[11px] font-medium">
                Diner
              </Badge>
              {user.emailVerifyAt ? (
                <Badge variant="positive" className="text-[11px] font-medium flex items-center gap-1">
                  <ShieldCheckIcon weight="fill" className="size-3" />
                  <span>Verified</span>
                </Badge>
              ) : null}
            </div>

            <p className="text-xs sm:text-sm text-muted">
              @{user.username} · {user.email}
            </p>

            <p className="text-xs text-muted/80">
              Personalized dining preferences & reservation history
            </p>
          </div>
        </div>

        {/* Action button to switch to edit */}
        <button
          type="button"
          onClick={onEditClick}
          className="self-stretch sm:self-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-muted/80 bg-base-100/80 hover:bg-base-100 text-foreground text-xs font-semibold shadow-xs hover:border-accent-200 hover:text-accent-100 transition-colors cursor-pointer"
        >
          <PencilSimpleIcon weight="bold" className="size-3.5 text-accent-200" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
};
