import { readFileSync, writeFileSync } from "fs";
import path from "path";

const DUMMY_DIR = path.join(process.cwd(), "app/_data/dummy");

export const PROFILES_FILES = {
  customers: path.join(DUMMY_DIR, "users.json"),
  owners: path.join(DUMMY_DIR, "owners.json"),
  officers: path.join(DUMMY_DIR, "officers.json"),
  restaurants: path.join(DUMMY_DIR, "restaurants.json"),
} as const;

export function readProfiles<T>(file: string): T[] {
  return JSON.parse(readFileSync(file, "utf8")) as T[];
}

export function writeProfiles<T>(file: string, rows: T[]): void {
  writeFileSync(file, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

export function patchProfile<T extends { id: string; updatedAt?: string }>(
  file: string,
  id: string,
  fields: Partial<T>,
): boolean {
  const rows = readProfiles<T>(file);
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return false;
  rows[index] = {
    ...rows[index],
    ...fields,
    updatedAt: new Date().toISOString(),
  };
  writeProfiles(file, rows);
  return true;
}