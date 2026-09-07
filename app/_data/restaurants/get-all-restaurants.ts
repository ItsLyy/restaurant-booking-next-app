import { cache } from "react";
import restaurants from "@data/dummy/restaurants.json";

import { toRestaurantListItem } from "./_helpers";

import type { IRestaurantListItem } from "@types";

export const getAllRestaurants = cache(
  async (): Promise<IRestaurantListItem[]> =>
    restaurants.map(toRestaurantListItem),
);