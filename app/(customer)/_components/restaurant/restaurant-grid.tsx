import RestaurantCard from "./restaurant-card";

import type { IRestaurantListItem } from "@types";

interface RestaurantGridProps {
  restaurants: IRestaurantListItem[];
}

const RestaurantGrid = ({ restaurants }: RestaurantGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          slug={restaurant.slug}
          name={restaurant.name}
          image={restaurant.image}
          rating={restaurant.rating}
          minPrice={restaurant.minPrice}
          maxPrice={restaurant.maxPrice}
        />
      ))}
    </div>
  );
};

export default RestaurantGrid;