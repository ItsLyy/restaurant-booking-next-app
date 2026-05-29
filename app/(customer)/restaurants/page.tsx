import { Suspense } from "react";

import { Searchbar } from "./_components/searchbar";
import { Filter } from "./_components/filter";

import { RestaurantList } from "./_components/restaurant/restaurant-list";
import { RestaurantListSkeleton } from "./_components/restaurant/restaurant-list.skeleton";

import { getAllRestaurants } from "@data/restaurants/get-all-restaurants";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse",
  description: "Browse restaurants.",
};

const RestaurantListWithSuspense = async () => {
  const restaurants = await getAllRestaurants();
  return <RestaurantList restaurants={restaurants} />;
};

export default async function RestaurantsPage() {
  return (
    <section>
      <div className="p-6 flex justify-center items-center gap-2">
        <Searchbar />
        <Filter />
      </div>
      <div className="space-y-6">
        <h1 className="text-c-header-lg text-foreground">Explore</h1>
        <Suspense fallback={<RestaurantListSkeleton />}>
          <RestaurantListWithSuspense />
        </Suspense>
      </div>
    </section>
  );
}
