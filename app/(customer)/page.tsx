import { HeroSection } from "./_components/sections/hero";

import { HowItWorkSection } from "./_components/sections/how-it-work";
import { PopularRestaurantSection } from "./_components/sections/popular-restaurant";
import { CategoriesFoodSection } from "./_components/sections/categories-food";
import { ForYouRestaurantSection } from "./_components/sections/for-you-restaurant";
import { OwnerActionSection } from "./_components/sections/owner-action";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "RES.BOOK",
  },
  description: "Delicious dining and easy reservations, one tap away.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RES.BOOK",
    description: "Delicious dining and easy reservations, one tap away.",
  },
  twitter: {
    title: "RES.BOOK",
    description: "Delicious dining and easy reservations, one tap away.",
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
