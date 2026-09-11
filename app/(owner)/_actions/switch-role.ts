"use server";

import { redirect } from "next/navigation";

import { setRegisteredRole } from "@libs/session";

import type { DashboardRole } from "@libs/session";

export async function switchDashboardRoleAction(role: DashboardRole) {
  await setRegisteredRole(role);
  redirect("/dashboard");
}