import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  MartiniIcon,
  StarIcon,
  TagIcon,
} from "@phosphor-icons/react/dist/ssr";

import { formatPrice } from "@utils";

import type { IRestaurantListItem } from "@types";

type RestaurantItemProps = Omit<
  IRestaurantListItem,
  "id" | "description" | "tags"
>;

export const RestaurantItem = ({
  name,
  slug,
  image,
  shortDescription,
  rating,
  address,
  minPrice,
  maxPrice,
  discount,
}: RestaurantItemProps) => {
  return (
    <Link href={`/restaurants/${slug}`} className="flex gap-6 w-full group">
      <div className="relative w-71.75 h-48 shrink-0 rounded-2xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="100%"
          className="object-cover size-full rounded-2xl bg-base-200 text-transparent group-hover:scale-105 transition-transform ease-in-out duration-300"
        />
      </div>
      <div className="flex justify-between p-2 grow">
        <div className="flex flex-col gap-4">
          <div className="text-c-body flex flex-col gap-2 text-muted w-76">
            <span className="text-c-header-md text-foreground line-clamp-2 text-ellipsis">
              {name}
            </span>
            <div className="flex">
              <MapPinIcon size={20} weight="duotone" className="shrink-0" />
              <span className="ml-2 leading-tight py-0 line-clamp-2 text-ellipsis">
                {address}
              </span>
            </div>
            {shortDescription && (
              <div className="flex">
                <MartiniIcon size={20} weight="duotone" className="shrink-0" />
                <span className="ml-2 leading-tight line-clamp-2 text-ellipsis">
                  {shortDescription}
                </span>
              </div>
            )}
          </div>
          {discount && (
            <div className="rounded-lg bg-positive/20 text-positive py-2 px-3 flex size-fit items-center">
              <TagIcon size={16} weight="duotone" className="shrink-0" />
              <span className="ml-2 text-c-button leading-tight">
                Up to -{discount}%
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="flex items-center gap-1 text-muted">
            <StarIcon size={24} weight="duotone" />
            <span className="text-c-body font-medium">{rating}</span>
          </div>
          <span className="text-c-body text-foreground">
            {formatPrice(minPrice)}
            {maxPrice && `~${formatPrice(maxPrice)}`}
          </span>
        </div>
      </div>
    </Link>
  );
};
