import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

import { getAccessRole } from "@data/auth/users";

import type { AuthAccount, AuthRole } from "@data/auth/users";
import type { JWTPayload } from "jose";

export type DashboardRole = "owner" | "manager" | "staff";

export interface SessionUser {
  userId: string;
  email: string;
  role: AuthRole;
}

const SESSION_COOKIE = "resbook_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const secretKey = new TextEncoder().encode(
  process.env.AUTH_SESSION_SECRET ?? "",
);

interface SessionClaims extends JWTPayload {
  email?: string;
  role?: AuthRole;
}

const encrypt = (claims: SessionClaims): Promise<string> =>
  new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

const decrypt = async (token: string): Promise<SessionClaims | null> => {
  try {
    const { payload } = await jwtVerify<SessionClaims>(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
};

export const createSession = async (account: AuthAccount): Promise<void> => {
  const token = await encrypt({
    sub: account.id,
    email: account.email,
    role: getAccessRole(account),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
};

export const deleteSession = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
};

export const updateSessionRole = async (role: AuthRole): Promise<void> => {
  const session = await verifySession();
  if (!session) return;
  const token = await encrypt({
    sub: session.userId,
    email: session.email,
    role,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
};

export const verifySession = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const claims = await decrypt(token);
  if (!claims?.sub || !claims.role) return null;

  return {
    userId: claims.sub,
    email: claims.email ?? "",
    role: claims.role,
  };
});

export const getAuthUser = async (): Promise<SessionUser | null> =>
  verifySession();

export const getDashboardRole = async (): Promise<DashboardRole | null> => {
  const user = await verifySession();
  if (user?.role === "manager" || user?.role === "staff") return user.role;
  if (user?.role === "owner") return "owner";
  return null;
};

export const getSessionOfficerId = async (): Promise<string | undefined> => {
  const user = await verifySession();
  if (user?.role === "manager" || user?.role === "staff") {
    return user.userId;
  }
  return undefined;
};

export const getCustomerSession = async (): Promise<SessionUser | null> => {
  const user = await verifySession();
  return user?.role === "customer" ? user : null;
};

export const getDinerSession = async (): Promise<SessionUser | null> =>
  verifySession();

export const requireDiner = async (
  nextPath: string,
): Promise<SessionUser> => {
  const user = await verifySession();
  if (user) return user;
  redirect(`/signin?next=${encodeURIComponent(nextPath)}`);
};

export const requireCustomer = async (
  nextPath: string,
): Promise<SessionUser> => {
  const user = await verifySession();
  if (user?.role === "customer") return user;
  if (user) redirect("/dashboard");
  redirect(`/signin?next=${encodeURIComponent(nextPath)}`);
};

export const requireOwner = async (): Promise<void> => {
  if ((await getDashboardRole()) !== "owner") notFound();
};

export const requireManagerOrAbove = async (): Promise<void> => {
  const role = await getDashboardRole();
  if (role === null) redirect("/signin");
  if (role === "staff") notFound();
};