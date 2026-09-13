import { formatPrice } from "@utils";

import type { TablePoint } from "../_data/analytics";

export const TopTables = ({ data }: { data: TablePoint[] }) => {
  if (data.length === 0) {
    return <p className="text-d-body">No table activity yet.</p>;
  }

  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <ul className="flex flex-col gap-3">
      {data.map((item, index) => (
        <li key={item.id} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-foreground">
              <span className="text-d-caption mr-2 w-4 inline-block text-right">
                {index + 1}
              </span>
              {item.name}
            </span>
            <span className="text-d-caption shrink-0">
              {formatPrice(item.revenue)} · {item.bookings} booking
              {item.bookings === 1 ? "" : "s"}
            </span>
          </div>
          <div className="ml-6 h-2 rounded-full bg-muted/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent-200/70"
              style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};