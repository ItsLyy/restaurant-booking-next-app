"use client";

import { ArrowUpIcon } from "@phosphor-icons/react/dist/ssr";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const BackToTopButton = () => {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-muted/50 bg-base-100 hover:bg-base-200/80 hover:border-accent-200 text-xs font-medium text-muted hover:text-foreground transition-colors cursor-pointer shadow-2xs"
    >
      <span>Back to top</span>
      <ArrowUpIcon weight="bold" className="size-3" />
    </button>
  );
};
