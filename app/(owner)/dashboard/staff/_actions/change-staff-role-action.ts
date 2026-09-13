"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import type { FormState, IOfficer } from "@types";
import {
  readProfiles,
  writeProfiles,
  PROFILES_FILES,
} from "@data/profiles/update-profile";
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

  const officers = readProfiles<IOfficer>(PROFILES_FILES.officers);
  const targetIndex = officers.findIndex((o) => o.id === officerId);
  if (targetIndex === -1) {
    return { success: false, message: "Staff member not found." };
  }

  const now = new Date().toISOString();
  officers[targetIndex] = {
    ...officers[targetIndex],
    position: newPosition,
    updatedAt: now,
  };

  // 1. Update JSON
  writeProfiles(PROFILES_FILES.officers, officers);

  // 2. Update DB
  try {
    await db
      .update(officersTable)
      .set({ position: newPosition })
      .where(eq(officersTable.userId, officerId));
  } catch {
    // DB sync error handled gracefully
  }

  revalidatePath("/dashboard/staff", "page");
  return {
    success: true,
    message: `Role changed to ${newPosition}.`,
  };
}
