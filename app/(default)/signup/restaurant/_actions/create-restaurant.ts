"use server";

import { redirect } from "next/navigation";

import z from "zod";

import { promoteToOwner } from "@data/auth/users";
import { createSession, getAuthUser } from "@libs/session";
import type { FormState } from "@types";

const businessLicenseSchema = z
  .custom<File>((value) => value instanceof File, {
    message: "Business license file is required.",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Business license must be 5 MB or smaller.",
  })
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
    { message: "Business license must be a JPG, PNG, or PDF file." },
  );

const restaurantSchema = z
  .object({
    "restaurant-name": z
      .string()
      .min(1, "Restaurant name is required.")
      .max(80, "Restaurant name must be 80 characters or fewer."),
    "business-license": businessLicenseSchema,
  });

export async function createRestaurantAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await getAuthUser();
  if (!session) redirect("/signin");

  const validated = restaurantSchema.safeParse({
    "restaurant-name": formData.get("restaurant-name"),
    "business-license": formData.get("business-license"),
  });
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors,
    };
  }

  const owner = await promoteToOwner(session.userId);
  if (!owner) {
    return {
      success: false,
      message: "Could not activate the Owner role for this account.",
    };
  }

  await createSession(owner);
  redirect("/dashboard");
}