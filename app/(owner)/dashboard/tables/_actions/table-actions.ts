"use server";

import { readFileSync, writeFileSync } from "fs";
import path from "path";

import { revalidatePath } from "next/cache";

import { TABLE_CATEGORIES } from "../_data/table-meta";

import type { TableCategory } from "../_data/table-meta";

import type { ITable } from "@types";

const TABLES_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/tables.json",
);
const RESTAURANT_ID = "rest-001";

function readTables(): ITable[] {
  return JSON.parse(readFileSync(TABLES_FILE_PATH, "utf8")) as ITable[];
}

function writeTables(tables: ITable[]): void {
  writeFileSync(
    TABLES_FILE_PATH,
    `${JSON.stringify(tables, null, 2)}\n`,
    "utf8",
  );
}

function buildNextTableId(tables: ITable[]): string {
  let max = 0;
  for (const table of tables) {
    const sequence = Number(table.id.replace("table-", ""));
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

  const tables = readTables();

  const duplicate = tables.some(
    (table) =>
      table.restaurantId === RESTAURANT_ID &&
      table.name.toLowerCase() === name.toLowerCase(),
  );
  if (duplicate) {
    return { ok: false, error: `A table named “${name}” already exists.` };
  }

  const now = new Date().toISOString();
  tables.push({
    id: buildNextTableId(tables),
    name,
    price,
    category,
    floor,
    capacity,
    restaurantId: RESTAURANT_ID,
    createdAt: now,
    updatedAt: now,
  });
  writeTables(tables);

  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/tables", "page");

  return { ok: true };
}