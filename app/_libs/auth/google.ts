import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import { base64url, createRemoteJWKSet, jwtVerify } from "jose";

import { findAccountByEmail, createCustomerAccount } from "@data/auth/users";
import type { AuthAccount } from "@data/auth/users";
import { hashPassword } from "@libs/password";
import { createSession } from "@libs/session";

const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const GOOGLE_AUTH_HOST = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_HOST = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs";

const googleClientId = () => process.env.AUTH_GOOGLE_CLIENT_ID ?? "";
const googleClientSecret = () =>
  process.env.AUTH_GOOGLE_CLIENT_SECRET ?? "";

const redirectUri = () =>
  `${process.env.AUTH_URL ?? "http://localhost:3000"}/api/auth/google/callback`;

const base64UrlEncode = (value: Uint8Array): string => base64url.encode(value);

const COOKIE_NAMES = {
  state: "oauth_state",
  nonce: "oauth_nonce",
  pkce: "oauth_pkce",
} as const;

const oauthCookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 600,
};

export const beginGoogleAuthorization = async (): Promise<string> => {
  const verifier = base64UrlEncode(randomBytes(32));
  const challenge = base64UrlEncode(
    createHash("sha256").update(verifier).digest(),
  );
  const state = randomBytes(16).toString("hex");
  const nonce = randomBytes(16).toString("hex");

  const store = await cookies();
  store.set(COOKIE_NAMES.state, state, oauthCookieOpts);
  store.set(COOKIE_NAMES.nonce, nonce, oauthCookieOpts);
  store.set(COOKIE_NAMES.pkce, verifier, oauthCookieOpts);

  const params = new URLSearchParams({
    client_id: googleClientId(),
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
    access_type: "online",
  });

  return `${GOOGLE_AUTH_HOST}?${params.toString()}`;
};

export interface GoogleCallbackResult {
  ok: boolean;
  redirectTarget?: string;
}

interface GoogleIdTokenClaims {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  nonce?: string;
}

export const completeGoogleAuthorization = async (
  searchParams: URLSearchParams,
): Promise<GoogleCallbackResult> => {
  const errorParam = searchParams.get("error");
  if (errorParam) return { ok: false };

  const store = await cookies();
  const expectedState = store.get(COOKIE_NAMES.state)?.value;
  const nonce = store.get(COOKIE_NAMES.nonce)?.value;
  const verifier = store.get(COOKIE_NAMES.pkce)?.value;

  store.delete(COOKIE_NAMES.state);
  store.delete(COOKIE_NAMES.nonce);
  store.delete(COOKIE_NAMES.pkce);

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (
    !code ||
    !state ||
    !expectedState ||
    state !== expectedState ||
    !nonce ||
    !verifier
  ) {
    return { ok: false };
  }

  const google = await exchangeCodeForTokens(code, verifier);
  if (!google) return { ok: false };

  const claims = await verifyGoogleIdToken(google.idToken, nonce);
  if (!claims || !claims.email) return { ok: false };

  if (!claims.email_verified) return { ok: false };

  const account = await linkOrCreateAccount(claims);
  if (!account) return { ok: false };

  await createSession(account);
  return { ok: true, redirectTarget: account.role === "customer" ? "/" : "/dashboard" };
};

const exchangeCodeForTokens = async (
  code: string,
  verifier: string,
): Promise<{ idToken: string } | null> => {
  try {
    const params = new URLSearchParams({
      code,
      client_id: googleClientId(),
      client_secret: googleClientSecret(),
      redirect_uri: redirectUri(),
      grant_type: "authorization_code",
      code_verifier: verifier,
    });

    const response = await fetch(GOOGLE_TOKEN_HOST, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!response.ok) return null;

    const body = (await response.json()) as { id_token?: string };
    if (!body.id_token) return null;
    return { idToken: body.id_token };
  } catch {
    return null;
  }
};

const googleJwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URI));

const verifyGoogleIdToken = async (
  idToken: string,
  expectedNonce: string,
): Promise<GoogleIdTokenClaims | null> => {
  try {
    const { payload } = await jwtVerify(idToken, googleJwks, {
      issuer: GOOGLE_ISSUERS,
      audience: googleClientId(),
      algorithms: ["RS256"],
      clockTolerance: 60,
    });

    const claims = payload as GoogleIdTokenClaims;
    if (claims.nonce !== expectedNonce) return null;
    return claims;
  } catch {
    return null;
  }
};

const linkOrCreateAccount = async (
  claims: GoogleIdTokenClaims,
): Promise<AuthAccount | undefined> => {
  const email = claims.email?.toLowerCase();
  if (!email) return undefined;

  const existing = findAccountByEmail(email);
  if (existing) return existing;

  const name = claims.name?.trim() ?? email;
  const [firstName, ...rest] = name.split(/\s+/);
  const tempHash = await hashPassword(randomBytes(32).toString("hex"));
  const usernameBase = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  const suffix = Date.now().toString(36).slice(-4);

  return createCustomerAccount({
    firstName: firstName || "Guest",
    lastName: rest.join(" ") || "User",
    username: `${usernameBase || "user"}${suffix}`,
    email,
    password: tempHash,
    avatar: claims.picture ?? "",
    emailVerifyAt: new Date().toISOString(),
  });
};