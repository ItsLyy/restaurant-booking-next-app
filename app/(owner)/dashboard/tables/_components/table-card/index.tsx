import { Body } from "./body";
import { Header } from "./header";

import type { TableStatus } from "../../_data/tables";
import type { TableDayInfo } from "../../_data/tables";

const STATUS_BORDER: Record<TableStatus, string> = {
  occupied: "border-negative",
  reserved: "border-accent-200",
  free: "border-positive",
};

export const TableCard = ({ table }: { table: TableDayInfo }) => {
  return (
    <div
      className={`w-64 shrink-0 border rounded-lg h-65.25 flex flex-col ${STATUS_BORDER[table.status]}`}
    >
      <Header table={table} />
      <Body table={table} />
    </div>
  );
};