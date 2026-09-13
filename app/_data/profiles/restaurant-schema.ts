import z from "zod";

export const restaurantFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Restaurant name is required.")
    .max(80, "Restaurant name must be 80 characters or fewer."),
  country: z
    .string()
    .trim()
    .min(1, "Country is required.")
    .max(60, "Country must be 60 characters or fewer."),
  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .max(60, "City must be 60 characters or fewer."),
  address: z
    .string()
    .trim()
    .min(1, "Address is required.")
    .max(200, "Address must be 200 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(2000, "Description must be 2000 characters or fewer."),
  shortDescription: z
    .string()
    .trim()
    .max(200, "Short description must be 200 characters or fewer.")
    .optional(),
  discount: z
    .number()
    .int()
    .min(0, "Discount cannot be negative.")
    .max(90, "Discount must be 90% or lower.")
    .optional(),
  tags: z
    .string()
    .transform((value) =>
      Array.from(
        new Set(
          value
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean),
        ),
      ).slice(0, 8),
    ),
});