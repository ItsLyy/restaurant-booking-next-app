"use server";

import z from "zod";

import type { FormState } from "@types";

export async function SigninAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const username = formData.get("username");
  const password = formData.get("password");

  const validate = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  const validatedData = validate.safeParse({ username, password });
  if (!validatedData.success) {
    return { errors: z.flattenError(validatedData.error).fieldErrors };
  }

  return {
    success: true,
    message: `Signin successful! welcome back ${username}`,
  };
}
