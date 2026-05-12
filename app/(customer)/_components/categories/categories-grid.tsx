import CategoryCard from "./category-card";

const CategoryGrid = () => {
  return (
    <div className="flex *:shrink-0 overflow-x-scroll scrollbar-hidden gap-3 w-full">
      <CategoryCard
        name={`Traditional Cuisine`}
        image={`/images/categories/traditional_cuisine.jpg`}
      />
      <CategoryCard
        name={`Traditional Cuisine`}
        image={`/images/categories/traditional_cuisine.jpg`}
      />
      <CategoryCard
        name={`Traditional Cuisine`}
        image={`/images/categories/traditional_cuisine.jpg`}
      />
      <CategoryCard
        name={`Traditional Cuisine`}
        image={`/images/categories/traditional_cuisine.jpg`}
      />
      <CategoryCard
        name={`Traditional Cuisine`}
        image={`/images/categories/traditional_cuisine.jpg`}
      />
      <CategoryCard
        name={`Traditional Cuisine`}
        image={`/images/categories/traditional_cuisine.jpg`}
      />
    </div>
  );
};

export default CategoryGrid;
