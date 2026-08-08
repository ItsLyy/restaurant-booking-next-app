"use server";

import z from "zod";

import type { FormState } from "@types";

export async function SignupAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const firstName = formData.get("first-name");
  const lastName = formData.get("last-name");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const passwordConfirmation = formData.get("password-confirmation");

  const validate = z
    .object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      username: z.string().min(1, "Username is required"),
      email: z.string().min(1, "Email is required").email("Invalid email"),
      password: z.string().min(1, "Password is required"),
      "password-confirmation": z
        .string()
        .min(1, "Password confirmation is required"),
    })
    .refine(
      (data) => {
        return data.password == data["password-confirmation"];
      },
      { message: "Passwords do not match", path: ["password-confirmation"] },
    );

  const validatedData = validate.safeParse({
    firstName,
    lastName,
    username,
    email,
    password,
    "password-confirmation": passwordConfirmation,
  });
  if (!validatedData.success) {
    return { errors: z.flattenError(validatedData.error).fieldErrors };
  }
  return {};
}
