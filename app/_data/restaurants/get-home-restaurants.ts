import { getAllRestaurants } from "./get-all-restaurants";

import type { IRestaurantListItem } from "@types";

const HOME_COUNT = 6;

const demoDelay = (ms: number) =>
  process.env.NODE_ENV === "production"
    ? Promise.resolve()
    : new Promise((resolve) => setTimeout(resolve, ms));

export async function getPopularRestaurants(): Promise<IRestaurantListItem[]> {
  const restaurants = await getAllRestaurants();
  await demoDelay(1000);
  return restaurants
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, HOME_COUNT);
}

export async function getForYouRestaurants(): Promise<IRestaurantListItem[]> {
  const restaurants = await getAllRestaurants();
  await demoDelay(1500);
  return restaurants
    .filter((restaurant) => (restaurant.discount ?? 0) > 0)
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
    .slice(0, HOME_COUNT);
}