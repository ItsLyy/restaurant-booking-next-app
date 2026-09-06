import { Button } from "@components";

export const CompletedState = ({
  restaurantSlug,
}: {
  restaurantSlug: string;
}) => {
  return (
    <>
      <Button
        as="link"
        href={`/restaurants/${restaurantSlug}#reviews`}
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        Leave a review
      </Button>
      <Button
        as="link"
        href={`/restaurants/${restaurantSlug}`}
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        Rebook this restaurant
      </Button>
      <Button
        as="link"
        href="/restaurants"
        className="w-full border! rounded-2xl!"
        variant="outline"
      >
        Find other restaurants
      </Button>
    </>
  );
};