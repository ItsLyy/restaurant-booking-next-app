import { RestaurantCardSkeleton } from "./restaurant-card.skeleton";

const RestaurantGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <RestaurantCardSkeleton />
      <RestaurantCardSkeleton />
      <RestaurantCardSkeleton />
    </div>
  );
};

export default RestaurantGrid;
