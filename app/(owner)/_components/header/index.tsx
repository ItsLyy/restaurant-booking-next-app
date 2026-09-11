import { Breadcrumb } from "./breadcrumb";
import { UserProfile } from "./user-profile";

import type { DashboardUser } from "./user-profile";

export const Header = ({
  restaurantName,
  user,
}: {
  restaurantName: string;
  user: DashboardUser;
}) => {
  return (
    <header className="shrink-0 pb-1 pt-6 px-4 flex justify-between items-end w-full min-w-0">
      <Breadcrumb restaurantName={restaurantName} />
      <UserProfile user={user} />
    </header>
  );
};