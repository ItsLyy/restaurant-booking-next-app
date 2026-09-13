import Link from "next/link";

import { Button } from "@components/ui/button";
import { Logo } from "@components/general/logo";

export default function DashboardNotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
      <Link href="/dashboard" className="flex gap-2 items-center">
        <Logo />
        <span className="text-d-header-md text-foreground">
          RES.<span className="text-accent-200">BOOK</span>
        </span>
      </Link>
      <h1 className="text-d-header-lg text-foreground text-center">
        Page not found
      </h1>
      <p className="text-d-body text-muted text-center">
        The dashboard page you are looking for does not exist or has been
        moved.
      </p>
      <Button as="link" href="/dashboard">
        Back to dashboard
      </Button>
    </div>
  );
}