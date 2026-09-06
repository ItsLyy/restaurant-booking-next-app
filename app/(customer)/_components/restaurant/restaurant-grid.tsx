import RestaurantCard from "./restaurant-card";

const RestaurantGrid = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <RestaurantCard
        name="Gajah Mada"
        image="/images/restaurants/01/banners/main_banner.jpg"
        rating={4.5}
        minPrice={20000}
        maxPrice={0}
      />
      <RestaurantCard
        name="Gajah Mada"
        image="/images/restaurants/01/banners/main_banner.jpg"
        rating={4.5}
        minPrice={20000}
        maxPrice={250000}
      />
      <RestaurantCard
        name="Gajah Mada"
        image="/images/restaurants/01/banners/main_banner.jpg"
        rating={4.5}
        minPrice={200000}
        maxPrice={0}
      />
    </div>
  );
};

export default RestaurantGrid;
