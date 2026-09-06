import CategoryCard from "./category-card";

import type { ICategoryListItem } from "@types";

interface CategoryGridProps {
  categories: ICategoryListItem[];
}

const CategoryGrid = ({ categories }: CategoryGridProps) => {
  return (
    <div className="flex *:shrink-0 overflow-x-scroll scrollbar-hidden gap-3 w-full">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          name={category.name}
          image={category.image}
        />
      ))}
    </div>
  );
};

export default CategoryGrid;