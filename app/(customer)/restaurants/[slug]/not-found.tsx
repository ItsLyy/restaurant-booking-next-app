import { Button } from "@components/ui/button";

export default function RestaurantNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-20">
      <h1 className="text-c-header-lg text-foreground text-center">
        Restaurant not found
      </h1>
      <p className="text-c-body text-muted text-center">
        The restaurant you are looking for does not exist or is no longer
        available.
      </p>
      <Button as="link" href="/restaurants">
        Explore restaurants
      </Button>
    </div>
  );
}