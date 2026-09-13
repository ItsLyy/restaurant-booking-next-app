import { cache } from "react";
import path from "path";
import { readFileSync } from "fs";
import { ilike, or } from "drizzle-orm";

import { db } from "@db/client";
import { users as usersTable, officers as officersTable, owners as ownersTable } from "@db/schema";
import type { IOfficer, IOwner, IUser } from "@types";

export interface StaffCandidate {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  eligible: boolean;
  reason?: string;
}

const DUMMY_DIR = path.join(process.cwd(), "app/_data/dummy");

function readJsonFile<T>(filename: string): T[] {
  try {
    const raw = readFileSync(path.join(DUMMY_DIR, filename), "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export const searchStaffCandidates = cache(
  async (query: string): Promise<StaffCandidate[]> => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    // 1. Gather all users, owners, and officers from DB and/or JSON
    const jsonUsers = readJsonFile<IUser>("users.json");
    const jsonOwners = readJsonFile<IOwner>("owners.json");
    const jsonOfficers = readJsonFile<IOfficer>("officers.json");

    const ownerUserIds = new Set<string>(jsonOwners.map((o) => o.id));
    const officerUserIds = new Set<string>(jsonOfficers.map((o) => o.id));

    // Map of all known users keyed by ID
    const userMap = new Map<
      string,
      { id: string; username: string; firstName: string; lastName: string; avatar?: string; role?: string }
    >();

    for (const u of jsonUsers) {
      userMap.set(u.id, {
        id: u.id,
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        avatar: u.avatar,
        role: u.role,
      });
    }
    for (const o of jsonOwners) {
      userMap.set(o.id, {
        id: o.id,
        username: o.username,
        firstName: o.firstName,
        lastName: o.lastName,
        avatar: o.avatar,
        role: "owner",
      });
    }
    for (const o of jsonOfficers) {
      userMap.set(o.id, {
        id: o.id,
        username: o.username,
        firstName: o.firstName,
        lastName: o.lastName,
        avatar: o.avatar,
        role: "officer",
      });
    }

    // Try querying DB to augment/sync
    try {
      const dbUsers = await db
        .select({
          id: usersTable.id,
          username: usersTable.username,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          avatar: usersTable.avatar,
          role: usersTable.role,
        })
        .from(usersTable)
        .where(
          or(
            ilike(usersTable.username, `%${trimmed}%`),
            ilike(usersTable.firstName, `%${trimmed}%`),
            ilike(usersTable.lastName, `%${trimmed}%`),
          ),
        );

      for (const u of dbUsers) {
        userMap.set(u.id, {
          id: u.id,
          username: u.username,
          firstName: u.firstName,
          lastName: u.lastName,
          avatar: u.avatar ?? undefined,
          role: u.role,
        });
      }

      const dbOwners = await db.select({ userId: ownersTable.userId }).from(ownersTable);
      for (const o of dbOwners) {
        ownerUserIds.add(o.userId);
      }

      const dbOfficers = await db.select({ userId: officersTable.userId }).from(officersTable);
      for (const o of dbOfficers) {
        officerUserIds.add(o.userId);
      }
    } catch {
      // DB query failed or offline, proceed with JSON store
    }

    // Filter matched candidates
    const matched: StaffCandidate[] = [];
    for (const user of userMap.values()) {
      const matchesQuery =
        user.username.toLowerCase().includes(trimmed) ||
        user.firstName.toLowerCase().includes(trimmed) ||
        user.lastName.toLowerCase().includes(trimmed);

      if (!matchesQuery) continue;

      let eligible = true;
      let reason: string | undefined;

      if (ownerUserIds.has(user.id) || user.role === "owner") {
        eligible = false;
        reason = "Restaurant owner";
      } else if (officerUserIds.has(user.id) || user.role === "officer") {
        eligible = false;
        reason = "Already an officer";
      }

      matched.push({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        eligible,
        reason,
      });
    }

    // Sort: eligible first, then alphabetical by name
    return matched.sort((a, b) => {
      if (a.eligible && !b.eligible) return -1;
      if (!a.eligible && b.eligible) return 1;
      return a.username.localeCompare(b.username);
    });
  },
);
