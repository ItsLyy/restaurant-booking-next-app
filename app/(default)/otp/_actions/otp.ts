"use server";

import { redirect } from "next/navigation";

import z from "zod";

import { registerUser } from "@libs/session";
import type { FormState } from "@types";

const DEFAULT_TARGET = "/signup/role";

export async function verifyOTPAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const otp = formData.get("otp");
  const next = formData.get("next");
  const email = formData.get("email");

  const validated = z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
    .safeParse(otp);

  if (!validated.success) {
    return { success: false, message: validated.error.issues[0].message };
  }

  if (typeof email === "string" && email.trim()) {
    await registerUser({ email: email.trim() });
  }

  const target =
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//")
      ? next
      : DEFAULT_TARGET;

  redirect(target);
}