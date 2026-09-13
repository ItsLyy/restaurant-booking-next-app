import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

import type { NextRequest } from "next/server";

const secretKey = new TextEncoder().encode(
  process.env.AUTH_SESSION_SECRET ?? "",
);

const PROTECTED_PREFIX = "/dashboard";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith(PROTECTED_PREFIX)) return NextResponse.next();

  const rawSession = request.cookies.get("resbook_session")?.value;
  if (!rawSession) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const { payload } = await jwtVerify(rawSession, secretKey, {
      algorithms: ["HS256"],
    });

    const role = payload.role as string | undefined;
    if (role !== "owner" && role !== "manager" && role !== "staff") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};