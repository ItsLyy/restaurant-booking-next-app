import { TableBadge } from "../table-badge";

import { TABLE_STATUS_META } from "../variant-styles";
import { PLACE_LABELS } from "../../_data/tables";

import type { TableDayInfo } from "../../_data/tables";

export const Header = ({ table }: { table: TableDayInfo }) => {
  const meta = TABLE_STATUS_META[table.status];

  return (
    <header className="p-2 w-full border-b border-b-muted flex flex-col gap-1">
      <div className="flex w-full justify-between items-end gap-2">
        <span className="text-foreground text-d-header-card leading-tight truncate">
          {table.name}
        </span>
        <TableBadge status={meta.label} variant={meta.variant} />
      </div>
      <span className="text-d-caption leading-tight">
        {PLACE_LABELS[table.place]} · {table.capacity} Pax · Floor {table.floor}
      </span>
    </header>
  );
};