import { readFileSync } from "fs";
import path from "path";

import type { IOwner, IRestaurant } from "@types";

const OWNERS_FILE_PATH = path.join(process.cwd(), "app/_data/dummy/owners.json");
const RESTAURANTS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/restaurants.json",
);

const OWNER_ID = "owner-001";
const RESTAURANT_ID = "rest-001";

export interface OwnerProfileData {
  owner: IOwner;
  restaurant?: IRestaurant;
}

export const getOwnerProfile = (): OwnerProfileData | undefined => {
  const owners = JSON.parse(readFileSync(OWNERS_FILE_PATH, "utf8")) as IOwner[];
  const owner = owners.find((item) => item.id === OWNER_ID);
  if (!owner) return undefined;

  const restaurants = JSON.parse(
    readFileSync(RESTAURANTS_FILE_PATH, "utf8"),
  ) as IRestaurant[];
  const restaurant = restaurants.find((item) => item.id === RESTAURANT_ID);

  return { owner, restaurant: restaurant ?? undefined };
};