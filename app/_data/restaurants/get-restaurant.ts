import { cache } from "react";

import restaurants from "../dummy/restaurants.json";
import restaurantPhotos from "../dummy/restaurant_photos.json";
import bookings from "../dummy/bookings.json";
import tables from "../dummy/tables.json";
import reviews from "../dummy/reviews.json";
import users from "../dummy/users.json";
import owners from "../dummy/owners.json";

import type {
  IOwner,
  IRestaurant,
  IRestaurantPhoto,
  IReview,
  IUser,
} from "@types";

interface Review extends IReview {
  customer: Omit<IUser, "role">;
}

interface GetRestaurantResponse extends Omit<
  IRestaurant,
  "ownerId" | "createdAt" | "updatedAt"
> {
  cover: string;
  coverId: string;
  owner: Omit<IOwner, "role">;
  photos: IRestaurantPhoto[];
  menus: IRestaurantPhoto[];
  reviews: Review[];
}

export const getRestaurant = cache(async function getRestaurant(
  slug: string,
): Promise<GetRestaurantResponse | null> {
  const restaurant = restaurants.find((restaurant) => restaurant.slug === slug);
  if (!restaurant) return null;

  const photos = restaurantPhotos.filter(
    (photo) => photo.restaurantId === restaurant.id,
  ) as IRestaurantPhoto[];

  const restaurantTables = tables.filter(
    (table) => table.restaurantId === restaurant.id,
  );

  const restaurantTableIds = new Set(
    restaurantTables.map((table) => table.id),
  );
  const restaurantBookings = bookings.filter((booking) =>
    restaurantTableIds.has(booking.tableId),
  );

  const restaurantBookingIds = new Set(
    restaurantBookings.map((booking) => booking.id),
  );
  const restaurantReviews = reviews.filter((review) =>
    restaurantBookingIds.has(review.bookingId),
  );

  const cover = photos.find((photo) => photo.type === "cover");
  if (!cover) {
    throw new Error(
      `No cover photo found for restaurant "${restaurant.name}"`,
    );
  }

  const owner = owners.find((owner) => owner.id === restaurant.ownerId);
  if (!owner) {
    throw new Error(
      `Owner "${restaurant.ownerId}" not found for restaurant "${restaurant.name}"`,
    );
  }

  const reviewWithCustomers = restaurantReviews.map((review) => {
    const booking = restaurantBookings.find(
      (booking) => booking.id === review.bookingId,
    );
    const customer = users.find((user) => user.id === booking?.customerId);

    if (!customer) {
      throw new Error(
        `Customer not found for review "${review.id}" of restaurant "${restaurant.name}"`,
      );
    }

    return { ...review, customer };
  });

  return {
    id: restaurant.id,
    cover: cover.url,
    coverId: cover.id,
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description,
    shortDescription: restaurant.shortDescription,
    country: restaurant.country,
    city: restaurant.city,
    address: restaurant.address,
    tags: restaurant.tags,
    owner,
    discount: restaurant.discount,
    lat: restaurant.lat,
    lng: restaurant.lng,
    photos: photos.filter((photo) => photo.type === "post").slice(0, 3),
    menus: photos.filter((photo) => photo.type === "menu"),
    reviews: reviewWithCustomers,
  };
});