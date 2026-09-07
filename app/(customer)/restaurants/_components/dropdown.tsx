"use client";

import { useEffect, useRef, useState } from "react";

interface DropdownProps {
  summary: React.ReactNode;
  children: React.ReactNode;
  summaryClassName?: string;
  panelClassName?: string;
  ariaLabel?: string;
}

export const Dropdown = ({
  summary,
  children,
  summaryClassName,
  panelClassName,
  ariaLabel,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <details
      ref={detailsRef}
      open={open}
      onToggle={(event) =>
        setOpen((event.currentTarget as HTMLDetailsElement).open)
      }
      className="relative"
    >
      <summary
        aria-label={ariaLabel}
        title={ariaLabel}
        className={`flex h-11 items-center gap-2 rounded-lg border border-muted text-muted transition-colors hover:text-accent-100 hover:border-accent-200 focus-visible:outline-2 focus-visible:outline-accent-200 list-none cursor-pointer select-none [&::-webkit-details-marker]:hidden ${summaryClassName ?? ""}`}
      >
        {summary}
      </summary>
      {open ? (
        <div
          className={`absolute mt-2 z-20 max-h-[70svh] overflow-y-auto rounded-xl border border-muted bg-base-100 p-1.5 shadow-lg ${panelClassName ?? ""}`}
        >
          {children}
        </div>
      ) : null}
    </details>
  );
};