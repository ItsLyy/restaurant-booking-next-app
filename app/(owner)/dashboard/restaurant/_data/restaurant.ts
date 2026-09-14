import { eq } from "drizzle-orm";

import { db } from "@db/client";
import {
  restaurants as restaurantsTable,
  tables as tablesTable,
} from "@db/schema";

import type { IRestaurant } from "@types";

const RESTAURANT_ID = "rest-001";

export interface RestaurantProfileData {
  restaurant: IRestaurant;
  tablesCount: number;
}

const toIRestaurant = (
  row: (typeof restaurantsTable.$inferSelect),
): IRestaurant => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  country: row.country,
  city: row.city,
  address: row.address,
  tags: row.tags,
  ownerId: row.ownerId,
  ...(row.categoryId ? { categoryId: row.categoryId } : {}),
  ...(row.discount !== null ? { discount: row.discount } : {}),
  description: row.description,
  ...(row.shortDescription ? { shortDescription: row.shortDescription } : {}),
  ...(row.lat !== null ? { lat: row.lat } : {}),
  ...(row.lng !== null ? { lng: row.lng } : {}),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const getRestaurantProfile = async (): Promise<
  RestaurantProfileData | undefined
> => {
  const [restaurantRows, tableRows] = await Promise.all([
    db
      .select()
      .from(restaurantsTable)
      .where(eq(restaurantsTable.id, RESTAURANT_ID))
      .limit(1),
    db
      .select({ id: tablesTable.id })
      .from(tablesTable)
      .where(eq(tablesTable.restaurantId, RESTAURANT_ID)),
  ]);
  const restaurantRow = restaurantRows[0];
  if (!restaurantRow) return undefined;

  return { restaurant: toIRestaurant(restaurantRow), tablesCount: tableRows.length };
};