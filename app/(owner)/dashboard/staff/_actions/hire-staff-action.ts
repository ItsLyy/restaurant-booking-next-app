"use server";

import z from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormState } from "@types";
import { getAuthUser, getDashboardRole } from "@libs/session";
import { getCurrentRestaurantId } from "../../../_libs/current-restaurant";
import { db } from "@db/client";
import {
  customers,
  officers as officersTable,
  owners as ownersTable,
  users as usersTable,
} from "@db/schema";

const hireSchema = z.object({
  "user-choice": z.string().min(1, "Please select a user to add."),
  position: z.enum(["manager", "staff"]),
});

export async function hireStaffAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const role = await getDashboardRole();
  if (role === null) {
    return { success: false, message: "Unauthorized." };
  }

  const session = await getAuthUser();
  if (!session) {
    return { success: false, message: "Unauthorized." };
  }

  const validated = hireSchema.safeParse({
    "user-choice": formData.get("user-choice"),
    position: formData.get("position"),
  });

  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors,
    };
  }

  if (role === "manager" && validated.data.position === "manager") {
    return {
      success: false,
      message: "Only the owner can hire managers.",
    };
  }

  const selectedUserId = validated.data["user-choice"];
  const now = new Date().toISOString();

  // Check eligibility: user cannot be an owner or officer in any restaurant
  const [ownerRows, officerRows, targetRows] = await Promise.all([
    db
      .select({ userId: ownersTable.userId })
      .from(ownersTable)
      .where(eq(ownersTable.userId, selectedUserId))
      .limit(1),
    db
      .select({ userId: officersTable.userId })
      .from(officersTable)
      .where(eq(officersTable.userId, selectedUserId))
      .limit(1),
    db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, selectedUserId))
      .limit(1),
  ]);

  if (ownerRows.length > 0) {
    return {
      success: false,
      message: "This user is already a restaurant owner and cannot be hired as staff.",
    };
  }

  if (officerRows.length > 0) {
    return {
      success: false,
      message: "This user is already an officer at a restaurant.",
    };
  }

  const targetUser = targetRows[0];
  if (!targetUser) {
    return {
      success: false,
      message: "Selected user could not be found.",
    };
  }

  try {
    await db
      .update(usersTable)
      .set({ role: "officer", updatedAt: now })
      .where(eq(usersTable.id, selectedUserId));

    await db
      .delete(customers)
      .where(eq(customers.userId, selectedUserId));

    const restaurantId = await getCurrentRestaurantId();

    await db.insert(officersTable).values({
      userId: selectedUserId,
      position: validated.data.position,
      invitedBy: session.userId,
      restaurantId,
    });
  } catch {
    return {
      success: false,
      message: "The staff member could not be hired right now. Please try again.",
    };
  }

  revalidatePath("/dashboard/staff", "page");
  revalidatePath("/dashboard/staff/add", "page");
  redirect("/dashboard/staff");
}