import { Card } from "./card";

import { bookingStatusDetail, type BookingStatusDetailParameter } from "@utils";

type StatusDetailProps = BookingStatusDetailParameter;

export const StatusDetail = ({
  bookingStatus,
  bookingDate,
  bookingTime,
  paymentPrice,
  paymentStatus,
  bookingCancelled,
}: StatusDetailProps) => {
  const data = bookingStatusDetail({
    bookingStatus,
    bookingDate,
    bookingTime,
    paymentPrice,
    paymentStatus,
    bookingCancelled,
  });
  return (
    <Card className="space-y-2">
      <p className="text-c-normal text-foreground">{data.status}</p>
      <p className="text-c-normal text-muted">{data.description}</p>
    </Card>
  );
};
