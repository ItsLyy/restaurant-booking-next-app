import Link from "next/link";
import { MapPinIcon, StarIcon, TagIcon } from "@phosphor-icons/react/dist/ssr";
import { SafeImage } from "@components";
import { formatPrice } from "@utils";

interface RestaurantCardProps {
  slug: string;
  name: string;
  image: string;
  rating: number;
  minPrice: number;
  maxPrice?: number;
  city?: string;
  discount?: number;
  tags?: string[];
}

const RestaurantCard = ({
  slug,
  name,
  image,
  rating,
  minPrice,
  maxPrice = 0,
  city,
  discount,
}: RestaurantCardProps) => {
  return (
    <Link
      href={`/restaurants/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-muted/50 bg-base-100 shadow-2xs hover:border-accent-200/60 transition-colors"
    >
      <div className="relative w-full aspect-3/2 overflow-hidden bg-base-200">
        <SafeImage
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="group-hover:scale-105 transition-transform duration-300 ease-out object-cover object-center"
        />

        {/* Discount Badge if available */}
        {discount && discount > 0 ? (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-100 text-base-100 text-[11px] font-semibold shadow-xs">
            <TagIcon weight="bold" className="size-3" />
            <span>{discount}% OFF</span>
          </div>
        ) : null}

        {/* Rating Floating Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-base-100/90 backdrop-blur-xs text-foreground text-xs font-semibold shadow-xs">
          <StarIcon weight="fill" className="size-3.5 text-amber-500" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col justify-between grow gap-2">
        <div className="space-y-1">
          <h3 className="font-playfair-display font-semibold text-base text-foreground group-hover:text-accent-100 transition-colors line-clamp-1">
            {name}
          </h3>

          {city && (
            <div className="flex items-center gap-1 text-xs text-muted">
              <MapPinIcon className="size-3 text-muted shrink-0" />
              <span className="truncate">{city}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-muted/20 flex items-center justify-between text-xs">
          <span className="text-muted">From</span>
          <span className="font-semibold text-foreground">
            {formatPrice(minPrice)}
            {maxPrice > 0 && ` ~ ${formatPrice(maxPrice)}`}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;

