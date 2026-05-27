import { RestaurantItem } from "./restaurant-item";

import type { IRestaurantListItem } from "@types";

export const RestaurantList = ({
  restaurants,
}: {
  restaurants: IRestaurantListItem[];
}) => {
  return (
    <ul className="space-y-6 w-full">
      {restaurants.map((restaurant) => (
        <li key={restaurant.id}>
          <RestaurantItem
            name={restaurant.name}
            slug={restaurant.slug}
            image={restaurant.image}
            country={restaurant.country}
            city={restaurant.city}
            address={restaurant.address}
            minPrice={restaurant.minPrice}
            maxPrice={restaurant.maxPrice}
            discount={restaurant.discount}
            shortDescription={restaurant.shortDescription}
            rating={restaurant.rating}
          />
        </li>
      ))}
    </ul>
  );
};
