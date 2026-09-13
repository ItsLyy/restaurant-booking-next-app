import Link from "next/link";
import { XIcon } from "@phosphor-icons/react/dist/ssr";

import { buildRestaurantsHref } from "@libs";

import type { ICategoryListItem } from "@types";
import type { PriceBucket } from "@data/restaurants/get-price-buckets";
import type { RestaurantQuery } from "@libs";

interface ActiveFiltersProps {
  query: RestaurantQuery;
  searchParams: Record<string, string | string[] | undefined>;
  categories: ICategoryListItem[];
  buckets: PriceBucket[];
}

const formatCompact = (value: number): string =>
  value >= 1000 ? `${Math.round(value / 1000)}K` : String(value);

export const ActiveFilters = ({
  query,
  searchParams,
  categories,
  buckets,
}: ActiveFiltersProps) => {
  const chips: { key: string; label: string; href: string }[] = [];

  if (query.search) {
    chips.push({
      key: "search",
      label: `Search: "${query.search}"`,
      href: buildRestaurantsHref(searchParams, { search: undefined }),
    });
  }

  if (query.category) {
    const category = categories.find((item) => item.slug === query.category);
    chips.push({
      key: "category",
      label: category ? category.name : query.category,
      href: buildRestaurantsHref(searchParams, { category: undefined }),
    });
  }

  if (query.pmin !== undefined || query.pmax !== undefined) {
    const bucket = buckets.find(
      (item) => item.min === query.pmin && item.max === query.pmax,
    );
    chips.push({
      key: "price",
      label: bucket
        ? `${formatCompact(bucket.min)} – ${formatCompact(bucket.max)}`
        : "Custom price",
      href: buildRestaurantsHref(searchParams, {
        pmin: undefined,
        pmax: undefined,
      }),
    });
  }

  if (query.minRating !== undefined) {
    chips.push({
      key: "rating",
      label: `${query.minRating} & up`,
      href: buildRestaurantsHref(searchParams, { minRating: undefined }),
    });
  }

  if (query.hasDiscount) {
    chips.push({
      key: "discount",
      label: "Has discount",
      href: buildRestaurantsHref(searchParams, { discount: undefined }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-muted/30 pt-3">
      <span className="text-c-caption text-muted">Active filters:</span>
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          scroll={false}
          className="flex items-center gap-1.5 rounded-full border border-accent-100/30 bg-accent-200/5 py-1 pl-3 pr-2 text-c-button text-accent-100 transition-colors hover:border-accent-100 hover:bg-accent-200/10"
        >
          {chip.label}
          <XIcon size={12} weight="bold" className="shrink-0" />
        </Link>
      ))}
      <Link
        href="/restaurants"
        className="ml-auto text-c-button text-muted underline-offset-2 transition-colors hover:text-accent-100 hover:underline"
      >
        Clear all
      </Link>
    </div>
  );
};