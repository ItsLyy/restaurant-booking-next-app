"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

export const SearchInput = ({
  initialQuery,
  base = "/dashboard/bookings",
}: {
  initialQuery: string;
  base?: string;
}) => {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyQuery = (query: string) => {
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    params.delete("page");
    router.replace(`${base}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleChange = (query: string) => {
    setValue(query);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => applyQuery(query), 300);
  };

  const clearQuery = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setValue("");
    applyQuery("");
  };

  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Search guest, booking code, table…"
        aria-label="Search bookings"
        enterKeyHint="search"
        className="h-9 w-64 rounded-lg border border-muted bg-base-200 pl-9 pr-8 text-d-body text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent-200 focus:ring-2 focus:ring-accent-200/20"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={clearQuery}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted transition-colors hover:bg-accent-200/10 hover:text-foreground"
        >
          <XIcon className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
};