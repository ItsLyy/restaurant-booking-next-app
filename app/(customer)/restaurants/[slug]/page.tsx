import { Breadcrumb } from "./_components/breadcrumb";
import { Photos } from "./_components/photos";
import { Menus } from "./_components/menus";
import { RestaurantInformationHeader } from "./_components/header";
import { Reviews } from "./_components/reviews";

import { getRestaurant } from "@data/restaurants/get-restaurant";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) return null;

  return (
    <section className="size-full space-y-4">
      <Breadcrumb name={restaurant.name} />
      <div className="flex gap-4 h-full w-full">
        <div className="w-104 shrink-0 space-y-6">
          <Photos
            name={restaurant.name}
            slug={slug}
            cover={restaurant.cover}
            photos={restaurant.photos}
          />
        </div>
        <div className="w-full flex flex-col grow-0 p-2 gap-4 overflow-hidden">
          <RestaurantInformationHeader
            name={restaurant.name}
            address={restaurant.address}
            city={restaurant.city}
            country={restaurant.country}
            shortDescription={restaurant.shortDescription}
          />
          <p className="text-c-body">{restaurant.description}</p>
          <h2 className="text-c-header-md text-foreground">Menus</h2>
          <Menus menus={restaurant.menus} />
          <h2 className="text-c-header-md text-foreground">Reviews</h2>
          <Reviews owner={restaurant.owner} reviews={restaurant.reviews} />
        </div>
      </div>
    </section>
  );
}
