import Image from "next/image";

import { Button } from "@components/ui/button";

import heroBanner from "@assets/images/hero-banner.jpg";

export const HeroSection = () => {
  return (
    <section className="flex items-center gap-8 w-full">
      <div className="flex-1 justify-center flex flex-col gap-2">
        <span className="text-c-header-lg text-foreground">
          Your next great meal, one tap away.
        </span>
        <span className="text-c-body">
          Find, book, and enjoy the best restaurants around you.
        </span>
        <div className="mt-8 flex gap-2">
          <Button as="link" href="/restaurants">
            Browse Restaurants
          </Button>
          <Button as="link" href="/signin" variant="outline">
            Sign in to Book
          </Button>
        </div>
      </div>
      <div className="flex-1 items-center">
        <div className="relative aspect-square">
          <Image
            src={heroBanner}
            alt="Hero"
            fill
            sizes="100%"
            className="object-cover rounded-xl"
          />
          <div className="size-30 absolute bottom-0 left-0 bg-base-100 rounded-tr-2xl" />
        </div>
      </div>
    </section>
  );
};
