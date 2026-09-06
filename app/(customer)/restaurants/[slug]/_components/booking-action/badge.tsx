import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BadgeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const Badge = ({ children, className = "", ...props }: BadgeProps) => {
  return (
    <button
      className={`size-full border border-foreground rounded-lg text-foreground text-c-caption flex justify-center items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
