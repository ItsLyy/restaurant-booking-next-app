import Link from "next/link";

import { Logo } from "@components/general/logo";

export const Footer = () => {
  return (
    <footer className="shrink-0 w-full bg-base-200">
      <div className="max-w-300 w-full mx-auto py-6 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/" className="flex gap-2 items-center">
          <Logo />
          <span className="text-c-header-md text-foreground">
            RES.<span className="text-accent-200">BOOK</span>
          </span>
        </Link>
        <div className="flex flex-col gap-2 items-start sm:items-end">
          <div className="flex w-fit text-c-ref items-center gap-1">
            <Link className="hover:text-accent-100" href="/restaurants">
              Explore
            </Link>
            <span aria-hidden="true">·</span>
            <Link className="hover:text-accent-100" href="/signup">
              For Owners
            </Link>
            <span aria-hidden="true">·</span>
            <span>Privacy</span>
            <span aria-hidden="true">·</span>
            <span>Terms</span>
          </div>
          <span className="text-c-header-md text-foreground">
            &copy; 2026 My Website. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
