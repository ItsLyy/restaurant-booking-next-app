"use server";

import { inArray, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import type { FormState } from "@types";
import { getAuthUser, getDashboardRole, updateSessionRole } from "@libs/session";
import { db } from "@db/client";
import {
  customers,
  officers as officersTable,
  owners as ownersTable,
  restaurants as restaurantsTable,
  users as usersTable,
} from "@db/schema";
import { getCurrentRestaurantId } from "../../../_libs/current-restaurant";

export async function deleteRestaurantAction(): Promise<FormState & { redirectTo?: string }> {
  const role = await getDashboardRole();
  if (role !== "owner") {
    return {
      success: false,
      message: "Only the restaurant owner can delete the restaurant.",
    };
  }

  const session = await getAuthUser();
  if (!session) {
    return { success: false, message: "Unauthorized." };
  }

  const restaurantId = await getCurrentRestaurantId();
  const now = new Date().toISOString();

  try {
    // 1. Process all officers of this restaurant
    const officerRows = await db
      .select({ userId: officersTable.userId })
      .from(officersTable)
      .where(eq(officersTable.restaurantId, restaurantId));
    const officerIds = officerRows.map((row) => row.userId);

    if (officerIds.length > 0) {
      await db.delete(officersTable).where(inArray(officersTable.userId, officerIds));
      await db
        .update(usersTable)
        .set({ role: "customer", updatedAt: now })
        .where(inArray(usersTable.id, officerIds));
      await db.insert(customers).values(
        officerIds.map((userId) => ({ userId })),
      ).onConflictDoNothing();
    }

    // 2. Process the Owner
    await db.delete(ownersTable).where(eq(ownersTable.userId, session.userId));
    await db
      .update(usersTable)
      .set({ role: "customer", updatedAt: now })
      .where(eq(usersTable.id, session.userId));
    await db
      .insert(customers)
      .values({ userId: session.userId })
      .onConflictDoNothing();

    // 3. Delete restaurant (cascade deletes tables, hours, photos, officers)
    await db.delete(restaurantsTable).where(eq(restaurantsTable.id, restaurantId));
  } catch {
    return {
      success: false,
      message: "The restaurant could not be deleted. Please try again.",
    };
  }

  // 4. Update session cookie to customer
  await updateSessionRole("customer");

  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/profile", "page");

  return {
    success: true,
    message: "Restaurant deleted successfully.",
    redirectTo: "/",
  };
}