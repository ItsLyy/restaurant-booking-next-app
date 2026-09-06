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
    const restaurantTables = tables.filter(
      (table) => table.restaurantId === restaurant.id,
    );

    const restaurantImage = restaurantPhotos.find(
      (photo) => photo.restaurantId === restaurant.id && photo.type === "cover",
    )?.url;

    const restaurantBookings = bookings.filter((booking) =>
      restaurantTables.find((table) => booking.tableId === table.id),
    );

    const restaurantReviews = reviews.filter((review) =>
      restaurantBookings.find((booking) => review.bookingId === booking.id),
    );

    const restaurantRating = restaurantReviews.reduce(
      (a, b) => a + b.customerRating,
      0,
    );

    return {
      ...restaurant,
      rating: restaurantRating
        ? restaurantRating / restaurantReviews.length
        : 0,
      image: restaurantImage ?? "/",
      minPrice: restaurantTables.reduce((a, b) => (a.price < b.price ? a : b))
        .price,
      maxPrice: restaurantTables.reduce((a, b) => (a.price > b.price ? a : b))
        .price,
    };
  });
}
