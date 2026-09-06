import type { ReactNode } from "react";

export const Card = ({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`bg-base-200 p-8 rounded-3xl border border-muted ${className}`}
    >
      {children}
    </div>
  );
};
