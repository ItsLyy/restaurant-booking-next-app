import Image from "next/image";

import { StarIcon } from "@phosphor-icons/react/dist/ssr";

import { formatPrice } from "@utils";

interface RestaurantCardProps {
  name: string;
  image: string;
  rating: number;
  minPrice: number;
  maxPrice?: number;
}

const RestaurantCard = ({
  name,
  image,
  rating,
  minPrice,
  maxPrice = 0,
}: RestaurantCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative w-full aspect-[3/2] overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          loading="eager"
          className="group-hover:scale-105 transition-transform ease-in-out duration-300 bg-base-200"
        />
      </div>
      <div className="px-1 py-2.5 space-y-1">
        <span className="text-c-normal text-foreground">{name}</span>
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2 text-c-ref">
            <StarIcon weight="duotone" className="text-muted" />
            <span className="text-muted">{rating}</span>
          </div>
          <span className="text-[13px] font-medium text-foreground">
            {formatPrice(minPrice)}{" "}
            {maxPrice > 0 && ` ~ ${formatPrice(maxPrice)}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
