import type { ReactNode } from "react";

const VARIANTS = {
  default: "bg-accent-200/10 text-accent-100 border-accent-200/40",
  positive: "bg-positive/10 text-positive border-positive/40",
  neutral: "bg-base-200 text-muted border-muted/50",
} as const;

export const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 size-fit text-xs font-medium ${VARIANTS[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;