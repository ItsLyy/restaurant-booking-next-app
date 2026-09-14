import { eq } from "drizzle-orm";

import { db } from "@db/client";
import {
  owners as ownersTable,
  restaurants as restaurantsTable,
  users as usersTable,
} from "@db/schema";

import type { OwnerRow, UserRow } from "@db/schema";
import type { IOwner, IRestaurant } from "@types";

const OWNER_ID = "owner-001";
const RESTAURANT_ID = "rest-001";

export interface OwnerProfileData {
  owner: IOwner;
  restaurant?: IRestaurant;
}

const toIOwner = (user: UserRow, owner: OwnerRow): IOwner => ({
  id: user.id,
  username: user.username,
  email: user.email,
  password: user.password,
  firstName: user.firstName,
  lastName: user.lastName,
  role: "owner",
  emailVerifyAt: user.emailVerifyAt,
  allergics: user.allergics,
  avatar: user.avatar ?? undefined,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  businessLicense: owner.businessLicense ?? undefined,
  verifyAt: owner.verifyAt ?? undefined,
});

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

export const getOwnerProfile = async (
  ownerId: string = OWNER_ID,
): Promise<OwnerProfileData | undefined> => {
  const ownerRows = await db
    .select()
    .from(ownersTable)
    .innerJoin(usersTable, eq(usersTable.id, ownersTable.userId))
    .where(eq(ownersTable.userId, ownerId))
    .limit(1);
  const ownerRow = ownerRows[0];
  if (!ownerRow) return undefined;
  const owner = toIOwner(ownerRow.users, ownerRow.owners);

  const restaurantRows = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, RESTAURANT_ID))
    .limit(1);
  const restaurantRow = restaurantRows[0];

  return { owner, restaurant: restaurantRow ? toIRestaurant(restaurantRow) : undefined };
};