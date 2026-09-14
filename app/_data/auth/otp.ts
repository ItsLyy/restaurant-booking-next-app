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
  // No mail client is configured, so no email is actually sent. The generated
  // code is logged to the server console. Wire a mailer here for real delivery.
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const now = new Date();
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
    `[auth] Email verification OTP for ${token.email}: ${code} (no mail client configured — check the README to enable real delivery)`,
  );

  return code;
};

export const verifyEmailOtp = async (
  email: string,
  code: string,
): Promise<boolean> => {
  // ---------------------------------------------------------------------------
  // DEMO OTP BYPASS (OFF)
  // ---------------------------------------------------------------------------
  // Accepts ANY 6-digit code. Re-enable this (and comment the STRICT BLOCK)
  // for local demos without a mail client — see README "OTP in demo mode".
  // return true;

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
