import Image from "next/image";
import Link from "next/link";

import type { IRestaurantPhoto } from "@types";

type ImageProps = Pick<IRestaurantPhoto, "url" | "id">;

interface PhotosProps {
  cover: string;
  photos: ImageProps[];
  slug: string;
  name: string;
}

export const Photos = ({ cover, photos, slug, name }: PhotosProps) => {
  return (
    <div className="space-y-4">
      <div className="relative w-full h-67 rounded-2xl overflow-hidden bg-base-200">
        <Image
          src={cover}
          alt={`cover-${name}`}
          fill
          sizes="416px"
          className="text-transparent object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 h-21.5">
        {photos.map((photo, index) => {
          if (index === 2)
            return (
              <PhotoOtherLink
                key={photo.id}
                alt={`cover-${name}-${index + 1}`}
                photo={photo}
                totalPhotos={photos.length - 2}
                slug={slug}
              />
            );
          return (
            <div
              key={photo.id}
              className="relative w-full rounded-2xl overflow-hidden bg-base-200"
            >
              <Image
                src={photo.url}
                alt={`cover-${name}-${index + 1}`}
                fill
                sizes="416px"
                className="text-transparent object-cover object-center"
              />
            </div>
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
      href={`/restaurants/${slug}/images/${photo.url}`}
      className="relative w-full rounded-2xl overflow-hidden bg-base-200"
    >
      <Image
        src={photo.url}
        alt={alt}
        fill
        sizes="416px"
        className="text-transparent object-cover object-center"
      />
      <div className="size-full absolute top-0 left-0 bottom-0 right-0 bg-black/60 flex justify-center items-center">
        <span className="text-base-100 text-c-body">{totalPhotos}+</span>
      </div>
    </Link>
  );
};
