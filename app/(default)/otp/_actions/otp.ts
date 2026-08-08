"use server";

import z from "zod";

import type { FormState } from "@types";

export async function verifyOTPAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const otp = formData.get("otp");

  const validated = z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
    .safeParse(otp);

  if (!validated.success) {
    return { success: false, message: validated.error.issues[0].message };
  }

  return { success: true, message: "OTP verified successfully" };
}
