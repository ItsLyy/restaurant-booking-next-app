import AuthCard from "@components/auth/auth-card";
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

export default function SigninPage() {
  return (
    <AuthCard title="Sign In" subtitle="Welcome back! Please enter your credentials.">
      <SigninForm />
    </AuthCard>
  );
}