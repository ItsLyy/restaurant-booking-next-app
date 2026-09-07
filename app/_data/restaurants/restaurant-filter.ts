import type { ICategoryListItem, IRestaurantListItem } from "@types";
import type { RestaurantQuery } from "@libs";

export function filterRestaurants(
  restaurants: IRestaurantListItem[],
  categories: ICategoryListItem[],
  query: RestaurantQuery,
): IRestaurantListItem[] {
  let categoryIds: Set<string> | undefined;
  if (query.category) {
    const category = categories.find((item) => item.slug === query.category);
    categoryIds = category ? new Set(category.restaurantIds) : new Set();
  }

  const { pmin, pmax, minRating, hasDiscount, sort, order } = query;
  const direction = order === "desc" ? -1 : 1;

  const filtered = restaurants.filter((restaurant) => {
    if (categoryIds && !categoryIds.has(restaurant.id)) return false;
    if (pmin !== undefined && (restaurant.maxPrice ?? restaurant.minPrice) < pmin)
      return false;
    if (pmax !== undefined && restaurant.minPrice > pmax) return false;
    if (minRating !== undefined && restaurant.rating < minRating) return false;
    if (hasDiscount && (restaurant.discount ?? 0) <= 0) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === "name") {
      return direction * a.name.localeCompare(b.name);
    }
    if (sort === "rating") {
      return direction * (a.rating - b.rating);
    }
    return direction * (a.minPrice - b.minPrice);
  });

  return filtered;
}