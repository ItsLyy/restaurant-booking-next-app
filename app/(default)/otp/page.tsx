import OTPForm from "./_components/otp-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Verification",
  description: "Enter OTP Code sended to your email",
};

export default function OTPPage() {
  return (
    <section className="flex min-h-svh w-full justify-center items-center px-4 py-8">
      <div className="w-full max-w-125 h-fit p-5 sm:p-6 bg-base-200 border border-muted rounded-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-c-header-lg text-foreground">OTP Verification</h1>
          <span className="text-c-body">
            Enter OTP Code sent to example@example.com
          </span>
        </header>
        <OTPForm />
      </div>
    </section>
  );
}
