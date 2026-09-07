import restaurants from "../dummy/restaurants.json";
import restaurantPhotos from "../dummy/restaurant_photos.json";

import type { IRestaurant, IRestaurantPhoto } from "@types";

export interface RestaurantImageGallery {
  restaurant: Pick<IRestaurant, "name" | "slug">;
  image: IRestaurantPhoto;
  images: IRestaurantPhoto[];
}

const POST_COUNT = 3;

export async function getRestaurantImage(
  slug: string,
  imageId: string,
): Promise<RestaurantImageGallery | null> {
  const restaurant = restaurants.find((item) => item.slug === slug);
  if (!restaurant) return null;

  const photo = restaurantPhotos.find(
    (item) => item.id === imageId && item.restaurantId === restaurant.id,
  ) as IRestaurantPhoto | undefined;
  if (!photo) return null;

  const allPhotos = restaurantPhotos.filter(
    (item) => item.restaurantId === restaurant.id,
  ) as IRestaurantPhoto[];

  const images =
    photo.type === "menu"
      ? allPhotos.filter((item) => item.type === "menu")
      : [
          allPhotos.find((item) => item.type === "cover"),
          ...allPhotos.filter((item) => item.type === "post").slice(0, POST_COUNT),
        ].filter((item): item is IRestaurantPhoto => Boolean(item));

  if (!images.some((item) => item.id === imageId)) return null;

  return {
    restaurant: {
      name: restaurant.name,
      slug: restaurant.slug,
    },
    image: photo,
    images,
  };
}