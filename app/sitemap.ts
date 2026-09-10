import restaurants from "@data/dummy/restaurants.json";
import restaurantPhotos from "@data/dummy/restaurant_photos.json";
import { SITE_URL } from "@libs";

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const restaurantEntries: MetadataRoute.Sitemap = restaurants.map(
    (restaurant) => ({
      url: `${SITE_URL}/restaurants/${restaurant.slug}`,
      lastModified: restaurant.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const photoEntries: MetadataRoute.Sitemap = restaurantPhotos.flatMap(
    (photo) => {
      const restaurant = restaurants.find(
        (item) => item.id === photo.restaurantId,
      );
      if (!restaurant) return [];
      return {
        url: `${SITE_URL}/restaurants/${restaurant.slug}/images/${photo.id}`,
        lastModified: photo.updatedAt,
        changeFrequency: "monthly",
        priority: 0.5,
      };
    },
  );

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-01-01T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/restaurants`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...restaurantEntries,
    ...photoEntries,
  ];
}