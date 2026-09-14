"use server";

import z from "zod";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { FormState } from "@types";
import { saveAvatarFile } from "@data/profiles/avatar";
import { profileFieldsSchema } from "@data/profiles/profile-schema";
import { patchUserProfile } from "@data/profiles/update-profile";
import { getCustomerSession } from "@libs/session";

export async function updateProfileAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const customer = await getCustomerSession();
  if (!customer) redirect("/signin");

  const customerId = customer.userId;
  const avatarResult = await saveAvatarFile(formData, customerId);
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

  const patched = await patchUserProfile(customerId, {
    firstName: validated.data.firstName,
    lastName: validated.data.lastName,
    email: validated.data.email,
    ...(avatarResult.path ? { avatar: avatarResult.path } : {}),
    allergics: validated.data.allergics,
  });
  if (!patched) {
    return { success: false, message: "Profile not found." };
  }

  revalidatePath("/profile", "page");
  return { success: true, message: "Profile updated." };
}