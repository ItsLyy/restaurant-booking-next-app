import restaurantPhotos from "../dummy/restaurant_photos.json";
import tables from "../dummy/tables.json";
import bookings from "../dummy/bookings.json";
import reviews from "../dummy/reviews.json";

import type { IRestaurant, IRestaurantListItem } from "@types";

export function toRestaurantListItem(
  restaurant: IRestaurant,
): IRestaurantListItem {
  const restaurantTables = tables.filter(
    (table) => table.restaurantId === restaurant.id,
  );

  const restaurantImage = restaurantPhotos.find(
    (photo) => photo.restaurantId === restaurant.id && photo.type === "cover",
  )?.url;

  const restaurantBookingIds = new Set<string>();
  for (const table of restaurantTables) {
    for (const booking of bookings) {
      if (booking.tableId === table.id) {
        restaurantBookingIds.add(booking.id);
      }
    }
  }
  const restaurantReviews = reviews.filter((review) =>
    restaurantBookingIds.has(review.bookingId),
  );
  const totalRating = restaurantReviews.reduce(
    (sum, review) => sum + review.customerRating,
    0,
  );

  const minPriceTable = restaurantTables.reduce((min, table) =>
    table.price < min.price ? table : min,
  );
  const maxPriceTable = restaurantTables.reduce((max, table) =>
    table.price > max.price ? table : max,
  );

  return {
    ...restaurant,
    image: restaurantImage ?? "/",
    rating: restaurantReviews.length
      ? totalRating / restaurantReviews.length
      : 0,
    minPrice: minPriceTable.price,
    maxPrice: maxPriceTable.price,
  };
}