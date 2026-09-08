"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useEffectEvent } from "react";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

import type { IRestaurantPhoto } from "@types";
import Link from "next/link";

const imageHref = (slug: string, imageId: string) =>
  `/restaurants/${slug}/images/${imageId}`;

interface ImageGalleryProps {
  slug: string;
  restaurantName: string;
  images: IRestaurantPhoto[];
  initialIndex: number;
}

const getThumbnailUrl = (url: string) => url.replace(/\?w=\d+/, "?w=240");

export const ImageGallery = ({
  slug,
  restaurantName,
  images,
  initialIndex,
}: ImageGalleryProps) => {
  const router = useRouter();
  const index = initialIndex;

  const image = images[index];
  const count = images.length;

  const goTo = useCallback(
    (nextIndex: number) => {
      const target = images[nextIndex];
      if (!target) return;
      router.push(imageHref(slug, target.id), { scroll: false });
    },
    [images, router, slug],
  );

  const navigateFromKey = useEffectEvent((nextIndex: number) => {
    goTo(nextIndex);
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") navigateFromKey(index - 1);
      if (event.key === "ArrowRight") navigateFromKey(index + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index]);

  if (!image) return null;

  const alt =
    image.type === "menu"
      ? `Menu of ${restaurantName}`
      : `Photo of ${restaurantName}`;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative w-full h-96 sm:h-128 rounded-2xl overflow-hidden bg-base-200 flex items-center justify-center">
        <Image
          key={image.url}
          src={image.url}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 960px, 100vw"
          className="text-transparent object-contain object-center rise-in"
          preload
        />
        {index > 0 && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 size-11 flex items-center justify-center rounded-full bg-base-100/80 backdrop-blur text-foreground border border-base-200 hover:bg-base-100 cursor-pointer"
          >
            <CaretLeftIcon
              weight="bold"
              className="size-5"
              aria-hidden="true"
            />
          </button>
        )}
        {index < count - 1 && (
          <button
            type="button"
            aria-label="Next image"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-11 flex items-center justify-center rounded-full bg-base-100/80 backdrop-blur text-foreground border border-base-200 hover:bg-base-100 cursor-pointer"
          >
            <CaretRightIcon
              weight="bold"
              className="size-5"
              aria-hidden="true"
            />
          </button>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-base-100/90 backdrop-blur px-2.5 py-1 text-c-caption text-foreground">
          {index + 1} / {count}
        </span>
      </div>
      <ul className="flex gap-2 overflow-x-scroll scrollbar-hidden w-full">
        {images.map((item, itemIndex) => (
          <li key={item.id} className="shrink-0">
            <Link
              href={imageHref(slug, item.id)}
              aria-label={`${alt} ${itemIndex + 1}`}
              aria-current={item.id === image.id}
              className={`relative block size-16 rounded-xl transition-all ease-in-out duration-300 ${
                item.id === image.id
                  ? "opacity-100"
                  : "opacity-20 hover:opacity-50 hover:ring-1 hover:ring-accent-100/50"
              }`}
            >
              <span className="size-full absolute inset-0 rounded-xl overflow-hidden bg-base-200">
                <Image
                  src={getThumbnailUrl(item.url)}
                  alt=""
                  fill
                  sizes="64px"
                  className="text-transparent object-cover object-center"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
