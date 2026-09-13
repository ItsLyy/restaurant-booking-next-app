import { Avatar, Badge } from "@components";

interface UserProfileProps {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userName: string;
  avatar?: string;
  eligible?: boolean;
  reason?: string;
}

export const UserProfile = ({
  userId,
  userFirstName,
  userLastName,
  userName,
  avatar,
  eligible = true,
  reason,
}: UserProfileProps) => {
  const fullName = `${userFirstName} ${userLastName}`.trim();

  return (
    <label
      htmlFor={`user-check-${userId}`}
      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 ${
        eligible
          ? "cursor-pointer border-transparent hover:bg-base-200 has-checked:bg-accent-100/10 has-checked:border-accent-200/50"
          : "cursor-not-allowed opacity-50 bg-base-200/40 border-transparent"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <input
          id={`user-check-${userId}`}
          name="user-choice"
          value={userId}
          type="radio"
          disabled={!eligible}
          required={eligible}
          className="size-4 text-accent-200 focus:ring-accent-200"
        />
        <Avatar
          src={avatar ?? ""}
          alt={fullName}
          className="size-10! rounded-full! shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <span className="text-foreground text-d-body font-medium truncate">
            {fullName}
          </span>
          <span className="text-d-caption text-muted truncate">@{userName}</span>
        </div>
      </div>

      {!eligible && reason ? (
        <Badge variant="neutral" className="shrink-0 text-xs">
          {reason}
        </Badge>
      ) : null}
    </label>
  );
};
