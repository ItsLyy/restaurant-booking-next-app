"use server";

import { notFound, redirect } from "next/navigation";

import { findAccountById } from "@data/auth/users";
import { createSession } from "@libs/session";

import type { DashboardRole } from "@libs/session";

const DEMO_ACCOUNT_ID: Record<DashboardRole, string> = {
  owner: "owner-001",
  manager: "officer-001",
  staff: "officer-002",
};

export async function switchDashboardRoleAction(role: DashboardRole) {
  if (process.env.NODE_ENV === "production") notFound();

  const account = findAccountById(DEMO_ACCOUNT_ID[role]);
  if (!account) notFound();

  await createSession(account);
  redirect("/dashboard");
}