import Link from "next/link";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";

import { Button, Logo } from "@components";

export const Header = () => {
  return (
    <header className="w-full sticky top-0 left-0 bg-base-100 z-20">
      <nav className="w-full max-w-300 mx-auto p-4 flex justify-between">
        <Link href="/" className="flex gap-2 items-center">
          <Logo />
          <span className="text-c-header-md text-foreground">
            RES.<span className="text-accent-200">BOOK</span>
          </span>
        </Link>
        <div className="flex gap-2">
          <Button
            as="link"
            href="/restaurants?search="
            variant="outline"
            className="size-11 p-0! border! flex justify-center items-center"
          >
            <MagnifyingGlassIcon weight="duotone" className="size-5" />
          </Button>
          <Button
            as="link"
            href="/bookings"
            variant="outline"
            className="h-full py-0!"
          >
            Bookings
          </Button>
          <Button as="link" href="/signin" className="h-full py-0!">
            Sign in
          </Button>
        </div>
      </nav>
    </header>
  );
};
