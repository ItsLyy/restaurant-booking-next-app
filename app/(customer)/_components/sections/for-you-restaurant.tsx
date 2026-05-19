import RestaurantGrid from "../restaurant/restaurant-grid";

export const ForYouRestaurantSection = () => {
  return (
    <section className="space-y-2 p-2">
      <h2 className="text-c-header-md text-foreground">For You Restaurant</h2>
      <RestaurantGrid />
    </section>
  );
};
