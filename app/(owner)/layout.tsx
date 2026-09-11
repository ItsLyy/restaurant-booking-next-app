import { getDashboardData } from "./dashboard/_data/dashboard";
import { getOfficerData } from "./dashboard/_data/officer";
import { getDashboardRole } from "@libs/session";

import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";

import type { DashboardUser } from "./_components/header/user-profile";
import type { ReactNode } from "react";

export default async function DashboardsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const role = await getDashboardRole();
  const data = getDashboardData();

  const user: DashboardUser =
    role === "officer"
      ? (() => {
          const officer = getOfficerData();
          return {
            name: officer
              ? `${officer.officer.firstName} ${officer.officer.lastName}`
              : "Staff",
            avatar: officer?.officer.avatar ?? "",
            email: officer?.officer.email ?? "",
            role,
            position: officer?.officer.position,
          };
        })()
      : {
          name: `${data.owner.firstName} ${data.owner.lastName}`,
          avatar: data.owner.avatar,
          email: "",
          role,
        };

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