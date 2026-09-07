import { Card } from "../card";
import { TableBadge } from "../table-badge";

import type { Variant } from "../variant-styles";

interface Table {
  name: string;
  variant?: Variant;
}

const TABLES: Table[] = [
  { name: "TB-1", variant: "negative" },
  { name: "TB-2", variant: "neutral" },
  { name: "TB-3" },
  { name: "TB-4" },
  { name: "TB-5" },
  { name: "TB-6" },
  { name: "TB-7" },
];

export const TableStatus = () => {
  return (
    <div className="w-76.75 h-full shrink-0">
      <Card className="flex flex-col gap-2 size-full">
        <h2 className="text-d-header-md text-foreground">Table Status</h2>
        <div className="flex flex-col gap-2">
          <span className="text-d-header-card">INDOOR</span>
          <div className="flex flex-col gap-1">
            <span className="text-d-header-card">1F</span>
            <div className="grid grid-cols-5 gap-2 w-full">
              {TABLES.map((table) => (
                <TableBadge
                  key={table.name}
                  tableName={table.name}
                  variant={table.variant}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};