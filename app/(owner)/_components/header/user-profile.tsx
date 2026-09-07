import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";

import { Avatar } from "@components/index";

export const UserProfile = () => {
  return (
    <div className="py-4 flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-foreground text-d-caption">John Cena</span>
        <span className="text-muted text-d-caption">Owner</span>
      </div>
      <div className="flex items-center gap-2 ">
        <Avatar
          src="/"
          alt="User Profile"
          className="size-13 rounded-full!"
        />
        <CaretDownIcon className="size-4 text-foreground" />
      </div>
    </div>
  );
};
