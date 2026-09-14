"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import type { FormState } from "@types";
import { getDashboardRole } from "@libs/session";
import { db } from "@db/client";
import { officers as officersTable } from "@db/schema";

export async function changeStaffRoleAction(
  officerId: string,
  newPosition: "manager" | "staff",
): Promise<FormState> {
  const role = await getDashboardRole();
  if (role !== "owner") {
    return {
      success: false,
      message: "Only the restaurant owner can change staff roles.",
    };
  }

  const updated = await db
    .update(officersTable)
    .set({ position: newPosition })
    .where(eq(officersTable.userId, officerId))
    .returning({ userId: officersTable.userId });
  if (updated.length === 0) {
    return { success: false, message: "Staff member not found." };
  }

  revalidatePath("/dashboard/staff", "page");
  return {
    success: true,
    message: `Role changed to ${newPosition}.`,
  };
}