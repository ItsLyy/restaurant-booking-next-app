"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";

import { Avatar } from "@components/general/avatar";
import { Badge } from "@components/ui/badge";

import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";

export interface UserMenuLink {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
  description: string;
}

export interface UserMenuIdentity {
  name: string;
  avatar: string;
  badge: string;
  subtitle: string;
}

export interface UserMenuAction {
  label: string;
  icon: ComponentType<IconProps>;
  onClick: () => void;
}

interface UserMenuPanelProps {
  items: UserMenuLink[];
  identity: UserMenuIdentity;
  onClose: () => void;
  actions?: UserMenuAction[];
}

export const UserMenuPanel = ({
  items,
  identity,
  onClose,
  actions,
}: UserMenuPanelProps) => {
  const pathname = usePathname();

  return (
    <div
      role="menu"
      className="rise-in absolute right-0 mt-2 w-64 border border-muted/50 rounded-2xl bg-base-100 shadow-xl p-1.5 z-30"
    >
      <div className="px-3 py-2.5 mb-1 rounded-xl bg-base-200/80 border border-muted/30 flex items-center gap-3">
        <Avatar
          src={identity.avatar}
          alt={identity.name}
          className="size-10! rounded-xl!"
        />
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground truncate">
              {identity.name}
            </span>
            <Badge variant="default" className="text-[10px] px-1.5 py-0">
              {identity.badge}
            </Badge>
          </div>
          <span className="text-[11px] text-muted truncate">
            {identity.subtitle}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              role="menuitem"
              onClick={onClose}
              className={`flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                isActive
                  ? "bg-accent-100/10 text-accent-100 font-semibold"
                  : "text-foreground hover:bg-base-200 text-muted/90 hover:text-foreground"
              }`}
            >
              <Icon
                weight={isActive ? "fill" : "bold"}
                className={`size-4 mt-0.5 shrink-0 ${
                  isActive ? "text-accent-100" : "text-muted"
                }`}
              />
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-foreground truncate">
                  {item.label}
                </span>
                <span className="text-[10px] text-muted truncate">
                  {item.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {actions && actions.length > 0 ? (
        <div className="flex flex-col gap-0.5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-base-200 w-full text-left transition-colors cursor-pointer"
              >
                <Icon weight="bold" className="size-4 shrink-0 text-muted" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-1 pt-1 border-t border-muted/30">
        <Link
          href="/"
          role="menuitem"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-negative hover:bg-negative/10 font-medium transition-colors"
        >
          <SignOutIcon weight="bold" className="size-4 shrink-0" />
          <span>Log out</span>
        </Link>
      </div>
    </div>
  );
};