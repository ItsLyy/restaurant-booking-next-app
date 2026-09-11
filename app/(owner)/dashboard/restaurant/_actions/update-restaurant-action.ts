"use server";

import z from "zod";

import { revalidatePath } from "next/cache";

import type { FormState } from "@types";
import { restaurantFieldsSchema } from "@data/profiles/restaurant-schema";
import {
  patchProfile,
  PROFILES_FILES,
  readProfiles,
} from "@data/profiles/update-profile";

import type { IRestaurant } from "@types";

const RESTAURANT_ID = "rest-001";

export async function updateRestaurantAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawDiscount = String(formData.get("discount") ?? "");

  const validated = restaurantFieldsSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    country: String(formData.get("country") ?? ""),
    city: String(formData.get("city") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    discount: rawDiscount.trim() === "" ? undefined : Number(rawDiscount),
    tags: String(formData.get("tags") ?? ""),
  });
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors,
    };
  }

  const restaurants = readProfiles<IRestaurant>(PROFILES_FILES.restaurants);
  const current = restaurants.find((item) => item.id === RESTAURANT_ID);
  if (!current) {
    return { success: false, message: "Restaurant not found." };
  }

  const fields: Partial<IRestaurant> = {
    name: validated.data.name,
    country: validated.data.country,
    city: validated.data.city,
    address: validated.data.address,
    description: validated.data.description,
    shortDescription:
      validated.data.shortDescription ?? current.shortDescription,
    tags: validated.data.tags,
  };
  if (validated.data.discount !== undefined) {
    fields.discount = validated.data.discount;
  }

  const patched = patchProfile<IRestaurant>(
    PROFILES_FILES.restaurants,
    RESTAURANT_ID,
    fields,
  );
  if (!patched) {
    return { success: false, message: "Restaurant not found." };
  }

  revalidatePath("/dashboard/restaurant", "page");
  return { success: true, message: "Restaurant updated." };
}