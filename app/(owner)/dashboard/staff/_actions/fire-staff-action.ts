"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import type { FormState } from "@types";
import { getAuthUser, getDashboardRole } from "@libs/session";
import { db } from "@db/client";
import {
  customers,
  officers as officersTable,
  users as usersTable,
} from "@db/schema";

export async function fireStaffAction(officerId: string): Promise<FormState> {
  const role = await getDashboardRole();
  if (role === null) {
    return { success: false, message: "Unauthorized." };
  }

  const session = await getAuthUser();
  if (!session) {
    return { success: false, message: "Unauthorized." };
  }

  if (session.userId === officerId) {
    return {
      success: false,
      message: "You cannot fire yourself. Use the leave restaurant option in your profile.",
    };
  }

  const officerRows = await db
    .select()
    .from(officersTable)
    .innerJoin(usersTable, eq(usersTable.id, officersTable.userId))
    .where(eq(officersTable.userId, officerId))
    .limit(1);
  const target = officerRows[0];
  if (!target) {
    return { success: false, message: "Staff member not found." };
  }
  const { officers: targetOfficer, users: targetUser } = target;

  if (role === "manager" && targetOfficer.position === "manager") {
    return {
      success: false,
      message: "Managers can only fire staff members, not other managers.",
    };
  }

  const now = new Date().toISOString();

  try {
    await db
      .delete(officersTable)
      .where(eq(officersTable.userId, officerId));

    await db
      .update(usersTable)
      .set({ role: "customer", updatedAt: now })
      .where(eq(usersTable.id, officerId));

    await db
      .insert(customers)
      .values({ userId: officerId })
      .onConflictDoNothing();
  } catch {
    return {
      success: false,
      message:
        "The staff member could not be removed right now. Please try again.",
    };
  }

  revalidatePath("/dashboard/staff", "page");
  return {
    success: true,
    message: `${targetUser.firstName} ${targetUser.lastName} has been removed.`,
  };
}