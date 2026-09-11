import { notFound } from "next/navigation";

import { getOfficerData } from "./_data/officer";

import { OfficerSidebar } from "./_components/sidebar";
import { OfficerHeader } from "./_components/header";

import type { ReactNode } from "react";

export default function OfficerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const data = getOfficerData();
  if (!data) notFound();

  return (
    <div className="flex w-svw h-svh">
      <OfficerSidebar restaurantName={data.restaurant.name} />
      <div className="w-full min-w-0 h-svh flex flex-col">
        <OfficerHeader officer={data.officer} restaurantName={data.restaurant.name} />
        <main className="h-full w-full overflow-y-scroll scrollbar-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}