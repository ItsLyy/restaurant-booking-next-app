import { getAddBookingOptions } from "../_data/add-options";
import { normalizeDate } from "../../_data/bookings";
import { ManualBookingForm } from "./manual-booking-form";

export default async function AddBookingContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date } = await searchParams;
  const defaultDate = normalizeDate(date);
  const { tables } = getAddBookingOptions();

  return <ManualBookingForm defaultDate={defaultDate} tables={tables} />;
}