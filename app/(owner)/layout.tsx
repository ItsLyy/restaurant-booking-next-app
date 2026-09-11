import { redirect } from "next/navigation";

import { getDashboardData } from "./dashboard/_data/dashboard";
import { getOfficerData } from "./dashboard/_data/officer";
import { findAccountById } from "@data/auth/users";
import { getAuthUser, getDashboardRole } from "@libs/session";

import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";

import type { DashboardUser } from "./_components/header/user-profile";
import type { ReactNode } from "react";

export default async function DashboardsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const role = await getDashboardRole();
  if (role === null) redirect("/signin");

  const data = getDashboardData();
  const session = await getAuthUser();

  const user: DashboardUser = (() => {
    if (role === "owner") {
      const owner = session ? findAccountById(session.userId) : undefined;
      return {
        name: owner
          ? `${owner.firstName} ${owner.lastName}`
          : `${data.owner.firstName} ${data.owner.lastName}`,
        avatar: owner?.avatar ?? data.owner.avatar,
        email: owner?.email ?? "",
        role,
      };
    }

    const officer = session ? getOfficerData(session.userId) : undefined;
    return {
      name: officer
        ? `${officer.officer.firstName} ${officer.officer.lastName}`
        : "Staff",
      avatar: officer?.officer.avatar ?? "",
      email: officer?.officer.email ?? "",
      role,
      position: officer?.officer.position,
    };
  })();

  return (
    <div className="flex w-svw h-svh">
      <Sidebar restaurantName={data.restaurant.name} role={role} />
      <div className="w-full min-w-0 h-svh flex flex-col">
        <Header restaurantName={data.restaurant.name} user={user} />
        <main className="h-full w-full overflow-y-scroll scrollbar-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}