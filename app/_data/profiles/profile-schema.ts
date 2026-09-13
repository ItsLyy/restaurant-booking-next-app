import z from "zod";

export const ALLERGY_OPTIONS = [
  "dairy",
  "gluten",
  "nuts",
  "peanuts",
  "seafood",
  "shellfish",
] as const;

const KNOWN_ALLERGIES = ALLERGY_OPTIONS as readonly string[];

export const profileFieldsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(60, "First name must be 60 characters or fewer."),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(60, "Last name must be 60 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address."),
  avatar: z
    .string()
    .trim()
    .max(500, "Avatar must be 500 characters or fewer.")
    .refine(
      (value) =>
        value === "" ||
        /^https?:\/\//.test(value) ||
        value.startsWith("/avatars/"),
      "Enter a valid image URL.",
    )
    .optional(),
  allergics: z
    .array(z.string())
    .default([])
    .transform((items) =>
      items.filter((item) => KNOWN_ALLERGIES.includes(item)),
    ),
});