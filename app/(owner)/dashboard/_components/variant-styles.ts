export type Variant = "negative" | "neutral" | "positive";

export const VARIANT_STYLES: Record<Variant, { container: string; dot: string }> =
  {
    positive: {
      container: "bg-positive/20 text-positive",
      dot: "bg-positive",
    },
    neutral: {
      container: "bg-accent-200/20 text-accent-200",
      dot: "bg-accent-200",
    },
    negative: {
      container: "bg-negative/20 text-negative",
      dot: "bg-negative",
    },
  };