import { cache } from "react";

import type { IUser } from "@types";
import { db } from "@db/client";
import { users } from "@db/schema";
import { like } from "drizzle-orm";

type GetResponse = Pick<
  IUser,
  "id" | "avatar" | "firstName" | "lastName" | "username"
>;

export const getAllUsersByUsername = cache(
  async (username: string): Promise<GetResponse[]> => {
    const userRows = await db
      .select()
      .from(users)
      .where(like(users.username, username));

    return userRows.map((user) => {
      return {
        id: user.id,
        username: user.username,
        avatar: user.avatar ?? undefined,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    });
  },
);
