import { notFound } from "next/navigation";

import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Progress } from "./_components/progress";
import { StatusDescription } from "./_components/status-description";
import { StatusDetail } from "./_components/status-detail";

import { getBooking } from "@data/bookings/get-booking";

import { resolvePaymentStatus } from "@utils";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getBooking(id);
  if (!data) notFound();

  const {
    booking,
    bookingCode,
    restaurantName,
    restaurantSlug,
    restaurantAddress,
    tableName,
  } = data;
  const paymentStatus = resolvePaymentStatus(booking.status, data.payment?.status);
  const paymentPrice = data.payment?.price ?? 0;

  return (
    <section className="w-full flex justify-center items-center py-6 px-4">
      <div className="max-w-150 w-full space-y-4">
        <Header
          restaurantName={restaurantName}
          bookingStatus={booking.status}
          paymentStatus={paymentStatus}
        />
        <StatusDetail
          bookingStatus={booking.status}
          bookingDate={booking.date}
          bookingTime={booking.time}
          paymentPrice={paymentPrice}
          paymentStatus={paymentStatus}
          bookingCancelled={
            booking.cancelled
              ? { by: booking.cancelled.by, date: booking.cancelled.date }
              : undefined
          }
        />
        <Progress bookingStatus={booking.status} paymentStatus={paymentStatus} />
        <StatusDescription
          bookingId={bookingCode}
          bookingDate={booking.date}
          bookingPartySize={booking.partySize}
          bookingTable={tableName}
          bookingTime={booking.time}
          bookingStatus={booking.status}
          paymentPrice={paymentPrice}
          paymentStatus={paymentStatus}
          cancelledDate={booking.cancelled?.date}
        />
        <Footer
          bookingStatus={booking.status}
          paymentStatus={paymentStatus}
          paymentPrice={paymentPrice}
          restaurantName={restaurantName}
          restaurantSlug={restaurantSlug}
          restaurantAddress={restaurantAddress}
        />
      </div>
    </section>
  );
}
