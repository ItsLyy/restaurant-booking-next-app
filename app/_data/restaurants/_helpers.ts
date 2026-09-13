import type { IRestaurantListItem } from "@types";
import type { RestaurantRow } from "@db/schema";

export interface RestaurantListItemStats {
  image: string;
  rating: number;
  minPrice: number;
  maxPrice: number;
}

export function toRestaurantListItem(
  restaurant: RestaurantRow,
  stats: RestaurantListItemStats,
): IRestaurantListItem {
  return {
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    country: restaurant.country,
    city: restaurant.city,
    address: restaurant.address,
    tags: restaurant.tags,
    categoryId: restaurant.categoryId ?? undefined,
    discount: restaurant.discount ?? undefined,
    description: restaurant.description,
    shortDescription: restaurant.shortDescription ?? undefined,
    lat: restaurant.lat ?? undefined,
    lng: restaurant.lng ?? undefined,
    image: stats.image,
    rating: stats.rating,
    minPrice: stats.minPrice,
    maxPrice: stats.maxPrice,
  };
}