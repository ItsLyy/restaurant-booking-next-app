import { getDashboardData } from "./dashboard/_data/dashboard";

import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";

import type { ReactNode } from "react";

export default function OwnerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { restaurant, owner } = getDashboardData();

  return (
    <div className="flex w-full h-svh">
      <Sidebar restaurantName={restaurant.name} />
      <div className="w-full h-svh flex flex-col">
        <Header restaurant={restaurant} owner={owner} />
        <main className="h-full overflow-y-scroll scrollbar-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
