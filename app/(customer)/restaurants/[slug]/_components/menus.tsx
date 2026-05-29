import { IRestaurantPhoto } from "@types";
import Image from "next/image";

interface MenusProps {
  menus: Pick<IRestaurantPhoto, "id" | "url">[];
}

export const Menus = ({ menus }: MenusProps) => {
  return (
    <div className="w-full h-21.5 flex *:shrink-0 gap-4 overflow-x-scroll scrollbar-hidden scroll-smooth">
      {menus.map((menu, index) => (
        <div
          key={menu.id}
          className="w-32 h-21.5 relative overflow-hidden bg-base-200 rounded-2xl"
        >
          <Image
            src={menu.url}
            alt={`Menu-${index + 1}`}
            fill
            sizes="100%"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};
