import { db } from "@db/client";
import { restaurants, restaurantPhotos } from "@db/schema";
import { SITE_URL } from "@libs";

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [restaurantRows, photoRows] = await Promise.all([
    db.select().from(restaurants),
    db.select().from(restaurantPhotos),
  ]);

  const restaurantEntries: MetadataRoute.Sitemap = restaurantRows.map(
    (restaurant) => ({
      url: `${SITE_URL}/restaurants/${restaurant.slug}`,
      lastModified: restaurant.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const photoEntries: MetadataRoute.Sitemap = photoRows.flatMap((photo) => {
    const restaurant = restaurantRows.find(
      (item) => item.id === photo.restaurantId,
    );
    if (!restaurant) return [];
    return {
      url: `${SITE_URL}/restaurants/${restaurant.slug}/images/${photo.id}`,
      lastModified: photo.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    };
  });

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