import type { IRestaurantPhoto } from "@types";
import { SafeImage } from "@components";
import Link from "next/link";

interface MenusProps {
  slug: string;
  name: string;
  menus: Pick<IRestaurantPhoto, "id" | "url">[];
}

export const Menus = ({ slug, name, menus }: MenusProps) => {
  return (
    <div className="w-full h-21.5 flex *:shrink-0 gap-4 overflow-x-scroll scrollbar-hidden scroll-smooth">
      {menus.map((menu, index) => (
        <Link
          key={menu.id}
          href={`/restaurants/${slug}/images/${menu.id}`}
          aria-label={`Open menu of ${name} ${index + 1}`}
          className="w-32 h-21.5 relative overflow-hidden bg-base-200 rounded-2xl"
        >
          <SafeImage
            src={menu.url}
            alt={`Menu of ${name} ${index + 1}`}
            fill
            sizes="128px"
            className="w-full h-full object-cover transition hover:scale-105"
          />
        </Link>
      ))}
    </div>
  );
};