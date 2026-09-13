import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  __resbookDb?: ReturnType<typeof createDb>;
};

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in the environment.");
  }
  const client = postgres(connectionString, {
    ssl: "require",
    max: 1,
  });
  return drizzle(client, { schema, casing: "snake_case" });
}

export const db = globalForDb.__resbookDb ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__resbookDb = db;
}

export type Db = typeof db;