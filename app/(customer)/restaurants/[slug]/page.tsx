import { notFound } from "next/navigation";

import { Breadcrumb } from "./_components/breadcrumb";
import { Photos } from "./_components/photos";
import { Menus } from "./_components/menus";
import { RestaurantInformationHeader } from "./_components/header";
import { Reviews } from "./_components/reviews";
import { BookingAction } from "./_components/booking-action";

import { getRestaurant } from "@data/restaurants/get-restaurant";
import { getRestaurantAvailability } from "@data/restaurants/get-restaurant-availability";
import { getAllRestaurants } from "@data/restaurants/get-all-restaurants";
import { getAuthUser } from "@libs/session";
import { findAccountById } from "@data/auth/users";
import { SITE_URL } from "@libs";

import type { Metadata } from "next";

export const generateStaticParams = async () => {
  const restaurants = await getAllRestaurants();
  return restaurants.map((restaurant) => ({ slug: restaurant.slug }));
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) return {};

  const cover = restaurant.cover;
  return {
    title: restaurant.name,
    description: restaurant.description,
    alternates: {
      canonical: `/restaurants/${slug}`,
    },
    openGraph: {
      type: "website",
      title: restaurant.name,
      description: restaurant.description,
      ...(cover ? { images: [{ url: cover, alt: restaurant.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: restaurant.name,
      description: restaurant.description,
      ...(cover ? { images: [cover] } : {}),
    },
  };
}

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);
  if (!restaurant) notFound();

  const session = await getAuthUser();
  const account = session
    ? await findAccountById(session.userId)
    : undefined;
  const customer = account
    ? {
        firstName: account.firstName,
        lastName: account.lastName,
        avatar: account.avatar,
      }
    : undefined;

  const availability = customer
    ? await getRestaurantAvailability(slug)
    : null;
  const tables = availability?.tables ?? [];
  const slotsByDay = availability?.slotsByDay ?? {};
  const busyTablesByTime = availability?.busyTablesByTime ?? {};

  const averageRating = restaurant.reviews.length
    ? restaurant.reviews.reduce(
        (sum, review) => sum + review.customerRating,
        0,
      ) / restaurant.reviews.length
    : undefined;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Restaurants",
            item: `${SITE_URL}/restaurants`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: restaurant.name,
            item: `${SITE_URL}/restaurants/${restaurant.slug}`,
          },
        ],
      },
      {
        "@type": "Restaurant",
        name: restaurant.name,
        image: [restaurant.cover],
        url: `${SITE_URL}/restaurants/${restaurant.slug}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: restaurant.address,
          addressLocality: restaurant.city,
          addressCountry: restaurant.country,
        },
        ...(restaurant.tags?.length ? { servesCuisine: restaurant.tags } : {}),
        ...(averageRating !== undefined
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: averageRating.toFixed(1),
                reviewCount: restaurant.reviews.length,
              },
            }
          : {}),
        ...(restaurant.lat !== undefined && restaurant.lng !== undefined
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: restaurant.lat,
                longitude: restaurant.lng,
              },
            }
          : {}),
      },
    ],
  };

  const structuredDataHtml = JSON.stringify(structuredData)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <section className="size-full space-y-4">
      <Breadcrumb name={restaurant.name} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataHtml }}
      />
      <div className="flex flex-col lg:flex-row gap-4 h-full w-full">
        <div className="w-full lg:w-104 shrink-0 space-y-6">
          <Photos
            name={restaurant.name}
            slug={slug}
            cover={restaurant.cover}
            coverId={restaurant.coverId}
            photos={restaurant.photos}
            preload
          />
          <BookingAction
            restaurantId={restaurant.id}
            slotsByDay={slotsByDay}
            tables={tables}
            busyTablesByTime={busyTablesByTime}
            customer={
              customer
                ? {
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    avatar: customer.avatar,
                  }
                : undefined
            }
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
          <Menus slug={slug} name={restaurant.name} menus={restaurant.menus} />
          <h2 id="reviews" className="text-c-header-md text-foreground">Reviews</h2>
          <Reviews owner={restaurant.owner} reviews={restaurant.reviews} />
        </div>
      </div>
    </section>
  );
}