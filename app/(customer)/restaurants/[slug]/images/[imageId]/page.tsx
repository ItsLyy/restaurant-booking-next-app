import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { ImageGallery } from "../../_components/image-gallery";

import { getRestaurantImage } from "@data/restaurants/get-restaurant-image";
import restaurantPhotos from "@data/dummy/restaurant_photos.json";
import restaurants from "@data/dummy/restaurants.json";

export const generateStaticParams = async () => {
  const params: { slug: string; imageId: string }[] = [];
  for (const restaurant of restaurants) {
    for (const photo of restaurantPhotos) {
      if (photo.restaurantId === restaurant.id) {
        params.push({ slug: restaurant.slug, imageId: photo.id });
      }
    }
  }
  return params;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; imageId: string }>;
}): Promise<Metadata> {
  const { slug, imageId } = await params;
  const gallery = await getRestaurantImage(slug, imageId);
  if (!gallery) return {};

  const label = gallery.image.type === "menu" ? "Menu" : "Photo";
  const title = `${gallery.restaurant.name} - ${label}`;
  const description =
    gallery.image.type === "menu"
      ? `View the menu of ${gallery.restaurant.name}.`
      : `Browse photos of ${gallery.restaurant.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/restaurants/${slug}/images/${imageId}`,
    },
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: gallery.image.url, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [gallery.image.url],
    },
  };
}

export default async function ImageDetailPage({
  params,
}: {
  params: Promise<{ slug: string; imageId: string }>;
}) {
  const { slug, imageId } = await params;
  const gallery = await getRestaurantImage(slug, imageId);
  if (!gallery) notFound();

  const initialIndex = Math.max(
    gallery.images.findIndex((item) => item.id === imageId),
    0,
  );
  const restaurantHref = `/restaurants/${gallery.restaurant.slug}`;

  return (
    <section className="size-full flex flex-col gap-4">
      <h1 className="sr-only">
        {gallery.image.type === "menu"
          ? `Menu of ${gallery.restaurant.name}`
          : `Photo of ${gallery.restaurant.name}`}
      </h1>
      <Link
        href={restaurantHref}
        className="inline-flex items-center gap-1 w-fit text-c-body text-muted hover:text-accent-100"
      >
        <CaretLeftIcon weight="bold" className="size-4" aria-hidden="true" />
        Back to {gallery.restaurant.name}
      </Link>
      <ImageGallery
        key={imageId}
        slug={gallery.restaurant.slug}
        restaurantName={gallery.restaurant.name}
        images={gallery.images}
        initialIndex={initialIndex}
      />
      <p className="text-c-body text-muted">
        {gallery.image.type === "menu"
          ? `Menus of ${gallery.restaurant.name}`
          : `Photos of ${gallery.restaurant.name}`}
      </p>
    </section>
  );
}