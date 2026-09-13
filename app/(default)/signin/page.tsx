import AuthCard from "@components/auth/auth-card";

import { safeNextPath } from "@libs/safe-next";
import SigninForm from "./_components/signin-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(typeof next === "string" ? next : null);

  return (
    <AuthCard title="Sign In" subtitle="Welcome back! Please enter your credentials.">
      <SigninForm next={nextPath} />
    </AuthCard>
  );
}