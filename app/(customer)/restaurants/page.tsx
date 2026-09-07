import { Suspense } from "react";

import { Searchbar } from "./_components/searchbar";
import { Filter } from "./_components/filter";
import { Sort } from "./_components/sort";

import { RestaurantListInfinite } from "./_components/restaurant/restaurant-list-infinite";
import { RestaurantListSkeleton } from "./_components/restaurant/restaurant-list.skeleton";

import { getRestaurantPage } from "@data/restaurants/get-restaurant-page";
import { getCategories } from "@data/categories/get-categories";
import { getPriceBuckets } from "@data/restaurants/get-price-buckets";
import { buildRestaurantsHref, PAGE_SIZE, parseRestaurantsQuery } from "@libs";

import { FunnelIcon } from "@phosphor-icons/react/dist/ssr";

import type { RestaurantQuery } from "@libs";
import type { Metadata } from "next";

type SearchParamsRecord = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Browse",
  description: "Browse restaurants.",
  alternates: {
    canonical: "/restaurants",
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

const FilterWithSuspense = async ({
  query,
  searchParams,
}: {
  query: RestaurantQuery;
  searchParams: SearchParamsRecord;
}) => {
  const [categories, buckets] = await Promise.all([
    getCategories(),
    getPriceBuckets(),
  ]);
  return (
    <Filter
      categories={categories}
      buckets={buckets}
      query={query}
      searchParams={searchParams}
    />
  );
};

const activeFilterCount = (query: RestaurantQuery): number =>
  [
    query.category ? 1 : 0,
    query.pmin !== undefined || query.pmax !== undefined ? 1 : 0,
    query.minRating !== undefined ? 1 : 0,
    query.hasDiscount ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

const FilterFallback = ({ query }: { query: RestaurantQuery }) => {
  const activeCount = activeFilterCount(query);
  return (
    <div className="relative w-11 h-11 flex items-center justify-center rounded-lg border border-muted bg-base-100 text-muted">
      <FunnelIcon size={20} weight="duotone" />
      {activeCount > 0 ? (
        <span className="absolute -top-1 -right-1 size-[18px] flex items-center justify-center rounded-full bg-base-100 text-accent-100 border border-accent-100/40 text-[10px] font-bold leading-none">
          {activeCount}
        </span>
      ) : null}
    </div>
  );
};

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRecord>;
}) {
  const rawParams = await searchParams;
  const query = parseRestaurantsQuery(rawParams);

  return (
    <section>
      <div className="p-6 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2">
        <Searchbar />
        <div className="flex justify-center items-stretch gap-2 flex-wrap">
          <Suspense fallback={<FilterFallback query={query} />}>
            <FilterWithSuspense query={query} searchParams={rawParams} />
          </Suspense>
          <Sort query={query} searchParams={rawParams} />
        </div>
      </div>
      <div className="space-y-6">
        <h1 className="text-c-header-lg text-foreground">Explore</h1>
        <Suspense fallback={<RestaurantListSkeleton />}>
          <RestaurantListWithSuspense query={query} searchParams={rawParams} />
        </Suspense>
      </div>
    </section>
  );
}