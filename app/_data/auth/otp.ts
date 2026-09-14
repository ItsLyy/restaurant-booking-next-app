import "server-only";

import { randomUUID } from "crypto";

import { and, eq } from "drizzle-orm";

import { db } from "@db/client";
import { otpTokens } from "@db/schema";

export interface OtpToken {
  id: string;
  email: string;
  code: string;
  type: "email_verification" | "password_reset" | "two_factor";
  expiresAt: string;
  createdAt: string;
}

const OTP_TTL_MS = 10 * 60 * 1000;

export const issueEmailVerificationOtp = async (
  email: string,
): Promise<string> => {
  const now = new Date();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const token: OtpToken = {
    id: `otp-${randomUUID()}`,
    email: email.toLowerCase(),
    code,
    type: "email_verification",
    expiresAt: new Date(now.getTime() + OTP_TTL_MS).toISOString(),
    createdAt: now.toISOString(),
  };

  await db.insert(otpTokens).values({
    id: token.id,
    email: token.email,
    code: token.code,
    type: token.type,
    expiresAt: token.expiresAt,
    createdAt: token.createdAt,
  });
  console.log(
    `[auth] Email verification OTP for ${email}: ${code} (dev: no mail client)`,
  );
  return code;
};

export const verifyEmailOtp = async (
  email: string,
  code: string,
): Promise<boolean> => {
  const rows = await db
    .select()
    .from(otpTokens)
    .where(
      and(
        eq(otpTokens.email, email.toLowerCase()),
        eq(otpTokens.code, code.trim()),
        eq(otpTokens.type, "email_verification"),
      ),
    )
    .limit(1);
  const token = rows[0];
  if (!token) return false;
  if (new Date(token.expiresAt).getTime() <= Date.now()) return false;

  await db.delete(otpTokens).where(eq(otpTokens.id, token.id));
  return true;
};