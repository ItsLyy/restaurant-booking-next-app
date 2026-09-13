import { cache } from "react";
import { eq } from "drizzle-orm";

import { db } from "@db/client";
import { categories, restaurants, restaurantPhotos } from "@db/schema";

import type { ICategoryListItem } from "@types";

export const getCategories = cache(
  async (): Promise<ICategoryListItem[]> => {
    const [categoryRows, restaurantRows, photoRows] = await Promise.all([
      db.select().from(categories),
      db.select().from(restaurants),
      db
        .select()
        .from(restaurantPhotos)
        .where(eq(restaurantPhotos.type, "cover")),
    ]);

    const restaurantsByCategory = new Map<string, typeof restaurantRows>();
    for (const restaurant of restaurantRows) {
      if (!restaurant.categoryId) continue;
      const list = restaurantsByCategory.get(restaurant.categoryId) ?? [];
      list.push(restaurant);
      restaurantsByCategory.set(restaurant.categoryId, list);
    }

    return categoryRows.map((category) => {
      const categoryRestaurants =
        restaurantsByCategory.get(category.id) ?? [];

      const categoryImage =
        photoRows.find(
          (photo) => photo.restaurantId === categoryRestaurants[0]?.id,
        )?.url ?? "/";

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: categoryImage,
        restaurantIds: categoryRestaurants.map(
          (restaurant) => restaurant.id,
        ),
        restaurantCount: categoryRestaurants.length,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      };
    });
  },
);