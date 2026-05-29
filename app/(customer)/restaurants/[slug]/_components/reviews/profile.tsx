import { Avatar } from "@components";

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
    <div className="flex items-center gap-4">
      <Avatar src={avatar} alt={name} className="size-15.5" />
      <div className="flex flex-col gap-1">
        <span className="text-c-body text-foreground leading-tight">
          {name}
        </span>
        <span className="text-c-button font-normal">{date}</span>
      </div>
    </div>
  );
};
