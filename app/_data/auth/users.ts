import "server-only";

import { cache } from "react";
import { and, eq, like, type SQL } from "drizzle-orm";

import { db } from "@db/client";
import {
  customers as customersTable,
  officers as officersTable,
  owners as ownersTable,
  users as usersTable,
} from "@db/schema";

import type { UserRow } from "@db/schema";

export type AuthRole = "customer" | "owner" | "manager" | "staff";

export interface AuthAccount {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: AuthRole;
  position?: "manager" | "staff";
  restaurantId?: string;
  emailVerifyAt: string;
  allergics: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const accountFromRow = (
  row: UserRow,
  extras?: Partial<AuthAccount>,
): AuthAccount => {
  const role: AuthRole =
    row.role === "officer"
      ? extras?.position ?? "staff"
      : row.role === "owner"
        ? "owner"
        : "customer";
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    firstName: row.firstName,
    lastName: row.lastName,
    role,
    emailVerifyAt: row.emailVerifyAt,
    allergics: row.allergics,
    avatar: row.avatar ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    ...extras,
  };
};

export const getAccessRole = (account: AuthAccount): AuthRole =>
  account.role;

interface AccountQuery {
  email?: string;
  username?: string;
  id?: string;
}

const findAccountRow = async (
  where: AccountQuery,
): Promise<AuthAccount | undefined> => {
  const conditions: SQL[] = [];
  if (where.email) conditions.push(eq(usersTable.email, where.email));
  if (where.username) conditions.push(eq(usersTable.username, where.username));
  if (where.id) conditions.push(eq(usersTable.id, where.id));
  if (conditions.length === 0) return undefined;

  const rows = await db
    .select()
    .from(usersTable)
    .leftJoin(customersTable, eq(customersTable.userId, usersTable.id))
    .leftJoin(ownersTable, eq(ownersTable.userId, usersTable.id))
    .leftJoin(officersTable, eq(officersTable.userId, usersTable.id))
    .where(and(...conditions))
    .limit(1);

  const row = rows[0];
  if (!row) return undefined;

  const { users: userRow, officers: officerRow } = row;
  if (userRow.role === "officer" && officerRow) {
    return accountFromRow(userRow, {
      role: officerRow.position,
      position: officerRow.position,
      restaurantId: officerRow.restaurantId,
    });
  }
  return accountFromRow(userRow);
};

export const findAccountByEmail = cache(
  async (email: string): Promise<AuthAccount | undefined> => {
    const normalized = email.trim().toLowerCase();
    return findAccountRow({ email: normalized });
  },
);

export const findAccountByUsername = cache(
  async (username: string): Promise<AuthAccount | undefined> => {
    const normalized = username.trim().toLowerCase();
    return findAccountRow({ username: normalized });
  },
);

export const findAccountById = cache(
  async (id: string): Promise<AuthAccount | undefined> =>
    findAccountRow({ id }),
);

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  emailVerifyAt?: string;
}

const buildNextUserId = async (): Promise<string> => {
  const rows = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(like(usersTable.id, "user-%"));
  let max = 0;
  for (const row of rows) {
    const sequence = Number(row.id.replace("user-", ""));
    if (Number.isFinite(sequence) && sequence > max) max = sequence;
  }
  return `user-${String(max + 1).padStart(3, "0")}`;
};

export async function createCustomerAccount(
  input: CreateCustomerInput,
): Promise<AuthAccount> {
  const now = new Date().toISOString();
  const id = await buildNextUserId();
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim().toLowerCase();

  await db.transaction(async (tx) => {
    await tx.insert(usersTable).values({
      id,
      username,
      email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
      role: "customer",
      emailVerifyAt: input.emailVerifyAt ?? now,
      allergics: [],
      avatar: input.avatar ?? null,
      createdAt: now,
      updatedAt: now,
    });
    await tx.insert(customersTable).values({ userId: id });
  });

  return accountFromRow({
    id,
    username,
    email,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    role: "customer",
    emailVerifyAt: input.emailVerifyAt ?? now,
    allergics: [],
    avatar: input.avatar ?? null,
    createdAt: now,
    updatedAt: now,
  });
}

export async function promoteToOwner(
  userId: string,
): Promise<AuthAccount | undefined> {
  const now = new Date().toISOString();
  const updated = await db
    .update(usersTable)
    .set({ role: "owner", updatedAt: now })
    .where(eq(usersTable.id, userId))
    .returning({ id: usersTable.id });
  if (updated.length === 0) return undefined;

  await db
    .insert(ownersTable)
    .values({ userId, businessLicense: null, verifyAt: null })
    .onConflictDoNothing();

  return findAccountRow({ id: userId });
}