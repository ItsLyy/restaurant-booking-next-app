import { NextResponse } from "next/server";

import { completeGoogleAuthorization } from "@libs/auth/google";

import type { NextRequest } from "next/server";

const fallback = () =>
  NextResponse.redirect(
    `${process.env.AUTH_URL ?? "http://localhost:3000"}/signin`,
  );

export async function GET(request: NextRequest) {
  const result = await completeGoogleAuthorization(request.nextUrl.searchParams);
  if (!result.ok || !result.redirectTarget) return fallback();

  const base = process.env.AUTH_URL ?? "http://localhost:3000";
  const target = result.redirectTarget.startsWith("/")
    ? `${base}${result.redirectTarget}`
    : result.redirectTarget;
  return NextResponse.redirect(target);
}