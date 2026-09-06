import { Button } from "@components";

export const FailedState = ({
  restaurantSlug,
}: {
  restaurantSlug: string;
}) => {
  return (
    <Button
      as="link"
      href={`/restaurants/${restaurantSlug}`}
      className="w-full border! rounded-2xl!"
      variant="outline"
    >
      Rebook this restaurant
    </Button>
  );
};