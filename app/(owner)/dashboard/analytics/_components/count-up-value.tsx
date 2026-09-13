"use client";

import { useEffect, useRef, useState } from "react";

import { formatPrice } from "@utils/formatPrice";

import { formatCompactPrice } from "./charts/chart-format";

const DURATION_MS = 1200;

const easeOutCubic = (progress: number): number => 1 - Math.pow(1 - progress, 3);

export const CountUpValue = ({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frameId: number | null = null;

    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      frameId = requestAnimationFrame(() => setDisplay(value));
      return () => {
        if (frameId !== null) cancelAnimationFrame(frameId);
      };
    }

    const animate = () => {
      if (frameId !== null) return;
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / DURATION_MS, 1);
        setDisplay(value * easeOutCubic(progress));
        frameId = progress < 1 ? requestAnimationFrame(step) : null;
      };
      // The loop is cancelled in the effect cleanup (observer.disconnect
      // branch) so no frame can run after unmount.
      // react-doctor-disable-next-line effect-raf-loop-needs-cancel
      frameId = requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === "undefined") {
      animate();
      return () => {
        if (frameId !== null) cancelAnimationFrame(frameId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) animate();
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <span ref={ref} className={className} aria-label={formatPrice(value)}>
      {formatCompactPrice(display)}
    </span>
  );
};