"use server";

import { eq } from "drizzle-orm";

import z from "zod";

import { revalidatePath } from "next/cache";

import type { FormState } from "@types";
import { saveAvatarFile } from "@data/profiles/avatar";
import { profileFieldsSchema } from "@data/profiles/profile-schema";
import { patchUserProfile } from "@data/profiles/update-profile";
import { getSessionOfficerId } from "@libs/session";
import { db } from "@db/client";
import { users as usersTable } from "@db/schema";

export async function updateOfficerProfileAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const officerId = await getSessionOfficerId();
  if (!officerId) return { success: false, message: "Profile not found." };

  const avatarResult = await saveAvatarFile(formData, officerId);
  if (avatarResult.error) {
    return { success: false, message: avatarResult.error };
  }

  const validated = profileFieldsSchema.safeParse({
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
    avatar: undefined,
    allergics: formData.getAll("allergics").map(String),
  });
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors,
    };
  }

  const officerRows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, officerId))
    .limit(1);
  const current = officerRows[0];
  if (!current) {
    return { success: false, message: "Profile not found." };
  }

  const updated = await patchUserProfile(officerId, {
    firstName: validated.data.firstName,
    lastName: validated.data.lastName,
    email: validated.data.email,
    avatar: avatarResult.path ?? current.avatar ?? undefined,
    allergics: validated.data.allergics,
  });
  if (!updated) {
    return { success: false, message: "Profile not found." };
  }

  revalidatePath("/dashboard/profile", "page");
  return { success: true, message: "Profile updated." };
}