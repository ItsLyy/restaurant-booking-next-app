export function toBookingCode(bookingId: string): string {
  const sequence = bookingId.replace("booking-", "").padStart(5, "0");
  return `TBK-${sequence}`;
}