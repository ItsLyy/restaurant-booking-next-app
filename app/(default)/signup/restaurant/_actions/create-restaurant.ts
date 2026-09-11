"use server";

import { redirect } from "next/navigation";

import z from "zod";

import { setRegisteredRole } from "@libs/session";
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
  const validated = restaurantSchema.safeParse({
    "restaurant-name": formData.get("restaurant-name"),
    "business-license": formData.get("business-license"),
  });
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors,
    };
  }

  await setRegisteredRole("owner");

  redirect("/dashboard");
}