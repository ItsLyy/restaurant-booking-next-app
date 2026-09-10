import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";

import type { UrlObject } from "url";

const NAV_BUTTON = "size-9! border-muted! text-muted!";
const DISABLED_BUTTON = `${NAV_BUTTON} opacity-60`;
const PAGE_BUTTON = "size-9!";

interface PaginationProps {
  page: number;
  pages: number;
  buildHref: (page: number) => string | UrlObject;
}

export const Pagination = ({ page, pages, buildHref }: PaginationProps) => {
  if (pages <= 1) return null;

  const previousHref = page > 1 ? buildHref(page - 1) : undefined;
  const nextHref = page < pages ? buildHref(page + 1) : undefined;

  return (
    <div className="flex gap-2 *:shrink-0 *:p-0!">
      {previousHref ? (
        <Button
          as="link"
          variant="outline"
          className={NAV_BUTTON}
          href={previousHref}
          scroll={false}
          aria-label="Previous page"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className={DISABLED_BUTTON}
          disabled
          aria-label="Previous page"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
      )}
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
        <Button
          key={number}
          as="link"
          variant={number === page ? "default" : "outline"}
          className={PAGE_BUTTON}
          href={buildHref(number)}
          scroll={false}
          aria-current={number === page ? "page" : undefined}
        >
          {number}
        </Button>
      ))}
      {nextHref ? (
        <Button
          as="link"
          variant="outline"
          className={NAV_BUTTON}
          href={nextHref}
          scroll={false}
          aria-label="Next page"
        >
          <ArrowRightIcon className="size-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className={DISABLED_BUTTON}
          disabled
          aria-label="Next page"
        >
          <ArrowRightIcon className="size-4" />
        </Button>
      )}
    </div>
  );
};