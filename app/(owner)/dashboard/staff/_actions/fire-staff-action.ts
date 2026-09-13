"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import type { FormState, IOfficer, IUser } from "@types";
import {
  readProfiles,
  writeProfiles,
  PROFILES_FILES,
} from "@data/profiles/update-profile";
import { getAuthUser, getDashboardRole } from "@libs/session";
import { db } from "@db/client";
import { customers, officers as officersTable, users as usersTable } from "@db/schema";

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

  const officers = readProfiles<IOfficer>(PROFILES_FILES.officers);
  const targetOfficer = officers.find((o) => o.id === officerId);
  if (!targetOfficer) {
    return { success: false, message: "Staff member not found." };
  }

  if (role === "manager" && targetOfficer.position === "manager") {
    return {
      success: false,
      message: "Managers can only fire staff members, not other managers.",
    };
  }

  const now = new Date().toISOString();

  // 1. Remove from officers.json
  writeProfiles(
    PROFILES_FILES.officers,
    officers.filter((o) => o.id !== officerId),
  );

  // 2. Revert role to customer in users.json
  const customersList = readProfiles<IUser>(PROFILES_FILES.customers);
  const existingCustomerIndex = customersList.findIndex((u) => u.id === officerId);

  if (existingCustomerIndex >= 0) {
    customersList[existingCustomerIndex] = {
      ...customersList[existingCustomerIndex],
      role: "customer",
      updatedAt: now,
    };
    writeProfiles(PROFILES_FILES.customers, customersList);
  } else {
    // If not in users.json, convert officer record to customer and save
    const customerUser: IUser = {
      id: targetOfficer.id,
      username: targetOfficer.username,
      firstName: targetOfficer.firstName,
      lastName: targetOfficer.lastName,
      email: targetOfficer.email,
      password: targetOfficer.password,
      role: "customer",
      emailVerifyAt: targetOfficer.emailVerifyAt,
      allergics: targetOfficer.allergics ?? [],
      avatar: targetOfficer.avatar,
      createdAt: targetOfficer.createdAt ?? now,
      updatedAt: now,
    };
    writeProfiles(PROFILES_FILES.customers, [...customersList, customerUser]);
  }

  // 3. Sync to DB
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
    // DB sync error handled gracefully
  }

  revalidatePath("/dashboard/staff", "page");
  return {
    success: true,
    message: `${targetOfficer.firstName} ${targetOfficer.lastName} has been removed.`,
  };
}
