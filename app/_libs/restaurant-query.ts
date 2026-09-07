export type RestaurantSortKey = "name" | "rating" | "price";
export type RestaurantOrder = "asc" | "desc";

export const PAGE_SIZE = 8;

export interface RestaurantQuery {
  search?: string;
  category?: string;
  pmin?: number;
  pmax?: number;
  minRating?: number;
  hasDiscount?: boolean;
  sort?: RestaurantSortKey;
  order?: RestaurantOrder;
}

const QUERY_KEYS = [
  "search",
  "category",
  "pmin",
  "pmax",
  "minRating",
  "discount",
  "sort",
  "order",
] as const;

const SORT_KEYS = ["name", "rating", "price"] as const;
const ORDERS = ["asc", "desc"] as const;

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseRestaurantsQuery(searchParams: SearchParams): RestaurantQuery {
  const sortValue = first(searchParams.sort);
  const orderValue = first(searchParams.order);

  const search = first(searchParams.search)?.trim();

  return {
    search: search ? search : undefined,
    category: first(searchParams.category),
    pmin: toNumber(first(searchParams.pmin)),
    pmax: toNumber(first(searchParams.pmax)),
    minRating: toNumber(first(searchParams.minRating)),
    hasDiscount:
      first(searchParams.discount) === "1" ||
      first(searchParams.discount) === "true",
    sort: SORT_KEYS.includes(sortValue as RestaurantSortKey)
      ? (sortValue as RestaurantSortKey)
      : undefined,
    order: ORDERS.includes(orderValue as RestaurantOrder)
      ? (orderValue as RestaurantOrder)
      : undefined,
  };
}

export function buildRestaurantsHref(
  searchParams: SearchParams,
  overrides: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  for (const key of QUERY_KEYS) {
    const value = first(searchParams[key]);
    if (value) params.set(key, value);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === "") params.delete(key);
    else params.set(key, value);
  }
  const queryString = params.toString();
  return queryString ? `/restaurants?${queryString}` : "/restaurants";
}