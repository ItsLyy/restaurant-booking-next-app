import { Suspense } from "react";

import { Searchbar } from "./_components/searchbar";
import { Filter } from "./_components/filter";
import { Sort } from "./_components/sort";
import { ActiveFilters } from "./_components/active-filters";

import { RestaurantListInfinite } from "./_components/restaurant/restaurant-list-infinite";
import { RestaurantListSkeleton } from "./_components/restaurant/restaurant-list.skeleton";

import { getRestaurantPage } from "@data/restaurants/get-restaurant-page";
import { getCategories } from "@data/categories/get-categories";
import { getPriceBuckets } from "@data/restaurants/get-price-buckets";
import { buildRestaurantsHref, PAGE_SIZE, parseRestaurantsQuery } from "@libs";

import type { RestaurantQuery } from "@libs";
import type { Metadata } from "next";

type SearchParamsRecord = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Explore Restaurants",
  description:
    "Browse restaurants by cuisine, price, and rating, then book a table in seconds.",
  alternates: {
    canonical: "/restaurants",
  },
  openGraph: {
    title: "Explore Restaurants",
    description:
      "Browse restaurants by cuisine, price, and rating, then book a table in seconds.",
  },
  twitter: {
    title: "Explore Restaurants",
    description:
      "Browse restaurants by cuisine, price, and rating, then book a table in seconds.",
  },
};

const RestaurantListWithSuspense = async ({
  query,
  searchParams,
}: {
  query: RestaurantQuery;
  searchParams: SearchParamsRecord;
}) => {
  const { items, total } = await getRestaurantPage(query, 1, PAGE_SIZE);
  return (
    <RestaurantListInfinite
      key={buildRestaurantsHref(searchParams, {})}
      initial={items}
      query={query}
      total={total}
    />
  );
};

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const rawParams = await searchParams;
  const query = parseRestaurantsQuery(rawParams);

  const [categories, buckets] = await Promise.all([
    getCategories(),
    getPriceBuckets(),
  ]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-c-header-lg text-foreground">Explore</h1>
        <p className="text-c-body">
          Browse restaurants by cuisine, price, and rating.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-muted/50 bg-base-100 p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <Searchbar defaultValue={query.search} />
          <div className="flex items-stretch gap-2">
            <Filter
              categories={categories}
              buckets={buckets}
              query={query}
              searchParams={rawParams}
            />
            <Sort query={query} searchParams={rawParams} />
          </div>
        </div>
        <ActiveFilters
          query={query}
          searchParams={rawParams}
          categories={categories}
          buckets={buckets}
        />
      </div>

      <Suspense fallback={<RestaurantListSkeleton />}>
        <RestaurantListWithSuspense query={query} searchParams={rawParams} />
      </Suspense>
    </section>
  );
}