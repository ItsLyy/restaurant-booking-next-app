import Link from "next/link";

import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

const NAV_BUTTON =
  "grid place-items-center size-9 rounded-full border border-muted bg-base-200 text-foreground transition-colors hover:border-accent-200/70 hover:text-accent-100";

const PAGE_BUTTON =
  "grid place-items-center min-w-9 h-9 px-2.5 rounded-full border text-c-caption font-semibold transition-colors";

const IDLE_PAGE =
  "border-muted bg-base-200 text-foreground hover:border-accent-200/70 hover:text-accent-100";

const ACTIVE_PAGE = "border-accent-100 bg-accent-100 text-base-100";

const ELLIPSIS = "grid place-items-center min-w-9 h-9 text-c-caption text-muted";

interface PaginationProps {
  page: number;
  pages: number;
  buildPageHref: (page: number) => string;
}

const getPageItems = (page: number, pages: number): (number | null)[] => {
  if (pages <= 7) {
    return Array.from({ length: pages }, (_, index) => index + 1);
  }

  const siblings = 1;
  const left = Math.max(1, page - siblings);
  const right = Math.min(pages, page + siblings);

  const items: (number | null)[] = [];
  if (left > 1) {
    items.push(1);
    if (left > 2) items.push(null);
  }
  for (let value = left; value <= right; value += 1) items.push(value);
  if (right < pages) {
    if (right < pages - 1) items.push(null);
    items.push(pages);
  }
  return items;
};

export const Pagination = ({ page, pages, buildPageHref }: PaginationProps) => {
  if (pages <= 1) return null;

  const previousHref = page > 1 ? buildPageHref(page - 1) : null;
  const nextHref = page < pages ? buildPageHref(page + 1) : null;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {previousHref ? (
        <Link
          href={previousHref}
          aria-label="Previous page"
          className={NAV_BUTTON}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className={`${NAV_BUTTON} pointer-events-none opacity-40`}
        >
          <ArrowLeftIcon className="size-4" />
        </span>
      )}

      {getPageItems(page, pages).map((item, index) =>
        item === null ? (
          <span key={`ellipsis-${index}`} aria-hidden="true" className={ELLIPSIS}>
            &#8230;
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className={`${PAGE_BUTTON} ${ACTIVE_PAGE}`}
          >
            {item}
          </span>
        ) : (
          <Link key={item} href={buildPageHref(item)} className={`${PAGE_BUTTON} ${IDLE_PAGE}`}>
            {item}
          </Link>
        ),
      )}

      {nextHref ? (
        <Link href={nextHref} aria-label="Next page" className={NAV_BUTTON}>
          <ArrowRightIcon className="size-4" />
        </Link>
      ) : (
        <span
          aria-hidden="true"
          className={`${NAV_BUTTON} pointer-events-none opacity-40`}
        >
          <ArrowRightIcon className="size-4" />
        </span>
      )}
    </nav>
  );
};