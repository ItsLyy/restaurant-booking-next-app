import Link from "next/link";

import { VARIANT_STYLES, type Variant } from "./variant-styles";

interface TableBadgeProps {
  tableName: string;
  variant?: Variant;
  href?: string;
  selected?: boolean;
  ariaLabel?: string;
}

/**
 * negative: Currently in booked time
 * neutral: Today already been booked
 * positive: Available
 */

export const TableBadge = ({
  tableName,
  variant = "positive",
  href,
  selected = false,
  ariaLabel,
}: TableBadgeProps) => {
  const selectedClassName = selected
    ? "ring-2 ring-accent-100 ring-offset-2 ring-offset-base-100"
    : "";

  const badge = (
    <div
      className={`size-11 rounded-sm flex justify-center items-center overflow-hidden ${VARIANT_STYLES[variant].container} ${selectedClassName}`}
    >
      <div className="flex w-max shrink-0 whitespace-nowrap marquee motion-reduce:animate-none">
        <span className="text-d-caption text-inherit px-1 py-1">
          {tableName}
        </span>
        <span aria-hidden className="text-d-caption text-inherit px-1 py-1">
          {tableName}
        </span>
      </div>
    </div>
  );

  if (!href) return badge;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-pressed={selected}
      className="size-fit rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-100 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
    >
      {badge}
    </Link>
  );
};