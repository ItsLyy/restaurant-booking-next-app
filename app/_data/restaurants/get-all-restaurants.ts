import { cache } from "react";
import { eq, max, min, sql } from "drizzle-orm";

import { db } from "@db/client";
import { bookings, restaurants, restaurantPhotos, reviews, tables } from "@db/schema";

import { toRestaurantListItem } from "./_helpers";

import type { IRestaurantListItem } from "@types";

export const getAllRestaurants = cache(
  async (): Promise<IRestaurantListItem[]> => {
    const [restaurantRows, coverRows, priceRows, ratingRows] =
      await Promise.all([
        db.select().from(restaurants),
        db
          .select({
            restaurantId: restaurantPhotos.restaurantId,
            url: restaurantPhotos.url,
          })
          .from(restaurantPhotos)
          .where(eq(restaurantPhotos.type, "cover")),
        db
          .select({
            restaurantId: tables.restaurantId,
            minPrice: min(tables.price),
            maxPrice: max(tables.price),
          })
          .from(tables)
          .groupBy(tables.restaurantId),
        db
          .select({
            restaurantId: tables.restaurantId,
            rating: sql<number>`avg(${reviews.customerRating})`,
          })
          .from(reviews)
          .innerJoin(bookings, eq(reviews.bookingId, bookings.id))
          .innerJoin(tables, eq(bookings.tableId, tables.id))
          .groupBy(tables.restaurantId),
      ]);

    const coverByRestaurant = new Map(
      coverRows.map((row) => [row.restaurantId, row.url]),
    );
    const priceByRestaurant = new Map(
      priceRows.map((row) => [row.restaurantId, row]),
    );
    const ratingByRestaurant = new Map(
      ratingRows.map((row) => [row.restaurantId, row]),
    );

    return restaurantRows.map((restaurant) => {
      const price = priceByRestaurant.get(restaurant.id);
      const rating = ratingByRestaurant.get(restaurant.id)?.rating ?? null;
      return toRestaurantListItem(restaurant, {
        image: coverByRestaurant.get(restaurant.id) ?? "/",
        rating: rating ?? 0,
        minPrice: price?.minPrice ?? 0,
        maxPrice: price?.maxPrice ?? 0,
      });
    });
  },
);