"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { RestaurantItem } from "./restaurant-item";
import { PAGE_SIZE } from "@libs";

import type { IRestaurantListItem } from "@types";
import type { RestaurantQuery } from "@libs";

const FLIGHT_QUERY_KEYS = [
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
  const queryKey = queryKeyOf(query);
  return `/api/restaurants?${new URLSearchParams({
    size: String(PAGE_SIZE),
    page: String(page),
  }).toString()}${queryKey ? `&${queryKey}` : ""}`;
};

interface RestaurantListItemData {
  items: IRestaurantListItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

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
      const res = await fetch(flightUrl(query, nextPageRef.current), {
        cache: "no-store",
      });
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
      <p className="text-c-body text-muted">
        No restaurants match your filters.
      </p>
    );
  }

  return (
    <ul className="rise-in space-y-6 w-full">
      {items.map((restaurant) => (
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
      {loading && (
        <li className="flex justify-center py-6" aria-hidden="true">
          <span className="size-5 animate-spin rounded-full border-2 border-muted border-t-accent-200" />
        </li>
      )}
      <li ref={sentinelRef} aria-hidden="true" className="h-px" />
      <li className="flex justify-center text-c-caption text-muted">
        Showing {items.length} of {total}
      </li>
    </ul>
  );
};