import { notFound } from "next/navigation";

import { ConfirmBookingForm } from "./_components/confirm-booking-form";

import { getBooking } from "@data/bookings/get-booking";

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
  const { id } = await searchParams;
  const bookingId = typeof id === "string" ? id : "";

  const data = bookingId ? await getBooking(bookingId) : null;
  if (!data) notFound();

  const {
    booking,
    bookingCode,
    restaurantName,
    tableName,
    payment,
  } = data;

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
              your request to {restaurantName}.
            </p>
          </div>
          <div className="p-6">
            <ConfirmBookingForm
              bookingId={booking.id}
              restaurantName={restaurantName}
              bookingCode={bookingCode}
              date={booking.date}
              time={booking.time}
              tableName={tableName}
              partySize={booking.partySize}
              price={payment?.price ?? 0}
              initialSpecialRequest={booking.specialRequest}
            />
          </div>
        </div>
      </div>
    </section>
  );
}