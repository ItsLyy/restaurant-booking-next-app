"use server";

import z from "zod";

import { revalidatePath } from "next/cache";

import type { FormState, IOfficer } from "@types";
import { saveAvatarFile } from "@data/profiles/avatar";
import { profileFieldsSchema } from "@data/profiles/profile-schema";
import {
  patchProfile,
  PROFILES_FILES,
  readProfiles,
} from "@data/profiles/update-profile";
import { getSessionOfficerId } from "@libs/session";

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

  const officers = readProfiles<IOfficer>(PROFILES_FILES.officers);
  const current = officers.find((officer) => officer.id === officerId);
  if (!current) {
    return { success: false, message: "Profile not found." };
  }

  const patched = patchProfile<IOfficer>(PROFILES_FILES.officers, officerId, {
    firstName: validated.data.firstName,
    lastName: validated.data.lastName,
    email: validated.data.email,
    avatar: avatarResult.path ?? current.avatar,
    allergics: validated.data.allergics,
  });
  if (!patched) {
    return { success: false, message: "Profile not found." };
  }

  revalidatePath("/dashboard/profile", "page");
  return { success: true, message: "Profile updated." };
}