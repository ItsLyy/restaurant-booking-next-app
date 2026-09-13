import { writeFile } from "fs/promises";
import path from "path";

import { readProfiles } from "@data/profiles/update-profile";

const OTP_PATH = path.join(process.cwd(), "app/_data/dummy/otp_tokens.json");

export interface OtpToken {
  id: string;
  email: string;
  code: string;
  type: "email_verification" | "password_reset" | "two_factor";
  expiresAt: string;
  createdAt: string;
}

const OTP_TTL_MS = 10 * 60 * 1000;

const writeOtpTokens = (rows: OtpToken[]): Promise<void> =>
  writeFile(OTP_PATH, `${JSON.stringify(rows, null, 2)}\n`, "utf8");

export const issueEmailVerificationOtp = async (
  email: string,
): Promise<string> => {
  const rows = readProfiles<OtpToken>(OTP_PATH);
  let maxNum = 0;
  for (const row of rows) {
    const n = Number.parseInt(row.id.replace(/^otp-/, ""), 10);
    if (Number.isFinite(n)) maxNum = Math.max(maxNum, n);
  }

  const now = new Date();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const token: OtpToken = {
    id: `otp-${String(maxNum + 1).padStart(3, "0")}`,
    email: email.toLowerCase(),
    code,
    type: "email_verification",
    expiresAt: new Date(now.getTime() + OTP_TTL_MS).toISOString(),
    createdAt: now.toISOString(),
  };

  await writeOtpTokens([token, ...rows]);
  console.log(
    `[auth] Email verification OTP for ${email}: ${code} (dev: no mail client)`,
  );
  return code;
};

export const verifyEmailOtp = async (
  email: string,
  code: string,
): Promise<boolean> => {
  const rows = readProfiles<OtpToken>(OTP_PATH);
  const index = rows.findIndex(
    (row) =>
      row.email.toLowerCase() === email.toLowerCase() &&
      row.code === code.trim() &&
      row.type === "email_verification" &&
      new Date(row.expiresAt).getTime() > Date.now(),
  );
  if (index === -1) return false;

  const nextRows = [...rows];
  nextRows.splice(index, 1);
  await writeOtpTokens(nextRows);
  return true;
};