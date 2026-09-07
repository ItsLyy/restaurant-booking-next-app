import Image from "next/image";
import Link from "next/link";

import type { IRestaurantPhoto } from "@types";

type ImageProps = Pick<IRestaurantPhoto, "url" | "id">;

interface PhotosProps {
  cover: string;
  coverId: string;
  photos: ImageProps[];
  slug: string;
  name: string;
  priority?: boolean;
}

export const Photos = ({
  cover,
  coverId,
  photos,
  slug,
  name,
  priority = false,
}: PhotosProps) => {
  return (
    <div className="space-y-4">
      <Link
        href={`/restaurants/${slug}/images/${coverId}`}
        aria-label={`Open photos of ${name}`}
        className="relative block w-full h-56 sm:h-67 rounded-2xl overflow-hidden bg-base-200"
      >
        <Image
          src={cover}
          alt={`Photo of ${name}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 416px, 100vw"
          className="text-transparent object-cover object-center transition hover:scale-105"
        />
      </Link>
      <div className="grid grid-cols-3 gap-4 h-21.5">
        {photos.map((photo, index) => {
          if (index === 2)
            return (
              <PhotoOtherLink
                key={photo.id}
                alt={`More photos of ${name}`}
                photo={photo}
                totalPhotos={photos.length - 2}
                slug={slug}
              />
            );
          return (
            <Link
              key={photo.id}
              href={`/restaurants/${slug}/images/${photo.id}`}
              aria-label={`Open photo ${index + 1} of ${name}`}
              className="relative w-full rounded-2xl overflow-hidden bg-base-200"
            >
              <Image
                src={photo.url}
                alt={`Photo of ${name} ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 128px, 33vw"
                className="text-transparent object-cover object-center transition hover:scale-105"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const PhotoOtherLink = ({
  photo,
  totalPhotos,
  alt,
  slug,
}: {
  photo: ImageProps;
  totalPhotos: number;
  alt: string;
  slug: string;
}) => {
  return (
    <Link
      href={`/restaurants/${slug}/images/${photo.id}`}
      className="relative w-full rounded-2xl overflow-hidden bg-base-200"
    >
      <Image
        src={photo.url}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 128px, 33vw"
        className="text-transparent object-cover object-center transition hover:scale-105"
      />
      <div className="size-full absolute top-0 left-0 bottom-0 right-0 bg-black/60 flex justify-center items-center">
        <span className="text-base-100 text-c-body">{totalPhotos}+</span>
      </div>
    </Link>
  );
};
