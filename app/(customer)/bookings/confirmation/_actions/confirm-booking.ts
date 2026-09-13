"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import restaurants from "@data/dummy/restaurants.json";

import {
  BookingLeadTimeError,
  BookingSlotUnavailableError,
  BookingWriteError,
  createBooking,
  RestaurantNoTablesError,
  RestaurantNotFoundError,
} from "@data/bookings/create-booking";
import { getDinerSession } from "@libs/session";

import { z } from "zod";

const bookingSchema = z.object({
  restaurantId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  partySize: z.coerce.number().int().min(1).max(99),
  specialRequest: z.string().max(500).optional(),
});

export interface ConfirmBookingState {
  ok: boolean;
  bookingId?: string;
  error?: string;
}

export async function confirmBookingAction(
  _prevState: ConfirmBookingState,
  formData: FormData,
): Promise<ConfirmBookingState> {
  const customer = await getDinerSession();
  if (!customer) redirect("/signin");

  const parsed = bookingSchema.safeParse({
    restaurantId: formData.get("restaurantId"),
    date: formData.get("date"),
    time: formData.get("time"),
    partySize: formData.get("partySize"),
    specialRequest: String(formData.get("specialRequest") ?? "")
      .trim()
      .slice(0, 500),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Your booking details are incomplete. Please start over.",
    };
  }

  try {
    const booking = await createBooking(parsed.data, customer.userId);

    const restaurant = restaurants.find(
      (item) => item.id === parsed.data.restaurantId,
    );
    if (restaurant) {
      revalidatePath(`/restaurants/${restaurant.slug}`, "page");
    }
    revalidatePath("/bookings", "page");
    revalidatePath("/dashboard", "page");
    revalidatePath("/dashboard/bookings", "page");

    // Broadcast booking:created event to restaurant dashboard and customer listeners
    const { findAccountById } = await import("@data/auth/users");
    const { broadcastBookingEvent } = await import("@db/broadcast");
    const customerAccount = findAccountById(customer.userId);
    const guestName = customerAccount
      ? `${customerAccount.firstName} ${customerAccount.lastName}`.trim()
      : customer.email;

    await broadcastBookingEvent("booking:created", {
      bookingId: booking.id,
      restaurantId: parsed.data.restaurantId,
      customerId: customer.userId,
      tableId: booking.tableId,
      guestName,
      status: "pending",
      date: booking.date,
      time: booking.time,
      partySize: booking.partySize,
      paymentStatus: "unpaid",
    });

    return { ok: true, bookingId: booking.id };
  } catch (error) {
    if (
      error instanceof BookingSlotUnavailableError ||
      error instanceof BookingLeadTimeError ||
      error instanceof RestaurantNotFoundError ||
      error instanceof RestaurantNoTablesError ||
      error instanceof BookingWriteError
    ) {
      return { ok: false, error: error.message };
    }
    return {
      ok: false,
      error: "Could not create the booking right now. Please try again.",
    };
  }
}