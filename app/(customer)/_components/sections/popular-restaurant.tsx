import RestaurantGrid from "../restaurant/restaurant-grid";

export default function PopularRestaurant() {
  return (
    <section className="space-y-2 p-2">
      <h2 className="text-c-header-md text-foreground">Popular Restaurant</h2>
      <RestaurantGrid />
    </section>
  );
}
