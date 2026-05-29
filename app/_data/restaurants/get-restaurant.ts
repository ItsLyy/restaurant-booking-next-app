import restaurants from "../dummy/restaurants.json";
import restaurantPhotos from "../dummy/restaurant_photos.json";

import type { IRestaurant, IRestaurantPhoto } from "@types";

interface GetRestaurantResponse extends Omit<
  IRestaurant,
  "id" | "createdAt" | "updatedAt"
> {
  photos: IRestaurantPhoto[];
}

export async function getRestaurant(
  slug: string,
): Promise<GetRestaurantResponse | null> {
  const restaurant = restaurants.find((restaurant) => restaurant.slug === slug);
  if (!restaurant) return null;

  const photos = restaurantPhotos.filter(
    (photo) => photo.restaurantId === restaurant.id,
  );

  return {
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description,
    shortDescription: restaurant.shortDescription,
    country: restaurant.country,
    city: restaurant.city,
    address: restaurant.address,
    tags: restaurant.tags,
    ownerId: restaurant.ownerId,
    discount: restaurant.discount,
    lat: restaurant.lat,
    lng: restaurant.lng,
    photos,
  };
}
