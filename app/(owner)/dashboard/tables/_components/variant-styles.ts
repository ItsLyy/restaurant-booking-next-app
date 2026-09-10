import type { TableStatus } from "../_data/tables";

export type Variant = "negative" | "neutral" | "positive";

export const TABLE_STATUS_META: Record<
  TableStatus,
  { label: string; variant: Variant }
> = {
  occupied: { label: "Occupied", variant: "negative" },
  reserved: { label: "Reserved", variant: "neutral" },
  free: { label: "Free", variant: "positive" },
};

export const VARIANT_STYLES: Record<
  Variant,
  { container: string; dot: string; swatch: string }
> = {
  positive: {
    container: "bg-positive/20 text-positive border-positive",
    dot: "bg-positive",
    swatch: "bg-positive/40",
  },
  neutral: {
    container: "bg-accent-200/20 text-accent-200 border-accent-200",
    dot: "bg-accent-200",
    swatch: "bg-accent-200/40",
  },
  negative: {
    container: "bg-negative/20 text-negative border-negative",
    dot: "bg-negative",
    swatch: "bg-negative/40",
  },
};
