import { Avatar } from "@components";

import { formatDate } from "@utils";

export const Profile = ({
  name,
  avatar,
  date,
}: {
  name: string;
  avatar: string;
  date: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar
        src={avatar && avatar !== "/" ? avatar : "https://randomuser.me/api/portraits/lego/1.jpg"}
        alt={name}
        className="size-10 sm:size-11 rounded-full! ring-1 ring-base-200"
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-c-normal font-semibold text-foreground leading-tight truncate">
          {name}
        </span>
        <span className="text-c-caption text-muted">{formatDate(date)}</span>
      </div>
    </div>
  );
};
