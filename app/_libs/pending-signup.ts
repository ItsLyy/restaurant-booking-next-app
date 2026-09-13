import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import type { JWTPayload } from "jose";

const PENDING_COOKIE = "resbook_pending";
const PENDING_TTL = 10 * 60 * 1000;

const secretKey = new TextEncoder().encode(
  process.env.AUTH_SESSION_SECRET ?? "",
);

export interface PendingSignup {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  passwordHash: string;
}

interface PendingClaims extends JWTPayload {
  data?: PendingSignup;
}

export const setPendingSignup = async (
  data: PendingSignup,
): Promise<void> => {
  const token = await new SignJWT({ data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secretKey);

  const cookieStore = await cookies();
  cookieStore.set(PENDING_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PENDING_TTL / 1000,
  });
};

export const getPendingSignup = async (): Promise<PendingSignup | null> => {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PENDING_COOKIE)?.value;
  if (!raw) return null;

  try {
    const { payload } = await jwtVerify(
      raw,
      secretKey,
      { algorithms: ["HS256"] },
    );
    return (payload as PendingClaims).data ?? null;
  } catch {
    return null;
  }
};

export const clearPendingSignup = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_COOKIE);
};