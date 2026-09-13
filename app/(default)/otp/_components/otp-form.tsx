"use client";

import { useEffect, useRef, useState } from "react";

import { Form } from "@components";

import { verifyOTPAction } from "../_actions/otp";

import type { InputHTMLAttributes } from "react";

const OTP_LENGTH = 6;
const RESEND_DELAY = 30;

interface OTPSlot {
  id: number;
  value: string;
}

const createEmptyCodeSlots = (): OTPSlot[] =>
  Array.from({ length: OTP_LENGTH }, (_, id) => ({ id, value: "" }));

const OTPForm = ({
  next,
  email,
}: {
  next: string;
  email: string;
}) => {
  const [codes, setCodes] = useState(createEmptyCodeSlots);
  const inputRef = useRef<HTMLInputElement[]>([]);
  const submitRef = useRef<HTMLButtonElement>(null);
  const [resendCooldown, setResendCooldown] = useState(RESEND_DELAY);

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const otpValue = codes.map((slot) => slot.value).join("");

  useEffect(() => {
    if (otpValue.length === OTP_LENGTH) {
      const id = setTimeout(() => submitRef.current?.click(), 50);
      return () => clearTimeout(id);
    }
  }, [otpValue]);

  const setSlot = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCodes((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, value: digit } : slot)),
    );
    if (digit && index < OTP_LENGTH - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !codes[index].value && index > 0) {
      setCodes((prev) =>
        prev.map((slot, i) =>
          i === index - 1 ? { ...slot, value: "" } : slot,
        ),
      );
      inputRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    setCodes((prev) => {
      const next = [...prev];
      for (let i = 0; i < pasted.length && i < OTP_LENGTH; i += 1) {
        next[i] = { ...next[i], value: pasted[i] };
      }
      return next;
    });

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    setTimeout(() => inputRef.current[focusIndex]?.focus(), 0);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setCodes(createEmptyCodeSlots());
    setResendCooldown(RESEND_DELAY);
    setTimeout(() => inputRef.current[0]?.focus(), 0);
  };

  return (
    <Form className="space-y-12" action={verifyOTPAction}>
      <input type="hidden" name="otp" value={otpValue} />
      <input type="hidden" name="next" value={next} />
      <input type="hidden" name="email" value={email} />
      <div className="grid grid-cols-6 gap-2 sm:gap-3 w-full" role="group" aria-label="One-time code">
        {codes.map((slot, index) => (
          <InputCode
            key={slot.id}
            value={slot.value}
            ref={inputRef}
            index={index}
            onChange={(event) => setSlot(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={handlePaste}
          />
        ))}
      </div>
      <div className="space-y-2">
        <Form.SubmitButton className="w-full">Verify</Form.SubmitButton>
        <span className="text-c-button">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            disabled={resendCooldown > 0}
            onClick={handleResend}
            className={`transition-colors ${
              resendCooldown > 0
                ? "text-muted cursor-not-allowed"
                : "text-accent-100 hover:underline cursor-pointer"
            }`}
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
        </span>
      </div>
    </Form>
  );
};

interface InputCodeProps extends InputHTMLAttributes<HTMLInputElement> {
  ref: React.RefObject<HTMLInputElement[]>;
  index: number;
}

const InputCode = ({ ref, index, ...props }: InputCodeProps) => {
  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      aria-label={`Digit ${index + 1}`}
      maxLength={1}
      className="h-14 w-full border border-muted bg-base-200 text-foreground text-center text-xl font-semibold rounded-xl caret-transparent focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 transition-colors"
      ref={(el: HTMLInputElement | null) => {
        ref.current[index] = el as HTMLInputElement;
      }}
    />
  );
};

export default OTPForm;