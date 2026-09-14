"use server";

import { redirect } from "next/navigation";

import z from "zod";

import { verifyEmailOtp } from "@data/auth/otp";
import { createCustomerAccount } from "@data/auth/users";
import { clearPendingSignup, getPendingSignup } from "@libs/pending-signup";
import { createSession } from "@libs/session";
import type { FormState } from "@types";

const DEFAULT_TARGET = "/signup/role";

export async function verifyOTPAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const otp = formData.get("otp");
  const next = formData.get("next");
  const emailParam = formData.get("email");

  const validated = z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
    .safeParse(otp);

  if (!validated.success) {
    return { success: false, message: validated.error.issues[0].message };
  }

  const pending = await getPendingSignup();
  const email =
    typeof emailParam === "string" && emailParam.trim()
      ? emailParam.trim()
      : pending?.email;

  if (!email) {
    return { success: false, message: "Signup session expired. Try again." };
  }

  if (!(await verifyEmailOtp(email, validated.data))) {
    return {
      success: false,
      message: "Invalid or expired code. Please try again.",
    };
  }

  if (!pending || pending.email.toLowerCase() !== email.toLowerCase()) {
    return { success: false, message: "Signup session expired. Try again." };
  }

  const account = await createCustomerAccount({
    firstName: pending.firstName,
    lastName: pending.lastName,
    username: pending.username,
    email: pending.email,
    password: pending.passwordHash,
  });

  await clearPendingSignup();
  await createSession(account);

  const target =
    typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
      ? next
      : DEFAULT_TARGET;

  redirect(target);
}
