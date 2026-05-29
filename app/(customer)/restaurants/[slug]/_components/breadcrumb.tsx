import Link from "next/link";

import { HouseSimpleIcon } from "@phosphor-icons/react/dist/ssr";

export const Breadcrumb = ({ name }: { name: string }) => {
  return (
    <span className="flex gap-2 items-center text-c-caption text-foreground">
      <Link href="/">
        <HouseSimpleIcon weight="duotone" className="size-4" />
      </Link>
      /<Link href={`/restaurants`}>Restaurants</Link>/
      <span className="text-muted">{name}</span>
    </span>
  );
};
