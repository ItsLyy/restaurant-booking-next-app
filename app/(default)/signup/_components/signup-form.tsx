"use client";

import { useState } from "react";

import Link from "next/link";

import {
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  LockSimpleIcon,
  UserIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Form } from "@components";
import PasswordField from "@components/auth/password-field";

import { SignupAction } from "../_actions/signup";

const REQUIREMENTS = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One number", test: (value: string) => /\d/.test(value) },
];

const PasswordStrength = ({ value }: { value: string }) => {
  const score = REQUIREMENTS.filter((item) => item.test(value)).length;
  const hasValue = value.length > 0;

  let label = "Too weak";
  let labelClass = "text-negative";
  if (score === 2) {
    label = "Fair";
    labelClass = "text-accent-200";
  } else if (score === 3) {
    label = "Strong";
    labelClass = "text-positive";
  }

  return (
    <div className="space-y-2">
      {hasValue ? (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3].map((step) => {
              const active = score >= step;
              let barClass = "bg-muted/40";
              if (active) {
                barClass =
                  score === 1
                    ? "bg-negative"
                    : score === 2
                      ? "bg-accent-200"
                      : "bg-positive";
              }
              return (
                <span
                  key={step}
                  className={`h-1 flex-1 rounded-full transition-colors ${barClass}`}
                />
              );
            })}
          </div>
          <span className={`text-c-caption font-medium ${labelClass}`}>
            {label}
          </span>
        </div>
      ) : null}
      <ul className="grid sm:grid-cols-3 gap-1">
        {REQUIREMENTS.map((item) => {
          const passed = item.test(value);
          return (
            <li
              key={item.label}
              className={`flex items-center gap-1 text-c-caption ${passed ? "text-positive" : "text-muted"}`}
            >
              {passed ? (
                <CheckCircleIcon
                  weight="fill"
                  className="size-3.5 shrink-0"
                />
              ) : (
                <span className="size-3.5 rounded-full border border-muted shrink-0" />
              )}
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const PasswordMatchHint = ({
  password,
  confirmation,
}: {
  password: string;
  confirmation: string;
}) => {
  if (!confirmation) return null;
  const match = password === confirmation;
  return (
    <span
      className={`flex items-center gap-1 text-c-caption ${match ? "text-positive" : "text-negative"}`}
    >
      {match ? (
        <CheckCircleIcon weight="fill" className="size-3.5" />
      ) : (
        <WarningCircleIcon className="size-3.5" />
      )}
      {match ? "Passwords match" : "Passwords do not match"}
    </span>
  );
};

const SignupForm = () => {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  return (
    <Form action={SignupAction} className="space-y-12">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:*:w-full">
          <Form.InputField
            id="first-name"
            label="First Name"
            placeholder="First Name"
            autoComplete="given-name"
            leftSlot={<UserIcon className="size-4" />}
          />
          <Form.InputField
            id="last-name"
            label="Last Name"
            placeholder="Last Name"
            autoComplete="family-name"
            leftSlot={<UserIcon className="size-4" />}
          />
        </div>
        <Form.InputField
          id="username"
          label="Username"
          placeholder="Choose a username"
          autoComplete="username"
          spellCheck={false}
          leftSlot={<UserIcon className="size-4" />}
        />
        <Form.InputField
          id="email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          leftSlot={<EnvelopeSimpleIcon className="size-4" />}
        />
        <PasswordField
          id="password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          labelRequired
          leftSlot={<LockSimpleIcon className="size-4" />}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrength value={password} />
        <PasswordField
          id="password-confirmation"
          label="Password Confirmation"
          placeholder="Repeat your password"
          autoComplete="new-password"
          labelRequired
          leftSlot={<LockSimpleIcon className="size-4" />}
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
        />
        <PasswordMatchHint password={password} confirmation={confirmation} />
      </div>
      <div className="space-y-2">
        <Form.SubmitButton className="w-full">
          Create account
        </Form.SubmitButton>
        <span className="text-c-button">
          Already have an account?{" "}
          <Link href="/signin" className="text-accent-100 hover:underline">
            Sign in here
          </Link>
        </span>
      </div>
    </Form>
  );
};

export default SignupForm;