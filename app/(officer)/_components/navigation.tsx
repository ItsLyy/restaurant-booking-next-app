"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { DashboardNavFooter } from "@components";

import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";

import { OFFICER_NAV_ITEMS, OFFICER_ROOT_PATH } from "../_libs/navigation";

const NavItem = ({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
}) => {
  const pathname = usePathname();
  const Icon = icon;
  const isActive =
    (href !== "/" &&
      href !== OFFICER_ROOT_PATH &&
      pathname.startsWith(href)) ||
    href === pathname;

  return (
    <Link
      href={href}
      className={`p-3 flex items-center gap-5 *:transition-color *:ease-in-out *:duration-300 ${isActive ? "text-accent-100" : "text-muted hover:text-accent-200"}`}
    >
      <Icon className="size-5" />
      <span className="text-c-button">{label}</span>
    </Link>
  );
};

export const OfficerNavigation = ({
  restaurantName,
}: {
  restaurantName: string;
}) => {
  return (
    <nav className="grow size-full flex flex-col justify-between p-8">
      <ul className="flex flex-col gap-2">
        {OFFICER_NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <NavItem icon={item.icon} label={item.label} href={item.href} />
          </li>
        ))}
      </ul>
      <DashboardNavFooter restaurantName={restaurantName} />
    </nav>
  );
};