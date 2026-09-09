"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  active?: boolean;
  hidden?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  active = false,
  hidden = false,
  className = "",
  ...props
}: BadgeProps) => {
  if (hidden) {
    return <div aria-hidden="true" />;
  }

  return (
    <button
      className={`size-full border rounded-lg text-c-caption flex justify-center items-center cursor-pointer transition-colors ${
        active
          ? "bg-accent-100 text-base-100 border-accent-100"
          : "border-foreground text-foreground hover:bg-base-200"
      } disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
