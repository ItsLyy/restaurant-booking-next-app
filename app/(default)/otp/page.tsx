import { redirect } from "next/navigation";

import AuthCard from "@components/auth/auth-card";
import { getPendingSignup } from "@libs/pending-signup";
import OTPForm from "./_components/otp-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Verification",
  description: "Enter the one-time code sent to your email",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OTPPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { next, email } = await searchParams;

  const nextPath =
    typeof next === "string" && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/signup/role";
  const targetEmail = typeof email === "string" ? email : "";
  const pending = await getPendingSignup();

  if (!targetEmail && !pending?.email) {
    redirect("/signup");
  }

  return (
    <AuthCard
      step={2}
      title="OTP Verification"
      subtitle={
        targetEmail
          ? `Enter the one-time code sent to ${targetEmail}.`
          : "Enter the one-time code sent to your email."
      }
    >
      <OTPForm next={nextPath} email={targetEmail} />
    </AuthCard>
  );
}