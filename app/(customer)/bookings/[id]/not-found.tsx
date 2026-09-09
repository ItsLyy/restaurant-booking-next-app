import { Button } from "@components/ui/button";

export default function BookingNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-20">
      <h1 className="text-c-header-lg text-foreground text-center">
        Booking not found
      </h1>
      <p className="text-c-body text-muted text-center">
        The booking you are looking for does not exist or the link may be
        invalid.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button as="link" href="/bookings">
          Go to my bookings
        </Button>
        <Button as="link" href="/restaurants" variant="outline">
          Explore restaurants
        </Button>
      </div>
    </div>
  );
}