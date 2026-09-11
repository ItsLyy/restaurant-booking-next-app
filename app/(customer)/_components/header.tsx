import Link from "next/link";
import { Logo } from "@components";

import { getAuthUser } from "@libs/session";

import { getCustomerProfile } from "../profile/_data/profile";
import { HeaderNav } from "./header-nav";

export const Header = async () => {
  const session = await getAuthUser();
  const customer =
    session?.role === "customer"
      ? getCustomerProfile(session.userId)
      : undefined;

  const hasDashboardAccess =
    session !== null &&
    (session.role === "owner" ||
      session.role === "manager" ||
      session.role === "staff");

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
          hasDashboardAccess={hasDashboardAccess}
          customer={
            customer
              ? {
                  firstName: customer.firstName,
                  lastName: customer.lastName,
                  email: customer.email,
                  username: customer.username,
                  avatar: customer.avatar,
                }
              : undefined
          }
        />
      </nav>
    </header>
  );
};