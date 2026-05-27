import { RestaurantItemSkeleton } from "./restaurant-item.skeleton";

export const RestaurantListSkeleton = () => {
  return (
    <ul className="space-y-6 w-full">
      <li>
        <RestaurantItemSkeleton />
      </li>
      <li>
        <RestaurantItemSkeleton />
      </li>
      <li>
        <RestaurantItemSkeleton />
      </li>
    </ul>
  );
};
