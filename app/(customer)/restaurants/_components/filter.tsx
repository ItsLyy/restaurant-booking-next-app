import Link from "next/link";
import { CheckIcon, FunnelIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

import { Dropdown } from "./dropdown";
import { buildRestaurantsHref } from "@libs";

import type { ICategoryListItem } from "@types";
import type { PriceBucket } from "@data/restaurants/get-price-buckets";
import type { RestaurantQuery } from "@libs";

interface FilterProps {
  categories: ICategoryListItem[];
  buckets: PriceBucket[];
  query: RestaurantQuery;
  searchParams: Record<string, string | string[] | undefined>;
}

const RATING_OPTIONS = [3, 4, 4.5];

const CLEAR_FILTERS = {
  category: undefined,
  pmin: undefined,
  pmax: undefined,
  minRating: undefined,
  discount: undefined,
};

const formatCompact = (value: number): string =>
  value >= 1000 ? `${Math.round(value / 1000)}K` : String(value);

export const Filter = ({
  categories,
  buckets,
  query,
  searchParams,
}: FilterProps) => {
  const activeCount = [
    query.category ? 1 : 0,
    query.pmin !== undefined || query.pmax !== undefined ? 1 : 0,
    query.minRating !== undefined ? 1 : 0,
    query.hasDiscount ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <Dropdown
      key={buildRestaurantsHref(searchParams, {})}
      ariaLabel="Filter"
      summaryClassName={
        activeCount > 0
          ? "w-11 px-0 justify-center border-accent-100! bg-accent-100! text-base-100! hover:bg-accent-200! hover:border-accent-200!"
          : "w-11 px-0 justify-center"
      }
      panelClassName="w-60 left-0"
      summary={
        <span className="absolute inset-0 flex items-center justify-center">
          <FunnelIcon size={20} weight="duotone" />
          {activeCount > 0 ? (
            <span className="absolute -top-1 -right-1 size-4.5 flex items-center justify-center rounded-full bg-base-100 text-accent-100 border border-accent-100/40 text-[10px] font-bold leading-none">
              {activeCount}
            </span>
          ) : null}
        </span>
      }
    >
      <FilterSection title="Category" first>
        <FilterOption
          href={buildRestaurantsHref(searchParams, { category: undefined })}
          label="All"
          active={!query.category}
        />
        {categories.map((category) => (
          <FilterOption
            key={category.id}
            href={buildRestaurantsHref(searchParams, {
              category: category.slug,
            })}
            label={category.name}
            active={query.category === category.slug}
          />
        ))}
      </FilterSection>
      <FilterSection title="Price" subtitle="per person">
        <FilterOption
          href={buildRestaurantsHref(searchParams, {
            pmin: undefined,
            pmax: undefined,
          })}
          label="Any price"
          active={query.pmin === undefined && query.pmax === undefined}
        />
        {buckets.map((bucket, index) => (
          <FilterOption
            key={`${bucket.min}-${bucket.max}`}
            href={buildRestaurantsHref(searchParams, {
              pmin: String(bucket.min),
              pmax: String(bucket.max),
            })}
            label={`${formatCompact(bucket.min)} – ${formatCompact(bucket.max)}`}
            active={query.pmin === bucket.min && query.pmax === bucket.max}
            hint={index === buckets.length - 1 ? "up" : undefined}
          />
        ))}
      </FilterSection>
      <FilterSection title="Rating">
        <FilterOption
          href={buildRestaurantsHref(searchParams, { minRating: undefined })}
          label="Any rating"
          active={query.minRating === undefined}
        />
        {RATING_OPTIONS.map((rating) => (
          <FilterOption
            key={rating}
            href={buildRestaurantsHref(searchParams, {
              minRating: String(rating),
            })}
            label={`${rating} & up`}
            active={query.minRating === rating}
          />
        ))}
      </FilterSection>
      <FilterSection title="Offers">
        <FilterOption
          href={buildRestaurantsHref(searchParams, {
            discount: query.hasDiscount ? undefined : "1",
          })}
          label="Has discount"
          active={!!query.hasDiscount}
        />
      </FilterSection>
      {activeCount > 0 ? (
        <Link
          href={buildRestaurantsHref(searchParams, CLEAR_FILTERS)}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-accent-200/30 px-3 py-2 text-c-button text-accent-200 transition-colors hover:bg-base-200"
        >
          <XIcon size={14} weight="bold" />
          Clear all filters ({activeCount})
        </Link>
      ) : null}
    </Dropdown>
  );
};

const FilterSection = ({
  title,
  subtitle,
  children,
  first = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  first?: boolean;
}) => {
  return (
    <div className={first ? "" : "mt-2 border-t border-muted/40 pt-2"}>
      <span className="flex items-baseline gap-1.5 px-3 pt-1 pb-0.5 text-c-button text-muted">
        {title}
        {subtitle ? (
          <span className="text-[10px] uppercase tracking-wider">
            ({subtitle})
          </span>
        ) : null}
      </span>
      {children}
    </div>
  );
};

const FilterOption = ({
  href,
  label,
  active,
  hint,
}: {
  href: string;
  label: string;
  active: boolean;
  hint?: string;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-c-body transition-colors ${
        active
          ? "bg-accent-100 text-base-100"
          : "text-foreground hover:bg-base-200"
      }`}
    >
      <span>{label}</span>
      <span className="flex items-center gap-1.5">
        {hint ? (
          <span className="text-muted text-c-caption">({hint})</span>
        ) : null}
        {active ? <CheckIcon size={16} weight="bold" /> : null}
      </span>
    </Link>
  );
};
