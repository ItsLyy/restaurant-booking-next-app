import "server-only";

import { cache } from "react";
import { ilike, or } from "drizzle-orm";

import { db } from "@db/client";
import {
  officers as officersTable,
  owners as ownersTable,
  users as usersTable,
} from "@db/schema";

export interface StaffCandidate {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  eligible: boolean;
  reason?: string;
}

export const searchStaffCandidates = cache(
  async (query: string): Promise<StaffCandidate[]> => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const userRows = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        avatar: usersTable.avatar,
      })
      .from(usersTable)
      .where(
        or(
          ilike(usersTable.username, `%${trimmed}%`),
          ilike(usersTable.firstName, `%${trimmed}%`),
          ilike(usersTable.lastName, `%${trimmed}%`),
        ),
      );

    const [ownerRows, officerRows] = await Promise.all([
      db.select({ userId: ownersTable.userId }).from(ownersTable),
      db.select({ userId: officersTable.userId }).from(officersTable),
    ]);

    const ownerUserIds = new Set(ownerRows.map((row) => row.userId));
    const officerUserIds = new Set(officerRows.map((row) => row.userId));

    const matched: StaffCandidate[] = userRows.map((user) => {
      let eligible = true;
      let reason: string | undefined;

      if (ownerUserIds.has(user.id)) {
        eligible = false;
        reason = "Restaurant owner";
      } else if (officerUserIds.has(user.id)) {
        eligible = false;
        reason = "Already an officer";
      }

      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar ?? undefined,
        eligible,
        reason,
      };
    });

    return matched.sort((a, b) => {
      if (a.eligible && !b.eligible) return -1;
      if (!a.eligible && b.eligible) return 1;
      return a.username.localeCompare(b.username);
    });
  },
);