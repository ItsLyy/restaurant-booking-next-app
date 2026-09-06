import Image from "next/image";

interface CategoryCardProps {
  name: string;
  image: string;
}

const CategoryCard = ({ name, image }: CategoryCardProps) => {
  return (
    <div className="relative w-40.75 h-30 rounded-xl overflow-hidden cursor-pointer group">
      <Image
        src={image}
        alt={name}
        className="bg-base-200 text-transparent group-hover:scale-105 transition-transform ease-in-out duration-300 scroll-smooth"
        fill
        sizes="100%"
      />
      <div className="size-full p-3 bg-black/60 flex items-end absolute top-0 left-0 right-0 bottom-0">
        <span className="w-[50%] inline-block text-c-normal text-base-100">
          {name}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
