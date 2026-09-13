import { readFileSync } from "fs";
import path from "path";

import type { ITable } from "@types";

const TABLES_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/tables.json",
);

export function tablesCountByFloor(): { defaultFloor: number } {
  const tables = JSON.parse(
    readFileSync(TABLES_FILE_PATH, "utf8"),
  ) as ITable[];

  const restaurantTables = tables.filter(
    (table) => table.restaurantId === "rest-001",
  );
  if (restaurantTables.length === 0) return { defaultFloor: 1 };

  let maxFloor = 0;
  for (const table of restaurantTables) {
    if (table.floor > maxFloor) maxFloor = table.floor;
  }
  return { defaultFloor: maxFloor };
}