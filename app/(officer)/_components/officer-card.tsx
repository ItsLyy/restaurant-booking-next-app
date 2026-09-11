import type { ReactNode } from "react";

export const OfficerCard = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`border-muted border bg-base-200 rounded-lg p-4 ${className}`}
    >
      {children}
    </div>
  );
};