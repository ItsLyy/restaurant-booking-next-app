import { notFound } from "next/navigation";

import { ImageDetailModal } from "./_components/image-detail-modal";

import { getRestaurantImage } from "@data/restaurants/get-restaurant-image";

export default async function InterceptedImageDetailPage({
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

  return (
    <ImageDetailModal
      key={imageId}
      slug={gallery.restaurant.slug}
      restaurantName={gallery.restaurant.name}
      images={gallery.images}
      initialIndex={initialIndex}
    />
  );
}