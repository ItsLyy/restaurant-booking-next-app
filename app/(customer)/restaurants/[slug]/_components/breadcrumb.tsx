import Link from "next/link";

import { HouseSimpleIcon } from "@phosphor-icons/react/dist/ssr";

export const Breadcrumb = ({ name }: { name: string }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex gap-2 items-center text-c-caption text-foreground">
        <li>
          <Link href="/" aria-label="Home">
            <HouseSimpleIcon weight="duotone" className="size-4" />
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/restaurants">Restaurants</Link>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="text-muted">
          {name}
        </li>
      </ol>
    </nav>
  );
};