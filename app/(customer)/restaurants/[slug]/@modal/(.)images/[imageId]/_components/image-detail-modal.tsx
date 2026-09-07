"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ArrowSquareOutIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

import { ImageGallery } from "../../../../_components/image-gallery";

import type { IRestaurantPhoto } from "@types";

interface ImageDetailModalProps {
  slug: string;
  restaurantName: string;
  images: IRestaurantPhoto[];
  initialIndex: number;
}

export const ImageDetailModal = ({
  slug,
  restaurantName,
  images,
  initialIndex,
}: ImageDetailModalProps) => {
  const router = useRouter();

  const close = useCallback(() => {
    const index = (window.history.state as { idx?: number } | null)?.idx;
    if (typeof index === "number" && index > 0) {
      router.back();
    } else {
      router.push(`/restaurants/${slug}`);
    }
  }, [router, slug]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [close]);

  const currentImage = images[initialIndex];
  if (!currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photos of ${restaurantName}`}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="min-h-full w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-c-body text-base-100 truncate">{restaurantName}</p>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/restaurants/${slug}/images/${currentImage.id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open image in a new tab"
              className="size-11 flex items-center justify-center rounded-full bg-base-100 border border-base-200 text-foreground hover:text-accent-200 cursor-pointer"
            >
              <ArrowSquareOutIcon
                weight="bold"
                className="size-5"
                aria-hidden="true"
              />
            </a>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="size-11 flex items-center justify-center rounded-full bg-base-100 border border-base-200 text-foreground hover:text-accent-200 cursor-pointer"
            >
              <XIcon weight="bold" className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ImageGallery
          slug={slug}
          restaurantName={restaurantName}
          images={images}
          initialIndex={initialIndex}
        />
      </div>
    </div>
  );
};
