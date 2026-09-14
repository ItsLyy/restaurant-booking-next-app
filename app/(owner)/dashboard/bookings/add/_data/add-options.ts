import { eq } from "drizzle-orm";

import { db } from "@db/client";
import { tables as tablesTable } from "@db/schema";

export interface BookableTable {
  id: string;
  name: string;
  capacity: number;
}

export const getAddBookingOptions = async (): Promise<{
  tables: BookableTable[];
}> => {
  const rows = await db
    .select()
    .from(tablesTable)
    .where(eq(tablesTable.restaurantId, "rest-001"));
  return {
    tables: rows.map((table) => ({
      id: table.id,
      name: table.name,
      capacity: table.capacity,
    })),
  };
};