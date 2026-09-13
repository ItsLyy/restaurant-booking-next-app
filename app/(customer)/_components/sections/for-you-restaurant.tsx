import { Suspense } from "react";

import RestaurantGrid from "../restaurant/restaurant-grid";
import RestaurantGridSkeleton from "../restaurant/restaurant-grid.skeleton";

import { getForYouRestaurants } from "@data/restaurants/get-home-restaurants";

const ForYouRestaurants = async () => {
  const restaurants = await getForYouRestaurants();
  return <RestaurantGrid restaurants={restaurants} />;
};

export const ForYouRestaurantSection = () => {
  return (
    <section className="space-y-2 p-2">
      <h2 className="text-c-header-md text-foreground">For You Restaurant</h2>
      <Suspense fallback={<RestaurantGridSkeleton />}>
        <ForYouRestaurants />
      </Suspense>
    </section>
  );
};