"use client";

import { useState } from "react";

import Link from "next/link";

import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";

import { Avatar } from "@components/index";

import type { DashboardOwner } from "../../dashboard/_data/dashboard";

const MENU_ITEMS = [
  { label: "My Profile", href: "/dashboard" },
  { label: "Settings", href: "/dashboard" },
];

export const UserProfile = ({ owner }: { owner: DashboardOwner }) => {
  const [isOpen, setIsOpen] = useState(false);

  const name = `${owner.firstName} ${owner.lastName}`;

  return (
    <div className="py-4 relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-4 cursor-pointer"
      >
        <div className="flex flex-col items-end">
          <span className="text-foreground text-d-caption">{name}</span>
          <span className="text-muted text-d-caption">Owner</span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar
            src={owner.avatar}
            alt="User Profile"
            className="size-13 rounded-full!"
          />
          <CaretDownIcon className="size-4 text-foreground" />
        </div>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 border border-muted rounded-lg bg-base-100 shadow-lg p-1"
        >
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-d-caption text-foreground hover:bg-accent-200/10"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};