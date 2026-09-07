"use server";

import z from "zod";

import type { FormState } from "@types";

const credentialsShape = {
  "first-name": z.string().min(1, "First name is required"),
  "last-name": z.string().min(1, "Last name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  "password-confirmation": z
    .string()
    .min(1, "Password confirmation is required"),
} as const;

const passwordRefinement = (data: {
  password: string;
  "password-confirmation": string;
}) => data.password === data["password-confirmation"];

const customerSchema = z
  .object({
    role: z.literal("customer"),
    ...credentialsShape,
  })
  .refine(passwordRefinement, {
    message: "Passwords do not match",
    path: ["password-confirmation"],
  });

const businessLicenseSchema = z
  .custom<File>((value) => value instanceof File, {
    message: "Business license file is required",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Business license must be 5MB or smaller",
  })
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
    { message: "Business license must be a JPG, PNG or PDF file" },
  );

const ownerSchema = z
  .object({
    role: z.literal("owner"),
    ...credentialsShape,
    "restaurant-name": z.string().min(1, "Restaurant name is required"),
    "business-license": businessLicenseSchema,
  })
  .refine(passwordRefinement, {
    message: "Passwords do not match",
    path: ["password-confirmation"],
  });

export async function SignupAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const role = formData.get("role");

  const data = {
    role,
    "first-name": formData.get("first-name"),
    "last-name": formData.get("last-name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    "password-confirmation": formData.get("password-confirmation"),
    ...(role === "owner"
      ? {
          "restaurant-name": formData.get("restaurant-name"),
          "business-license": formData.get("business-license"),
        }
      : {}),
  };

  const schema = role === "owner" ? ownerSchema : customerSchema;
  const validatedData = schema.safeParse(data);
  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error as z.ZodError).fieldErrors,
    };
  }

  if (validatedData.data.role === "owner") {
    const file = validatedData.data["business-license"];
    const businessLicensePath = `/uploads/business-licenses/${encodeURIComponent(file.name)}`;
    return { success: true, message: `Business license stored at ${businessLicensePath}` };
  }

  return {};
}