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

export const TableBadge = ({ tableName, variant = "positive" }: TableBadgeProps) => {
  return (
    <div
      className={`size-11 rounded-sm flex justify-center items-center ${VARIANT_STYLES[variant].container}`}
    >
      <span className="text-d-caption text-inherit">{tableName}</span>
    </div>
  );
};