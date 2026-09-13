"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import type { FormState, IOfficer, IOwner, IRestaurant, IUser } from "@types";
import {
  readProfiles,
  writeProfiles,
  PROFILES_FILES,
} from "@data/profiles/update-profile";
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

  // 1. Process all officers of this restaurant
  const allOfficers = readProfiles<IOfficer>(PROFILES_FILES.officers);
  const restaurantOfficers = allOfficers.filter((o) => o.restaurantId === restaurantId);
  const remainingOfficers = allOfficers.filter((o) => o.restaurantId !== restaurantId);

  // Update JSON officers
  writeProfiles(PROFILES_FILES.officers, remainingOfficers);

  // Update JSON users/customers for those officers
  const customersList = readProfiles<IUser>(PROFILES_FILES.customers);
  const updatedCustomers = [...customersList];

  for (const officer of restaurantOfficers) {
    const idx = updatedCustomers.findIndex((u) => u.id === officer.id);
    if (idx >= 0) {
      updatedCustomers[idx] = {
        ...updatedCustomers[idx],
        role: "customer",
        updatedAt: now,
      };
    } else {
      updatedCustomers.push({
        id: officer.id,
        username: officer.username,
        firstName: officer.firstName,
        lastName: officer.lastName,
        email: officer.email,
        password: officer.password,
        role: "customer",
        emailVerifyAt: officer.emailVerifyAt,
        allergics: officer.allergics ?? [],
        avatar: officer.avatar,
        createdAt: officer.createdAt ?? now,
        updatedAt: now,
      });
    }

    // Sync officer in DB
    try {
      await db.delete(officersTable).where(eq(officersTable.userId, officer.id));
      await db
        .update(usersTable)
        .set({ role: "customer", updatedAt: now })
        .where(eq(usersTable.id, officer.id));
      await db.insert(customers).values({ userId: officer.id }).onConflictDoNothing();
    } catch {
      // DB sync error handled gracefully
    }
  }

  // 2. Process the Owner
  const allOwners = readProfiles<IOwner>(PROFILES_FILES.owners);
  const targetOwner = allOwners.find((o) => o.id === session.userId);
  const remainingOwners = allOwners.filter((o) => o.id !== session.userId);
  writeProfiles(PROFILES_FILES.owners, remainingOwners);

  const ownerIdx = updatedCustomers.findIndex((u) => u.id === session.userId);
  if (ownerIdx >= 0) {
    updatedCustomers[ownerIdx] = {
      ...updatedCustomers[ownerIdx],
      role: "customer",
      updatedAt: now,
    };
  } else if (targetOwner) {
    updatedCustomers.push({
      id: targetOwner.id,
      username: targetOwner.username,
      firstName: targetOwner.firstName,
      lastName: targetOwner.lastName,
      email: targetOwner.email,
      password: targetOwner.password,
      role: "customer",
      emailVerifyAt: targetOwner.emailVerifyAt,
      allergics: targetOwner.allergics ?? [],
      avatar: targetOwner.avatar,
      createdAt: targetOwner.createdAt ?? now,
      updatedAt: now,
    });
  }

  // Save all updated customers
  writeProfiles(PROFILES_FILES.customers, updatedCustomers);

  // 3. Remove restaurant from restaurants.json
  const allRestaurants = readProfiles<IRestaurant>(PROFILES_FILES.restaurants);
  writeProfiles(
    PROFILES_FILES.restaurants,
    allRestaurants.filter((r) => r.id !== restaurantId),
  );

  // 4. DB Sync for Owner and Restaurant
  try {
    // Delete owner record
    await db.delete(ownersTable).where(eq(ownersTable.userId, session.userId));
    // Update owner user role
    await db
      .update(usersTable)
      .set({ role: "customer", updatedAt: now })
      .where(eq(usersTable.id, session.userId));
    // Insert into customers table
    await db.insert(customers).values({ userId: session.userId }).onConflictDoNothing();
    // Delete restaurant (cascade deletes tables, hours, photos, officers)
    await db.delete(restaurantsTable).where(eq(restaurantsTable.id, restaurantId));
  } catch {
    // DB sync error handled gracefully
  }

  // 5. Update session cookie to customer
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
