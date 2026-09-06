import { Button } from "@components";

export const ConfirmPaidState = ({
  restaurantName,
  restaurantSlug,
  restaurantAddress,
}: {
  restaurantName: string;
  restaurantSlug: string;
  restaurantAddress: string;
}) => {
  return (
    <>
      <Button
        as="link"
        href={`https://maps.google.com/?q=${encodeURIComponent(`${restaurantName} ${restaurantAddress}`)}`}
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        Get Direction
      </Button>
      <Button
        as="link"
        href={`/restaurants/${restaurantSlug}`}
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        View Restaurant
      </Button>
      <Button className="w-full border! rounded-2xl!" variant="outline">
        Cancel Booking
      </Button>
    </>
  );
};