import { eq } from "drizzle-orm";

import { db } from "@db/client";
import {
  officers as officersTable,
  restaurants as restaurantsTable,
} from "@db/schema";
import { getAuthUser } from "@libs/session";

const DEFAULT_RESTAURANT_ID = "rest-001";

export async function getCurrentRestaurantId(): Promise<string> {
  const user = await getAuthUser();
  if (!user) return DEFAULT_RESTAURANT_ID;

  if (user.role === "owner") {
    const rows = await db
      .select({ id: restaurantsTable.id })
      .from(restaurantsTable)
      .where(eq(restaurantsTable.ownerId, user.userId))
      .limit(1);
    const found = rows[0];
    if (found) return found.id;
  } else if (user.role === "manager" || user.role === "staff") {
    const rows = await db
      .select({ restaurantId: officersTable.restaurantId })
      .from(officersTable)
      .where(eq(officersTable.userId, user.userId))
      .limit(1);
    const found = rows[0];
    if (found) return found.restaurantId;
  }

  return DEFAULT_RESTAURANT_ID;
}