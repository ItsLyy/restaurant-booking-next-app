"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr";

import { RestaurantItem } from "./restaurant-item";
import { PAGE_SIZE } from "@libs";

import type { IRestaurantListItem } from "@types";
import type { RestaurantQuery } from "@libs";

const FLIGHT_QUERY_KEYS = [
  "search",
  "category",
  "pmin",
  "pmax",
  "minRating",
  "discount",
  "sort",
  "order",
] as const;

const queryKeyOf = (query: RestaurantQuery) => {
  const params = new URLSearchParams();
  for (const key of FLIGHT_QUERY_KEYS) {
    const value = query[key as keyof RestaurantQuery];
    if (value === true) params.set(key, "1");
    else if (value !== undefined && value !== "") params.set(key, String(value));
  }
  return params.toString();
};

const flightUrl = (query: RestaurantQuery, page: number) => {
  const params = new URLSearchParams(queryKeyOf(query));
  params.set("size", String(PAGE_SIZE));
  params.set("page", String(page));
  return `/api/restaurants?${params.toString()}`;
};

interface RestaurantListItemData {
  items: IRestaurantListItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

const hasActiveQuery = (query: RestaurantQuery) =>
  Boolean(
    query.search ||
      query.category ||
      query.pmin !== undefined ||
      query.pmax !== undefined ||
      query.minRating !== undefined ||
      query.hasDiscount,
  );

export const RestaurantListInfinite = ({
  initial,
  query,
  total,
}: {
  initial: IRestaurantListItem[];
  query: RestaurantQuery;
  total: number;
}) => {
  const [items, setItems] = useState<IRestaurantListItem[]>(initial);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLLIElement>(null);

  const nextPageRef = useRef(2);
  const loadingRef = useRef(false);
  const finishedRef = useRef(initial.length >= total);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || finishedRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(flightUrl(query, nextPageRef.current));
      if (!res.ok) {
        finishedRef.current = true;
        return;
      }
      const data = (await res.json()) as RestaurantListItemData;
      if (data.items.length > 0) {
        setItems((prev) => {
          const seen = new Set(prev.map((item) => item.id));
          return [
            ...prev,
            ...data.items.filter((item) => !seen.has(item.id)),
          ];
        });
      }
      nextPageRef.current = data.page + 1;
      finishedRef.current = !data.hasMore;
    } catch {
      // transient failure; the next intersection retries
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) void loadMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  if (items.length === 0) {
    return (
      <div className="rise-in flex flex-col items-center gap-3 py-16 text-center">
        <div className="size-14 rounded-full bg-base-200 flex items-center justify-center">
          <ForkKnifeIcon size={28} weight="duotone" className="text-muted" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-c-header-md text-foreground">
            No restaurants found
          </span>
          <span className="text-c-body">
            No restaurants match your search or filters.
          </span>
        </div>
        {hasActiveQuery(query) ? (
          <Link
            href="/restaurants"
            className="mt-2 inline-flex h-10 items-center rounded-lg border border-accent-100 px-4 text-c-button text-accent-100 transition-colors hover:bg-accent-200/10"
          >
            Clear all filters
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rise-in flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span className="text-c-header-md text-foreground">
          {total} {total === 1 ? "restaurant" : "restaurants"}
        </span>
        {items.length < total ? (
          <span className="text-c-caption text-muted">
            showing {items.length} so far
          </span>
        ) : null}
      </div>
      <ul className="w-full">
        {items.map((restaurant) => (
          <li
            key={restaurant.id}
            className="py-6 first:pt-0 last:pb-0 border-b border-muted/20 last:border-none"
          >
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
        {loading && (
          <li className="flex justify-center py-6" aria-hidden="true">
            <span className="size-5 animate-spin rounded-full border-2 border-muted border-t-accent-200" />
          </li>
        )}
        <li ref={sentinelRef} aria-hidden="true" className="h-px" />
      </ul>
    </div>
  );
};