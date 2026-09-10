import { HeroSection } from "./_components/sections/hero";

import { HowItWorkSection } from "./_components/sections/how-it-work";
import { PopularRestaurantSection } from "./_components/sections/popular-restaurant";
import { CategoriesFoodSection } from "./_components/sections/categories-food";
import { ForYouRestaurantSection } from "./_components/sections/for-you-restaurant";
import { OwnerActionSection } from "./_components/sections/owner-action";

import { SITE_URL } from "@libs";

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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "RES.BOOK",
      url: `${SITE_URL}/`,
      description: "Delicious dining and easy reservations, one tap away.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/restaurants?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "RES.BOOK",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/icon.png`,
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection />
      <HowItWorkSection />
      <PopularRestaurantSection />
      <CategoriesFoodSection />
      <ForYouRestaurantSection />
      <OwnerActionSection />
    </>
  );
}
