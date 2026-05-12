import RestaurantGrid from "../restaurant/restaurant-grid";

const ForYouRestaurant = () => {
  return (
    <section className="space-y-2 p-2">
      <h2 className="text-c-header-md text-foreground">For You Restaurant</h2>
      <RestaurantGrid />
    </section>
  );
};

export default ForYouRestaurant;
