import Image from "next/image";

import { Button } from "@components/ui/button";

import heroBanner from "@assets/images/hero-banner.jpg";

export const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 w-full">
      <div className="flex-1 justify-center flex flex-col gap-2">
        <h1 className="text-c-header-lg text-foreground">
          Your next great meal, one tap away.
        </h1>
        <p className="text-c-body">
          Find, book, and enjoy the best restaurants around you.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-2">
          <Button as="link" href="/restaurants">
            Browse Restaurants
          </Button>
          <Button as="link" href="/signin" variant="outline">
            Sign in to Book
          </Button>
        </div>
      </div>
      <div className="w-full md:flex-1">
        <div className="relative aspect-[3/2] w-full">
          <Image
            src={heroBanner}
            alt="Dining table with a meal"
            fill
            preload
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover rounded-xl"
          />
          <div className="size-30 absolute bottom-0 left-0 bg-base-100 rounded-tr-2xl" />
        </div>
      </div>
    </section>
  );
};
