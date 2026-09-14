import { eq } from "drizzle-orm";

import { db } from "@db/client";
import { tables as tablesTable } from "@db/schema";

export async function tablesCountByFloor(): Promise<{ defaultFloor: number }> {
  const rows = await db
    .select({ floor: tablesTable.floor })
    .from(tablesTable)
    .where(eq(tablesTable.restaurantId, "rest-001"));

  if (rows.length === 0) return { defaultFloor: 1 };

  let maxFloor = 0;
  for (const row of rows) {
    if (row.floor > maxFloor) maxFloor = row.floor;
  }
  return { defaultFloor: maxFloor };
}