import { Card } from "../card";
import { TableBadge } from "../table-badge";
import { VARIANT_STYLES, type Variant } from "../variant-styles";

import type { DashboardBooking, DashboardTable } from "../../_data/dashboard";

const LEGEND: { label: string; variant: Variant }[] = [
  { label: "Occupied", variant: "negative" },
  { label: "Reserved", variant: "neutral" },
  { label: "Available", variant: "positive" },
];

const getTableVariant = (
  tableName: string,
  bookings: DashboardBooking[],
): Variant => {
  const booking = bookings.find(
    (item) => item.status === "confirmed" && item.table === tableName,
  );
  if (!booking) return "positive";
  return booking.isPaid ? "negative" : "neutral";
};

export const TableStatus = ({
  tablesByFloor,
  bookings,
}: {
  tablesByFloor: Map<number, DashboardTable[]>;
  bookings: DashboardBooking[];
}) => {
  const floors = [...tablesByFloor.entries()].sort(([a], [b]) => a - b);

  return (
    <div className="w-76.75 h-full shrink-0">
      <Card className="flex flex-col gap-4 size-full">
        <h2 className="text-d-header-md text-foreground">Table Status</h2>
        <div className="flex flex-col gap-4">
          {floors.map(([floor, tables]) => (
            <div key={floor} className="flex flex-col gap-2">
              <span className="text-d-header-card">Floor {floor}</span>
              <div className="grid grid-cols-5 gap-2 w-full">
                {tables.map((table) => (
                  <TableBadge
                    key={table.id}
                    tableName={table.name}
                    variant={getTableVariant(table.name, bookings)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-muted pt-3">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className={`size-3 rounded-sm ${VARIANT_STYLES[item.variant].swatch}`}
              />
              <span className="text-d-caption text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
