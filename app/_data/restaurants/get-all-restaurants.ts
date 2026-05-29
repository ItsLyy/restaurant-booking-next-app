import restaurants from "@data/dummy/restaurants.json";
import restaurantPhotos from "@data/dummy/restaurant_photos.json";
import tables from "@data/dummy/tables.json";
import reviews from "@data/dummy/reviews.json";
import bookings from "@data/dummy/bookings.json";

import { IRestaurantListItem } from "@types";

type GetAllRestaurantsResponse = IRestaurantListItem[];

export async function getAllRestaurants(): Promise<GetAllRestaurantsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return restaurants.map((restaurant) => {
    const restaurantTables = tables
      .filter((table) => table.restaurantId === restaurant.id)
      .map((table) => {
        return {
          ...table,
          bookings: bookings
            .filter((booking) => booking.tableId === table.id)
            .map((booking) => {
              return {
                ...booking,
                review: reviews.find(
                  (review) => review.bookingId === booking.id,
                ),
              };
            }),
        };
      });

    const restaurantImage = restaurantPhotos.find(
      (photo) => photo.restaurantId === restaurant.id && photo.type === "cover",
    )?.url;

    return {
      ...restaurant,
      rating:
        restaurantTables
          .map((table) =>
            table.bookings
              .map((booking) => booking.review?.customerRating ?? 0)
              .reduce((a, b) => a + b, 0),
          )
          .reduce((a, b) => a + b, 0) / restaurantTables.length,
      image: restaurantImage ?? "/",
      minPrice: restaurantTables.reduce((a, b) => (a.price < b.price ? a : b))
        .price,
      maxPrice: restaurantTables.reduce((a, b) => (a.price > b.price ? a : b))
        .price,
    };
  });
}
