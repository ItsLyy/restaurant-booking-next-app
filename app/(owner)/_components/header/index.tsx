import { Breadcrumb } from "./breadcrumb";
import { UserProfile } from "./user-profile";

export const Header = () => {
  return (
    <header className="shrink-0 pb-1 pt-6 px-4 flex justify-between items-end w-full">
      <Breadcrumb />
      <UserProfile />
    </header>
  );
};
