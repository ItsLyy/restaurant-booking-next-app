import { eq } from "drizzle-orm";

import { db } from "@db/client";
import {
  officers as officersTable,
  restaurants as restaurantsTable,
  users as usersTable,
} from "@db/schema";

import type { IRestaurant } from "@types";

const RESTAURANT_ID = "rest-001";

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  position: "manager" | "staff";
  createdAt?: string;
  invitedByName?: string;
}

const toIRestaurant = (
  row: (typeof restaurantsTable.$inferSelect),
): IRestaurant => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  country: row.country,
  city: row.city,
  address: row.address,
  tags: row.tags,
  ownerId: row.ownerId,
  ...(row.categoryId ? { categoryId: row.categoryId } : {}),
  ...(row.discount !== null ? { discount: row.discount } : {}),
  description: row.description,
  ...(row.shortDescription ? { shortDescription: row.shortDescription } : {}),
  ...(row.lat !== null ? { lat: row.lat } : {}),
  ...(row.lng !== null ? { lng: row.lng } : {}),
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const getStaffData = async (
  restaurantId = RESTAURANT_ID,
): Promise<{
  restaurant?: IRestaurant;
  staff: StaffMember[];
}> => {
  const [restaurantRows, officerRows, userRows] = await Promise.all([
    db
      .select()
      .from(restaurantsTable)
      .where(eq(restaurantsTable.id, restaurantId))
      .limit(1),
    db
      .select()
      .from(officersTable)
      .innerJoin(usersTable, eq(usersTable.id, officersTable.userId))
      .where(eq(officersTable.restaurantId, restaurantId)),
    db.select().from(usersTable),
  ]);

  const nameMap = new Map(
    userRows.map((user) => [user.id, `${user.firstName} ${user.lastName}`]),
  );

  const staff: StaffMember[] = officerRows.map(({ officers, users }) => ({
    id: users.id,
    firstName: users.firstName,
    lastName: users.lastName,
    username: users.username,
    email: users.email,
    avatar: users.avatar ?? "",
    position: officers.position,
    createdAt: users.createdAt,
    invitedByName: nameMap.get(officers.invitedBy),
  }));
  staff.sort((a, b) =>
    (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );

  return {
    restaurant: restaurantRows[0] ? toIRestaurant(restaurantRows[0]) : undefined,
    staff,
  };
};