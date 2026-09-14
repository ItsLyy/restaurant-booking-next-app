"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import type { FormState } from "@types";
import { getAuthUser, getDashboardRole, updateSessionRole } from "@libs/session";
import { db } from "@db/client";
import { customers, officers as officersTable, users as usersTable } from "@db/schema";

export async function leaveRestaurantAction(): Promise<FormState & { redirectTo?: string }> {
  const role = await getDashboardRole();
  if (role !== "manager" && role !== "staff") {
    return {
      success: false,
      message: "Only staff members or managers can leave a restaurant.",
    };
  }

  const session = await getAuthUser();
  if (!session) {
    return { success: false, message: "Unauthorized." };
  }

  const officerId = session.userId;
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
      message: "You could not leave the restaurant right now. Please try again.",
    };
  }

  // Update session cookie to customer
  await updateSessionRole("customer");

  revalidatePath("/dashboard", "layout");
  revalidatePath("/profile", "page");
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "You have left the restaurant.",
    redirectTo: "/profile",
  };
}