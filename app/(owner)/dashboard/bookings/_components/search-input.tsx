"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";

export const SearchInput = ({ initialQuery }: { initialQuery: string }) => {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (query: string) => {
    setValue(query);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (query.trim()) params.set("q", query.trim());
      else params.delete("q");
      params.delete("page");
      router.replace(`/dashboard/bookings?${params.toString()}`, {
        scroll: false,
      });
    }, 300);
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
        className="h-9 w-64 rounded-lg border border-muted bg-base-200 pl-9 pr-3 text-d-body text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent-200 focus:ring-2 focus:ring-accent-200/20"
      />
    </div>
  );
};