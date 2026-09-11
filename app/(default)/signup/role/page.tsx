import Link from "next/link";

import {
  ArrowRightIcon,
  CheckCircleIcon,
  StorefrontIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";

import AuthCard from "@components/auth/auth-card";
import { getAuthUser } from "@libs/session";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose your role",
  description: "Continue as a customer or register your restaurant",
  robots: {
    index: false,
    follow: false,
  },
};

const ROLE_OPTIONS = [
  {
    label: "I'm a Customer",
    description: "Continue as a customer to browse and book restaurants.",
    href: "/",
    icon: UserIcon,
  },
  {
    label: "I'm a Restaurant Owner",
    description: "Register your restaurant to activate your Owner role.",
    href: "/signup/restaurant",
    icon: StorefrontIcon,
  },
] as const;

export default async function RolePage() {
  const user = await getAuthUser();

  return (
    <AuthCard
      step={3}
      title="Choose your role"
      subtitle="Your account is verified. Continue as a customer, or register a restaurant to become an owner."
    >
      <ul className="flex flex-col gap-3">
        {user ? (
          <li className="flex items-center gap-2 text-c-body text-accent-100 bg-accent-200/10 border border-accent-200/20 rounded-xl px-4 py-3">
            <CheckCircleIcon weight="fill" className="size-5 shrink-0" />
            <span className="min-w-0 truncate">
              Registered as <span className="font-semibold">{user.email}</span>{" "}
              <span className="text-muted">
                — default role: Customer
              </span>
            </span>
          </li>
        ) : null}
        {ROLE_OPTIONS.map(
          ({ label, description, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center gap-4 border border-muted rounded-2xl p-5 bg-base-100 transition-colors hover:border-accent-200 hover:bg-base-100"
              >
                <span className="size-12 grid place-items-center rounded-xl bg-accent-200/15 shrink-0">
                  <Icon weight="fill" className="size-6 text-accent-200" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-c-body text-foreground font-semibold">
                    {label}
                  </span>
                  <span className="block text-c-caption text-muted">
                    {description}
                  </span>
                </span>
                <ArrowRightIcon className="size-4 shrink-0 text-muted group-hover:text-accent-200 transition-colors" />
              </Link>
            </li>
          ),
        )}
      </ul>
    </AuthCard>
  );
}