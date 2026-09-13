import { readFileSync } from "fs";
import path from "path";

import type { IRestaurant } from "@types";

const RESTAURANTS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/restaurants.json",
);

const RESTAURANT_ID = "rest-001";

export interface RestaurantProfileData {
  restaurant: IRestaurant;
  tablesCount: number;
}

export const getRestaurantProfile = (): RestaurantProfileData | undefined => {
  const restaurants = JSON.parse(
    readFileSync(RESTAURANTS_FILE_PATH, "utf8"),
  ) as IRestaurant[];
  const restaurant = restaurants.find((item) => item.id === RESTAURANT_ID);
  if (!restaurant) return undefined;

  const rawTables = JSON.parse(
    readFileSync(path.join(process.cwd(), "app/_data/dummy/tables.json"), "utf8"),
  ) as { id: string; restaurantId: string }[];
  const tablesCount = rawTables.filter(
    (table) => table.restaurantId === RESTAURANT_ID,
  ).length;

  return { restaurant, tablesCount };
};