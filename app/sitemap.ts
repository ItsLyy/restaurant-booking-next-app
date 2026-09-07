import { getAllRestaurants } from "@data/restaurants/get-all-restaurants";
import { SITE_URL } from "@libs";

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const restaurants = await getAllRestaurants();

  const restaurantEntries: MetadataRoute.Sitemap = restaurants.map(
    (restaurant) => ({
      url: `${SITE_URL}/restaurants/${restaurant.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/restaurants`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...restaurantEntries,
  ];
}