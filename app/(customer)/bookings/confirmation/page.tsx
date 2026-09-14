import { notFound } from "next/navigation";

import { ConfirmBookingForm } from "./_components/confirm-booking-form";

import {
  BookingLeadTimeError,
  BookingSlotUnavailableError,
  getBookingPreview,
  RestaurantNoTablesError,
  RestaurantNotFoundError,
} from "@data/bookings/create-booking";
import { requireDiner } from "@libs/session";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Booking",
  description: "Review and confirm your restaurant booking.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ConfirmBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { restaurantId, date, time, partySize } = await searchParams;
  const id = typeof restaurantId === "string" ? restaurantId : "";
  const bookingDate = typeof date === "string" ? date : "";
  const bookingTime = typeof time === "string" ? time : "";
  const parsedPartySize = Number(
    typeof partySize === "string" ? partySize : "",
  );

  await requireDiner("/bookings");

  if (!id || !bookingDate || !bookingTime || !Number.isInteger(parsedPartySize)) {
    notFound();
  }

  let preview;
  try {
    preview = await getBookingPreview({
      restaurantId: id,
      date: bookingDate,
      time: bookingTime,
      partySize: parsedPartySize,
    });
  } catch (error) {
    if (
      error instanceof BookingSlotUnavailableError ||
      error instanceof BookingLeadTimeError ||
      error instanceof RestaurantNotFoundError ||
      error instanceof RestaurantNoTablesError
    ) {
      notFound();
    }
    throw error;
  }

  return (
    <section className="w-full flex justify-center items-center py-6 px-4">
      <div className="max-w-110 w-full">
        <div className="border border-muted rounded-2xl overflow-hidden bg-base-100 shadow-sm">
          <div className="py-4 px-6 bg-base-200 border-b border-muted">
            <h1 className="text-foreground text-c-header-md">
              Confirm your booking
            </h1>
            <p className="text-c-caption text-muted mt-0.5">
              Review the details below and add any special note before we send
              your request to {preview.restaurantName}.
            </p>
          </div>
          <div className="p-6">
            <ConfirmBookingForm
              restaurantId={id}
              restaurantName={preview.restaurantName}
              date={bookingDate}
              time={bookingTime}
              tableName={preview.tableName}
              partySize={parsedPartySize}
              price={preview.price}
            />
          </div>
        </div>
      </div>
    </section>
  );
}