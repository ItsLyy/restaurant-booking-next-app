"use client";

import Link from "next/link";

import { Button } from "@components/ui/button";
import { Logo } from "@components/general/logo";

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="min-h-svh flex flex-col items-center justify-center gap-6 px-4">
      <Link href="/" className="flex gap-2 items-center">
        <Logo />
        <span className="text-c-header-md text-foreground">
          RES.<span className="text-accent-200">BOOK</span>
        </span>
      </Link>
      <h1 className="text-c-header-lg text-foreground text-center">
        Something went wrong
      </h1>
      <p className="text-c-body text-muted text-center">
        An unexpected error occurred. Please try again.
      </p>
      <Button as="button" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}