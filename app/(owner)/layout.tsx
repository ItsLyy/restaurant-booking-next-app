import { Header } from "./_components/header";
import { Sidebar } from "./_components/sidebar";

import type { ReactNode } from "react";

export default function OwnerLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex w-full h-svh">
      <Sidebar />
      <div className="w-full h-full flex flex-col">
        <Header />
        <main className="h-full">{children}</main>
      </div>
    </div>
  );
}
