import { Logo } from "@components";

import { Navigation } from "./navigation";

export const Sidebar = ({ restaurantName }: { restaurantName: string }) => {
  return (
    <aside className="w-80 h-full flex flex-col">
      <div className="p-8 flex items-center gap-3 w-full grow-0 shrink-0">
        <Logo className="size-11.5! rounded-lg overflow-hidden" />
        <span className="text-c-header-md text-foreground">
          RES.<span className="text-accent-100">BOOK</span>
        </span>
      </div>
      <Navigation restaurantName={restaurantName} />
    </aside>
  );
};