import type { ReactNode } from "react";

export const OfficerInfoRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-muted/50 last:border-b-0">
    <span className="text-d-caption text-muted shrink-0">{label}</span>
    <span className="text-d-body text-foreground text-right">{children}</span>
  </div>
);

export const OfficerInfoCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="border border-muted rounded-lg p-4">
    <h3 className="text-d-header-md text-foreground mb-2">{title}</h3>
    {children}
  </div>
);