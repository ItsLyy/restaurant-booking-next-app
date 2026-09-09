import AddBookingContent from "../../../bookings/add/_components/add-booking-content";

import { AddBookingModal } from "./_components/add-booking-modal";

export default async function InterceptedAddBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <AddBookingModal>
      <AddBookingContent searchParams={searchParams} />
    </AddBookingModal>
  );
}