import { HeroSection } from "./_components/sections/hero";

import { HowItWorkSection } from "./_components/sections/how-it-work";
import { PopularRestaurantSection } from "./_components/sections/popular-restaurant";
import { CategoriesFoodSection } from "./_components/sections/categories-food";
import { ForYouRestaurantSection } from "./_components/sections/for-you-restaurant";
import { OwnerActionSection } from "./_components/sections/owner-action";

import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "Delicious Dining & Easy Reservations",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RES.BOOK",
    description: "Delicious Dining & Easy Reservations",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorkSection />
      <PopularRestaurantSection />
      <CategoriesFoodSection />
      <ForYouRestaurantSection />
      <OwnerActionSection />
    </>
  );
}
