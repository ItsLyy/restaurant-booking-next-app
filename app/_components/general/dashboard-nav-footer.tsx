"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";

export const DashboardNavFooter = ({
  restaurantName,
}: {
  restaurantName: string;
}) => {
  const pathname = usePathname();
  const isHomeActive = pathname === "/";

  return (
    <footer className="space-y-2">
      <Link
        href="/"
        className={`p-3 flex items-center gap-5 *:transition-color *:ease-in-out *:duration-300 ${isHomeActive ? "text-accent-100" : "text-muted hover:text-accent-200"}`}
      >
        <SignOutIcon className="size-5" />
        <span className="text-c-button">Go back browsing</span>
      </Link>
      <div className="border border-muted px-4 py-3 rounded-lg w-full bg-base-200">
        <span className="text-muted text-c-header-md">{restaurantName}</span>
      </div>
    </footer>
  );
};