"use server";

import { and, eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { TABLE_CATEGORIES } from "../_data/table-meta";
import { db } from "@db/client";
import { tables as tablesTable } from "@db/schema";

import type { TableCategory } from "../_data/table-meta";

const RESTAURANT_ID = "rest-001";

async function buildNextTableId(): Promise<string> {
  const rows = await db
    .select({ id: tablesTable.id })
    .from(tablesTable)
    .where(like(tablesTable.id, "table-%"));
  let max = 0;
  for (const row of rows) {
    const sequence = Number(row.id.replace("table-", ""));
    if (Number.isFinite(sequence) && sequence > max) {
      max = sequence;
    }
  }
  return `table-${String(max + 1).padStart(3, "0")}`;
}

export interface AddTableState {
  ok: boolean;
  error?: string;
}

export async function createTableAction(
  _prevState: AddTableState,
  formData: FormData,
): Promise<AddTableState> {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const floor = Number(formData.get("floor"));
  const capacity = Number(formData.get("capacity"));
  const price = Number(formData.get("price"));

  if (!name) {
    return { ok: false, error: "Table name is required." };
  }
  if (!TABLE_CATEGORIES.includes(category as TableCategory)) {
    return { ok: false, error: "Please choose a valid category." };
  }
  if (!Number.isInteger(floor) || floor < 1) {
    return { ok: false, error: "Floor must be a whole number of at least 1." };
  }
  if (!Number.isInteger(capacity) || capacity < 1) {
    return { ok: false, error: "Capacity must be at least 1 person." };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: "Price must be zero or more." };
  }

  const duplicateRows = await db
    .select({ id: tablesTable.id })
    .from(tablesTable)
    .where(
      and(
        eq(tablesTable.restaurantId, RESTAURANT_ID),
        eq(tablesTable.name, name),
      ),
    )
    .limit(1);
  if (duplicateRows.length > 0) {
    return { ok: false, error: `A table named “${name}” already exists.` };
  }

  const now = new Date().toISOString();
  await db.insert(tablesTable).values({
    id: await buildNextTableId(),
    name,
    price,
    category,
    floor,
    capacity,
    restaurantId: RESTAURANT_ID,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/tables", "page");

  return { ok: true };
}