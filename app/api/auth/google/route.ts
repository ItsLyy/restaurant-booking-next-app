import { NextResponse } from "next/server";

import { beginGoogleAuthorization } from "@libs/auth/google";

export async function GET() {
  const url = await beginGoogleAuthorization();
  return NextResponse.redirect(url);
}