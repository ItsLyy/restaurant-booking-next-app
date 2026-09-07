"use server";

import { revalidatePath } from "next/cache";

import restaurants from "@data/dummy/restaurants.json";

import {
  BookingSlotUnavailableError,
  BookingWriteError,
  createBooking,
  RestaurantNoTablesError,
  RestaurantNotFoundError,
} from "@data/bookings/create-booking";

import { z } from "zod";

const bookingSchema = z.object({
  restaurantId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  partySize: z.number().int().min(1).max(99),
  specialRequest: z.string().max(500).optional(),
});

export async function createBookingAction(
  input: z.infer<typeof bookingSchema>,
) {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(
      "Invalid booking details. Please check your selection.",
    );
  }

  try {
    const booking = await createBooking(parsed.data);

    const restaurant = restaurants.find(
      (item) => item.id === parsed.data.restaurantId,
    );
    if (restaurant) {
      revalidatePath(`/restaurants/${restaurant.slug}`, "page");
    }
    revalidatePath("/bookings", "page");

    return { booking };
  } catch (error) {
    if (
      error instanceof BookingSlotUnavailableError ||
      error instanceof RestaurantNotFoundError ||
      error instanceof RestaurantNoTablesError ||
      error instanceof BookingWriteError
    ) {
      throw new Error(error.message);
    }
    throw new Error(
      "Could not create the booking right now. Please try again.",
    );
  }
}
