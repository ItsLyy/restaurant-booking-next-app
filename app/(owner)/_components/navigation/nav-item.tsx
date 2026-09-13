"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import type { LinkProps } from "next/link";
import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";

interface NavItemProps extends LinkProps {
  label: string;
  icon: ComponentType<IconProps>;
  href: string;
}

export const NavItem = ({ label, icon, href, ...props }: NavItemProps) => {
  const pathname = usePathname();

  const Icon = icon;
  const isActive =
    (href !== "/" && href !== "/dashboard" && pathname.startsWith(href)) ||
    href === pathname;

  return (
    <Link
      href={href}
      {...props}
      className={`p-3 flex items-center gap-5 *:transition-color *:ease-in-out *:duration-300 ${isActive ? "text-accent-100" : "text-muted hover:text-accent-200"}`}
    >
      <Icon className="size-5" />
      <span className="text-c-button">{label}</span>
    </Link>
  );
};
