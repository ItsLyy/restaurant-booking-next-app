import Link from "next/link";
import { SafeImage } from "@components";

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
}

const CategoryCard = ({ name, slug, image }: CategoryCardProps) => {
  return (
    <Link
      href={`/restaurants?category=${slug}`}
      className="relative w-44 h-32 rounded-2xl overflow-hidden cursor-pointer group block shrink-0 shadow-2xs"
    >
      <SafeImage
        src={image}
        alt={name}
        className="object-cover object-center bg-base-200 text-transparent group-hover:scale-108 transition-transform duration-300 ease-out"
        fill
        sizes="176px"
      />
      <div className="size-full p-3.5 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex items-end absolute inset-0">
        <span className="text-sm font-semibold text-base-100 tracking-wide drop-shadow-xs group-hover:translate-x-0.5 transition-transform duration-200">
          {name}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
