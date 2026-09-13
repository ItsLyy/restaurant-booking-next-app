import { readFileSync } from "fs";
import path from "path";

import type { IOfficer, IOwner, IRestaurant } from "@types";

const OFFICERS_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/officers.json",
);
const OWNERS_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/owners.json",
);
const RESTAURANTS_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/restaurants.json",
);

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

export const getStaffData = (
  restaurantId = RESTAURANT_ID,
): {
  restaurant?: IRestaurant;
  staff: StaffMember[];
} => {
  const officers = JSON.parse(
    readFileSync(OFFICERS_PATH, "utf8"),
  ) as IOfficer[];
  const owners = JSON.parse(
    readFileSync(OWNERS_PATH, "utf8"),
  ) as IOwner[];
  const restaurants = JSON.parse(
    readFileSync(RESTAURANTS_PATH, "utf8"),
  ) as IRestaurant[];

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const nameMap = new Map(
    owners.map((o) => [o.id, `${o.firstName} ${o.lastName}`]),
  );
  for (const o of officers) {
    nameMap.set(o.id, `${o.firstName} ${o.lastName}`);
  }

  const staff: StaffMember[] = [];
  for (const o of officers) {
    if (o.restaurantId !== restaurantId) continue;
    staff.push({
      id: o.id,
      firstName: o.firstName,
      lastName: o.lastName,
      username: o.username,
      email: o.email,
      avatar: o.avatar ?? "",
      position: o.position,
      createdAt: o.createdAt,
      invitedByName: nameMap.get(o.invitedBy),
    });
  }
  staff.sort((a, b) =>
    (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );

  return { restaurant, staff };
};