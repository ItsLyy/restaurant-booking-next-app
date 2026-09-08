import { Breadcrumb } from "./breadcrumb";
import { UserProfile } from "./user-profile";

import type { DashboardOwner, DashboardRestaurant } from "../../dashboard/_data/dashboard";

export const Header = ({
  restaurant,
  owner,
}: {
  restaurant: DashboardRestaurant;
  owner: DashboardOwner;
}) => {
  return (
    <header className="shrink-0 pb-1 pt-6 px-4 flex justify-between items-end w-full">
      <Breadcrumb restaurantName={restaurant.name} />
      <UserProfile owner={owner} />
    </header>
  );
};