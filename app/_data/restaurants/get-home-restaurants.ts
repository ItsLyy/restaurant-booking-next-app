import restaurants from "@data/dummy/restaurants.json";

import { toRestaurantListItem } from "./_helpers";

import type { IRestaurantListItem } from "@types";

const HOME_COUNT = 6;

export async function getPopularRestaurants(): Promise<IRestaurantListItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return restaurants
    .map(toRestaurantListItem)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, HOME_COUNT);
}

export async function getForYouRestaurants(): Promise<IRestaurantListItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const restaurantsWithDiscount: IRestaurantListItem[] = [];
  for (const restaurant of restaurants) {
    const restaurantListItem = toRestaurantListItem(restaurant);
    if (restaurantListItem.discount) {
      restaurantsWithDiscount.push(restaurantListItem);
    }
  }

  return restaurantsWithDiscount
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
    .slice(0, HOME_COUNT);
}