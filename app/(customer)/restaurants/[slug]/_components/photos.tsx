import Image from "next/image";
import Link from "next/link";

interface ImageProps {
  url: string;
  alt: string;
}

interface PhotosProps {
  banner: ImageProps;
  photos: ImageProps[];
  slug: string;
}

export const Photos = ({ banner, photos, slug }: PhotosProps) => {
  return (
    <div className="space-y-4">
      <div className="relative w-full h-67 rounded-2xl overflow-hidden bg-base-200">
        <Image
          src={banner.url}
          alt={banner.alt}
          fill
          sizes="416px"
          className="text-transparent"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 h-21.5">
        {photos.map((photo, index) => {
          if (index === 2)
            return (
              <PhotoOtherLink
                key={index}
                photo={photo}
                totalPhotos={photos.length - 2}
                slug={slug}
              />
            );
          return (
            <div
              key={index}
              className="relative w-full rounded-2xl overflow-hidden bg-base-200"
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="416px"
                className="text-transparent"
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
  slug,
}: {
  photo: ImageProps;
  totalPhotos: number;
  slug: string;
}) => {
  return (
    <Link
      href={`/restaurants/${slug}/images/${photo.url}`}
      className="relative w-full rounded-2xl overflow-hidden bg-base-200"
    >
      <Image
        src={photo.url}
        alt={photo.alt}
        fill
        sizes="416px"
        className="text-transparent"
      />
      <div className="size-full absolute top-0 left-0 bottom-0 right-0 bg-black/60 flex justify-center items-center">
        <span className="text-base-100 text-c-body">{totalPhotos}+</span>
      </div>
    </Link>
  );
};
