"use server";

import z from "zod";

import { revalidatePath } from "next/cache";

import type { FormState, IUser } from "@types";
import { saveAvatarFile } from "@data/profiles/avatar";
import { profileFieldsSchema } from "@data/profiles/profile-schema";
import {
  patchProfile,
  PROFILES_FILES,
  readProfiles,
} from "@data/profiles/update-profile";

const CUSTOMER_ID = "user-001";

export async function updateProfileAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const avatarResult = await saveAvatarFile(formData, CUSTOMER_ID);
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

  const users = readProfiles<IUser>(PROFILES_FILES.customers);
  const current = users.find((user) => user.id === CUSTOMER_ID);
  if (!current) {
    return { success: false, message: "Profile not found." };
  }

  const patched = patchProfile<IUser>(PROFILES_FILES.customers, CUSTOMER_ID, {
    firstName: validated.data.firstName,
    lastName: validated.data.lastName,
    email: validated.data.email,
    avatar: avatarResult.path ?? current.avatar,
    allergics: validated.data.allergics,
  });
  if (!patched) {
    return { success: false, message: "Profile not found." };
  }

  revalidatePath("/profile", "page");
  return { success: true, message: "Profile updated." };
}