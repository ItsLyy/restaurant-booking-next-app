import { cache } from "react";
import categories from "../dummy/categories.json";
import restaurants from "../dummy/restaurants.json";
import restaurantPhotos from "../dummy/restaurant_photos.json";

import type { ICategoryListItem } from "@types";

export const getCategories = cache(
  async (): Promise<ICategoryListItem[]> =>
    categories.map((category) => {
      const categoryRestaurants = restaurants.filter((restaurant) =>
        category.restaurantIds.includes(restaurant.id),
      );

      const categoryImage =
        restaurantPhotos.find(
          (photo) =>
            photo.restaurantId === categoryRestaurants[0]?.id &&
            photo.type === "cover",
        )?.url ?? "/";

      return {
        ...category,
        image: categoryImage,
        restaurantCount: categoryRestaurants.length,
      };
    }),
);