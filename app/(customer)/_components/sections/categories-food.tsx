import { Suspense } from "react";

import CategoryGrid from "../categories/categories-grid";
import CategoryGridSkeleton from "../categories/categories-grid.skeleton";

import { getCategories } from "@data/categories/get-categories";

const Categories = async () => {
  const categories = await getCategories();
  return <CategoryGrid categories={categories} />;
};

export const CategoriesFoodSection = () => {
  return (
    <section className="p-2">
      <Suspense fallback={<CategoryGridSkeleton />}>
        <Categories />
      </Suspense>
    </section>
  );
};