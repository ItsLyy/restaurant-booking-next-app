import Link from "next/link";
import { Logo } from "@components";

import { getAuthUser, getDashboardRole } from "@libs/session";
import { findAccountById } from "@data/auth/users";

import { getDashboardData } from "../../(owner)/dashboard/_data/dashboard";
import { getOfficerData } from "../../(owner)/dashboard/_data/officer";
import { getCustomerProfile } from "../profile/_data/profile";
import { HeaderNav } from "./header-nav";

export const Header = async () => {
  const session = await getAuthUser();
  const customer =
    session?.role === "customer"
      ? getCustomerProfile(session.userId)
      : undefined;

  const dashboardRole = await getDashboardRole();
  const dashboardUser =
    session && dashboardRole !== null
      ? (() => {
          const data = getDashboardData();
          if (dashboardRole === "owner") {
            const owner = session ? findAccountById(session.userId) : undefined;
            return {
              firstName: owner
                ? owner.firstName
                : data.owner.firstName,
              lastName: owner ? owner.lastName : data.owner.lastName,
              email: owner?.email ?? "",
              avatar: owner?.avatar ?? data.owner.avatar,
            };
          }
          const officer = session ? getOfficerData(session.userId) : undefined;
          return {
            firstName: officer?.officer.firstName ?? "Staff",
            lastName: officer?.officer.lastName ?? "",
            email: officer?.officer.email ?? "",
            avatar: officer?.officer.avatar ?? "",
          };
        })()
      : undefined;

  return (
    <header className="sticky top-0 left-0 z-30 w-full bg-base-100/90 backdrop-blur-md border-b border-muted/30 transition-colors">
      <nav className="w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
        >
          <Logo />
          <span className="text-xl font-playfair-display font-bold tracking-tight text-foreground group-hover:text-accent-100 transition-colors">
            RES.<span className="text-accent-200">BOOK</span>
          </span>
        </Link>

        <HeaderNav
          user={
            customer ??
            dashboardUser ?? undefined
          }
          role={session?.role}
        />
      </nav>
    </header>
  );
};