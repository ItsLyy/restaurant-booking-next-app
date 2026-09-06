import { Suspense } from "react";

import RestaurantGrid from "../restaurant/restaurant-grid";
import RestaurantGridSkeleton from "../restaurant/restaurant-grid.skeleton";

import { getPopularRestaurants } from "@data/restaurants/get-home-restaurants";

const PopularRestaurants = async () => {
  const restaurants = await getPopularRestaurants();
  return <RestaurantGrid restaurants={restaurants} />;
};

export const PopularRestaurantSection = () => {
  return (
    <section className="space-y-2 p-2">
      <h2 className="text-c-header-md text-foreground">Popular Restaurant</h2>
      <Suspense fallback={<RestaurantGridSkeleton />}>
        <PopularRestaurants />
      </Suspense>
    </section>
  );
};