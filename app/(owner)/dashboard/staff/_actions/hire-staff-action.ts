"use server";

import z from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { FormState, IOfficer, IOwner, IUser } from "@types";
import {
  readProfiles,
  writeProfiles,
  PROFILES_FILES,
} from "@data/profiles/update-profile";
import { getAuthUser, getDashboardRole } from "@libs/session";
import { getCurrentRestaurantId } from "../../../_libs/current-restaurant";
import { db } from "@db/client";
import { customers, officers as officersTable, users as usersTable } from "@db/schema";

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

  // Check eligibility: user cannot be an owner or officer in any restaurant
  const owners = readProfiles<IOwner>(PROFILES_FILES.owners);
  if (owners.some((o) => o.id === selectedUserId)) {
    return {
      success: false,
      message: "This user is already a restaurant owner and cannot be hired as staff.",
    };
  }

  const officers = readProfiles<IOfficer>(PROFILES_FILES.officers);
  if (officers.some((o) => o.id === selectedUserId)) {
    return {
      success: false,
      message: "This user is already an officer at a restaurant.",
    };
  }

  // Find candidate user in customers list
  const customersList = readProfiles<IUser>(PROFILES_FILES.customers);
  const targetUser = customersList.find((u) => u.id === selectedUserId);
  if (!targetUser) {
    return {
      success: false,
      message: "Selected user could not be found.",
    };
  }

  const restaurantId = await getCurrentRestaurantId();
  const now = new Date().toISOString();

  const newOfficer: IOfficer = {
    id: targetUser.id,
    username: targetUser.username,
    firstName: targetUser.firstName,
    lastName: targetUser.lastName,
    email: targetUser.email,
    password: targetUser.password,
    role: "officer",
    emailVerifyAt: targetUser.emailVerifyAt ?? now,
    allergics: targetUser.allergics ?? [],
    avatar: targetUser.avatar,
    position: validated.data.position,
    invitedBy: session.userId,
    restaurantId,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Update JSON files
  writeProfiles(PROFILES_FILES.officers, [...officers, newOfficer]);
  writeProfiles(
    PROFILES_FILES.customers,
    customersList.map((u) =>
      u.id === targetUser.id ? { ...u, role: "officer" as const, updatedAt: now } : u,
    ),
  );

  // 2. Sync with database
  try {
    await db
      .update(usersTable)
      .set({ role: "officer", updatedAt: now })
      .where(eq(usersTable.id, targetUser.id));

    await db
      .delete(customers)
      .where(eq(customers.userId, targetUser.id));

    await db.insert(officersTable).values({
      userId: targetUser.id,
      position: validated.data.position,
      invitedBy: session.userId,
      restaurantId,
    });
  } catch {
    // If DB is offline or table error, local JSON is preserved
  }

  revalidatePath("/dashboard/staff", "page");
  revalidatePath("/dashboard/staff/add", "page");
  redirect("/dashboard/staff");
}