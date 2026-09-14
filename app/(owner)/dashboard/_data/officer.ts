import { eq, inArray } from "drizzle-orm";

import { db } from "@db/client";
import {
  bookings as bookingsTable,
  officers as officersTable,
  owners as ownersTable,
  restaurants as restaurantsTable,
  tables as tablesTable,
  users as usersTable,
} from "@db/schema";

import type { OfficerRow, OwnerRow, UserRow } from "@db/schema";
import type { IOfficer, IOwner, IRestaurant } from "@types";

export interface OfficerDashboardData {
  officer: IOfficer;
  restaurant: IRestaurant;
  invitedByOwner?: IOwner;
  today: {
    bookings: number;
    active: number;
    guests: number;
  };
}

const toIOfficer = (user: UserRow, officer: OfficerRow): IOfficer => ({
  id: user.id,
  username: user.username,
  email: user.email,
  password: user.password,
  firstName: user.firstName,
  lastName: user.lastName,
  role: "officer",
  emailVerifyAt: user.emailVerifyAt,
  allergics: user.allergics,
  avatar: user.avatar ?? undefined,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  position: officer.position,
  invitedBy: officer.invitedBy,
  restaurantId: officer.restaurantId,
});

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

const toIRestaurant = (row: (typeof restaurantsTable.$inferSelect)): IRestaurant => ({
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

export const getOfficerData = async (
  officerId = "officer-001",
): Promise<OfficerDashboardData | undefined> => {
  const officerRows = await db
    .select()
    .from(officersTable)
    .innerJoin(usersTable, eq(usersTable.id, officersTable.userId))
    .where(eq(officersTable.userId, officerId))
    .limit(1);
  const row = officerRows[0];
  if (!row) return undefined;

  const { officers: officerRow, users: userRow } = row;
  const officer = toIOfficer(userRow, officerRow);

  const restaurantRows = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, officer.restaurantId))
    .limit(1);
  const restaurantRow = restaurantRows[0];
  if (!restaurantRow) return undefined;
  const restaurant = toIRestaurant(restaurantRow);

  const invitedByRows = await db
    .select()
    .from(ownersTable)
    .innerJoin(usersTable, eq(usersTable.id, ownersTable.userId))
    .where(eq(ownersTable.userId, officer.invitedBy))
    .limit(1);
  const invitedByRow = invitedByRows[0];
  const invitedByOwner = invitedByRow
    ? toIOwner(invitedByRow.users, invitedByRow.owners)
    : undefined;

  const restaurantTables = await db
    .select()
    .from(tablesTable)
    .where(eq(tablesTable.restaurantId, officer.restaurantId));
  const restaurantTableIds = new Set(
    restaurantTables.map((table) => table.id),
  );

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  const todayBookings = restaurantTableIds.size
    ? await db
        .select()
        .from(bookingsTable)
        .where(
          inArray(bookingsTable.tableId, [...restaurantTableIds]),
        )
    : [];
  const filteredTodayBookings = todayBookings.filter(
    (booking) => booking.date === today,
  );
  const active = filteredTodayBookings.filter(
    (booking) => booking.status !== "cancelled",
  );

  return {
    officer,
    restaurant,
    invitedByOwner,
    today: {
      bookings: filteredTodayBookings.length,
      active: active.length,
      guests: active.reduce((sum, booking) => sum + booking.partySize, 0),
    },
  };
};