"use client";

import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";

import { NavItem } from "./nav-item";

import { NAV_ITEMS } from "../../_libs/navigation";

export const Navigation = () => {
  return (
    <nav className="grow size-full flex flex-col justify-between p-8">
      <ul className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <NavItem icon={item.icon} label={item.label} href={item.href} />
          </li>
        ))}
      </ul>
      <footer className="space-y-2">
        <NavItem icon={SignOutIcon} label="Go back browsing" href="/" />
        <div className="border border-muted px-4 py-3 rounded-lg w-full bg-base-200">
          <span className="text-muted text-c-header-md">[Restaurant Name]</span>
        </div>
      </footer>
    </nav>
  );
};