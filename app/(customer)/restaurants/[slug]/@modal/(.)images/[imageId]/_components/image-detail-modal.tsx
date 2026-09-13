"use client";

import { useCallback, useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => {
    const index = (window.history.state as { idx?: number } | null)?.idx;
    if (typeof index === "number" && index > 0) {
      router.back();
    } else {
      router.push(`/restaurants/${slug}`);
    }
  }, [router, slug]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();

    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) close();
    };

    dialog.addEventListener("click", onBackdropClick);
    return () => dialog.removeEventListener("click", onBackdropClick);
  }, [close]);

  const currentImage = images[initialIndex];
  if (!currentImage) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Photos of ${restaurantName}`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      className="inset-0 m-auto size-full max-w-none max-h-none bg-transparent p-0 [&::backdrop]:bg-black/80 [&::backdrop]:backdrop-blur-sm"
    >
      <div className="size-full min-h-0 overflow-y-auto">
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
    </dialog>
  );
};