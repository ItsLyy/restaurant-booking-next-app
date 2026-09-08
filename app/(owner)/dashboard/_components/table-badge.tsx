import { VARIANT_STYLES, type Variant } from "./variant-styles";

interface TableBadgeProps {
  tableName: string;
  variant?: Variant;
}

/**
 * negative: Currently in booked time
 * neutral: Today already been booked
 * positive: Available
 */

export const TableBadge = ({
  tableName,
  variant = "positive",
}: TableBadgeProps) => {
  return (
    <div
      className={`size-11 rounded-sm flex justify-center items-center overflow-hidden ${VARIANT_STYLES[variant].container}`}
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
};
