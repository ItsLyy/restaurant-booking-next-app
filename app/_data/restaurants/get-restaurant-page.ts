import { getCategories } from "@data/categories/get-categories";
import { getAllRestaurants } from "./get-all-restaurants";
import { filterRestaurants } from "./restaurant-filter";

import type { IRestaurantListItem } from "@types";
import type { RestaurantQuery } from "@libs";

export interface RestaurantPage {
  items: IRestaurantListItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

const FIRST_PAINT_MS = 1200;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isInteractive = (query: RestaurantQuery) =>
  Boolean(
    query.category ||
      query.pmin !== undefined ||
      query.pmax !== undefined ||
      query.minRating !== undefined ||
      query.hasDiscount ||
      query.sort ||
      query.order,
  );

export async function getRestaurantPage(
  query: RestaurantQuery,
  page: number,
  pageSize: number,
): Promise<RestaurantPage> {
  const [restaurants, categories] = await Promise.all([
    getAllRestaurants(),
    getCategories(),
    page === 1 && !isInteractive(query) ? delay(FIRST_PAINT_MS) : Promise.resolve(),
  ]);

  const filtered = filterRestaurants(restaurants, categories, query);
  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    hasMore: start + pageSize < filtered.length,
  };
}