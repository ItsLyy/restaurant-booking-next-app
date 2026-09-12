import { cache } from "react";
import { eq } from "drizzle-orm";

import { db } from "@db/client";
import { restaurants, restaurantPhotos } from "@db/schema";

import type { IRestaurant, IRestaurantPhoto } from "@types";

export interface RestaurantImageGallery {
  restaurant: Pick<IRestaurant, "name" | "slug">;
  image: IRestaurantPhoto;
  images: IRestaurantPhoto[];
}

const POST_COUNT = 3;

export const getRestaurantImage = cache(async function getRestaurantImage(
  slug: string,
  imageId: string,
): Promise<RestaurantImageGallery | null> {
  const restaurant =
    (
      await db
        .select()
        .from(restaurants)
        .where(eq(restaurants.slug, slug))
        .limit(1)
    )[0] ?? null;
  if (!restaurant) return null;

  const allPhotos = await db
    .select()
    .from(restaurantPhotos)
    .where(eq(restaurantPhotos.restaurantId, restaurant.id));

  const photo = allPhotos.find((item) => item.id === imageId);
  if (!photo) return null;

  type Photo = IRestaurantPhoto;
  const images =
    photo.type === "menu"
      ? allPhotos
          .filter((item) => item.type === "menu")
          .map((item) => toPhoto(item))
      : [
          allPhotos.find((item) => item.type === "cover") ?? null,
          ...allPhotos
            .filter((item) => item.type === "post")
            .slice(0, POST_COUNT)
            .map((item) => toPhoto(item)),
        ].filter((item): item is Photo => Boolean(item));

  if (!images.some((item) => item.id === imageId)) return null;

  return {
    restaurant: {
      name: restaurant.name,
      slug: restaurant.slug,
    },
    image: toPhoto(photo),
    images,
  };
});

function toPhoto(row: (typeof restaurantPhotos.$inferSelect)): IRestaurantPhoto {
  return {
    id: row.id,
    url: row.url,
    type: row.type,
    restaurantId: row.restaurantId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}