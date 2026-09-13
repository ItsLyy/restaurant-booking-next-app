import { Card } from "../../_components/card";

import type { TablesData } from "../_data/tables";

const STAT_KEYS: (keyof TablesData["totals"])[] = [
  "free",
  "reserved",
  "occupied",
  "total",
];

const STAT_LABELS: Record<keyof TablesData["totals"], string> = {
  free: "Free",
  reserved: "Reserved",
  occupied: "Occupied",
  total: "Total",
};

export const TablesSummary = ({ totals }: { totals: TablesData["totals"] }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {STAT_KEYS.map((key) => (
        <Card key={key} className="flex flex-col gap-1 py-3">
          <span className="text-d-caption text-muted">{STAT_LABELS[key]}</span>
          <span className="text-d-stat text-foreground">{totals[key]}</span>
        </Card>
      ))}
    </div>
  );
};