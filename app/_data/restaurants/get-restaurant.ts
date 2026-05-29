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
  "id" | "ownerId" | "createdAt" | "updatedAt"
> {
  cover: string;
  owner: Omit<IOwner, "role">;
  photos: IRestaurantPhoto[];
  menus: IRestaurantPhoto[];
  reviews: Review[];
}

export async function getRestaurant(
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

  const restaurantBookings = bookings.filter((booking) =>
    restaurantTables.map((table) => table.id).includes(booking.tableId),
  );

  const restaurantReviews = reviews.filter((review) =>
    restaurantBookings.map((booking) => booking.id).includes(review.bookingId),
  );

  return {
    cover: photos.find((photo) => photo.type === "cover")!.url,
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description,
    shortDescription: restaurant.shortDescription,
    country: restaurant.country,
    city: restaurant.city,
    address: restaurant.address,
    tags: restaurant.tags,
    owner: owners.find((owner) => owner.id === restaurant.ownerId)!,
    discount: restaurant.discount,
    lat: restaurant.lat,
    lng: restaurant.lng,
    photos: photos.filter((photo) => photo.type === "post").slice(0, 3),
    menus: photos.filter((photo) => photo.type === "menu"),
    reviews: restaurantReviews.map((review) => {
      return {
        ...review,
        customer: users.find(
          (user) =>
            user.id ===
            restaurantBookings.find(
              (booking) => booking.id === review.bookingId,
            )!.customerId,
        )!,
      };
    }),
  };
}
