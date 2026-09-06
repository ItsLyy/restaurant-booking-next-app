import restaurants from "@data/dummy/restaurants.json";

import { toRestaurantListItem } from "./_helpers";

import type { IRestaurantListItem } from "@types";

type GetAllRestaurantsResponse = IRestaurantListItem[];

export async function getAllRestaurants(): Promise<GetAllRestaurantsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return restaurants.map(toRestaurantListItem);
}