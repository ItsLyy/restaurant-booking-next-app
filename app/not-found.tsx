import Link from "next/link";

import { Button } from "@components/ui/button";
import { Logo } from "@components/general/logo";

export default function NotFound() {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center gap-6 px-4">
      <Link href="/" className="flex gap-2 items-center">
        <Logo />
        <span className="text-c-header-md text-foreground">
          RES.<span className="text-accent-200">BOOK</span>
        </span>
      </Link>
      <h1 className="text-c-header-lg text-foreground text-center">
        Page not found
      </h1>
      <p className="text-c-body text-muted text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button as="link" href="/restaurants">
        Explore restaurants
      </Button>
    </main>
  );
}