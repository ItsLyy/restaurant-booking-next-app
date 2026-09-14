import { eq } from "drizzle-orm";

import { db } from "@db/client";
import { users as usersTable } from "@db/schema";

export interface UserProfilePatch {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  allergics?: string[];
}

export async function patchUserProfile(
  userId: string,
  fields: UserProfilePatch,
): Promise<boolean> {
  const rows = await db
    .update(usersTable)
    .set({ ...fields, updatedAt: new Date().toISOString() })
    .where(eq(usersTable.id, userId))
    .returning({ id: usersTable.id });
  return rows.length > 0;
}