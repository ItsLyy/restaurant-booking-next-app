import CategoryCardSkeleton from "./category-card.skeleton";

const CategoryGridSkeleton = () => {
  return (
    <div className="flex *:shrink-0 overflow-x-scroll scrollbar-hidden gap-3 w-full animate-pulse">
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
      <CategoryCardSkeleton />
    </div>
  );
};

export default CategoryGridSkeleton;