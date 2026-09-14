"use server";

import { eq } from "drizzle-orm";

import z from "zod";

import { revalidatePath } from "next/cache";

import type { FormState } from "@types";
import { restaurantFieldsSchema } from "@data/profiles/restaurant-schema";
import { db } from "@db/client";
import { restaurants as restaurantsTable } from "@db/schema";

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

  const restaurantRows = await db
    .select()
    .from(restaurantsTable)
    .where(eq(restaurantsTable.id, RESTAURANT_ID))
    .limit(1);
  const current = restaurantRows[0];
  if (!current) {
    return { success: false, message: "Restaurant not found." };
  }

  const setClause: Partial<typeof restaurantsTable.$inferInsert> = {
    name: validated.data.name,
    country: validated.data.country,
    city: validated.data.city,
    address: validated.data.address,
    description: validated.data.description,
    shortDescription:
      validated.data.shortDescription ?? current.shortDescription,
    tags: validated.data.tags,
    updatedAt: new Date().toISOString(),
  };
  if (validated.data.discount !== undefined) {
    setClause.discount = validated.data.discount;
  }

  const updated = await db
    .update(restaurantsTable)
    .set(setClause)
    .where(eq(restaurantsTable.id, RESTAURANT_ID))
    .returning({ id: restaurantsTable.id });
  if (updated.length === 0) {
    return { success: false, message: "Restaurant not found." };
  }

  revalidatePath("/dashboard/restaurant", "page");
  return { success: true, message: "Restaurant updated." };
}