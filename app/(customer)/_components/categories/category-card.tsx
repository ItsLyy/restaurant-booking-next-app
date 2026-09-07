import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
}

const CategoryCard = ({ name, slug, image }: CategoryCardProps) => {
  return (
    <Link
      href={`/restaurants?category=${slug}`}
      className="relative w-40.75 h-30 rounded-xl overflow-hidden cursor-pointer group block"
    >
      <Image
        src={image}
        alt={name}
        className="object-cover object-center bg-base-200 text-transparent group-hover:scale-105 transition-transform ease-in-out duration-300 scroll-smooth"
        fill
        sizes="163px"
      />
      <div className="size-full p-3 bg-black/60 flex items-end absolute top-0 left-0 right-0 bottom-0">
        <span className="w-[50%] inline-block text-c-normal text-base-100">
          {name}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
