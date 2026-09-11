"use server";

import { redirect } from "next/navigation";

import z from "zod";

import type { FormState } from "@types";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/\d/, "Password must contain at least one number.");

const signupSchema = z
  .object({
    "first-name": z
      .string()
      .min(1, "First name is required.")
      .max(60, "First name must be 60 characters or fewer."),
    "last-name": z
      .string()
      .min(1, "Last name is required.")
      .max(60, "Last name must be 60 characters or fewer."),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(30, "Username must be 30 characters or fewer."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),
    password: passwordSchema,
    "password-confirmation": z
      .string()
      .min(1, "Password confirmation is required."),
  })
  .refine(
    (data) => data.password === data["password-confirmation"],
    {
      message: "Passwords do not match.",
      path: ["password-confirmation"],
    },
  );

export async function SignupAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const validated = signupSchema.safeParse({
    "first-name": formData.get("first-name"),
    "last-name": formData.get("last-name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    "password-confirmation": formData.get("password-confirmation"),
  });
  if (!validated.success) {
    return {
      errors: z.flattenError(validated.error as z.ZodError).fieldErrors,
    };
  }

  const email = validated.data.email;
  redirect(
    `/otp?email=${encodeURIComponent(email)}&next=${encodeURIComponent("/signup/role")}`,
  );
}