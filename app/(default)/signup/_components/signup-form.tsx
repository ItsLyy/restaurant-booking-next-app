"use client";

import { useState } from "react";

import Link from "next/link";

import { Form } from "@components";
import { SignupAction } from "../_actions/signup";

type SignupRole = "customer" | "owner";

const ROLE_OPTIONS: { value: SignupRole; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "owner", label: "Restaurant Owner" },
];

const RoleToggle = ({
  role,
  onChange,
}: {
  role: SignupRole;
  onChange: (role: SignupRole) => void;
}) => {
  return (
    <div
      role="group"
      aria-label="Sign up as"
      className="grid grid-cols-2 gap-1 p-1 rounded-lg border border-muted bg-base-100"
    >
      {ROLE_OPTIONS.map((option) => {
        const active = role === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`h-10 rounded-md text-c-button transition cursor-pointer ${
              active
                ? "bg-accent-100 text-base-100"
                : "text-muted hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

const CredentialsFields = () => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:*:w-full">
        <Form.InputField
          id="first-name"
          label="First Name"
          placeholder="First Name"
        />
        <Form.InputField
          id="last-name"
          label="Last Name"
          placeholder="Last Name"
        />
      </div>
      <Form.InputField id="username" label="Username" placeholder="Username" />
      <Form.InputField id="email" label="Email" placeholder="Email" />
      <Form.InputField
        id="password"
        label="Password"
        placeholder="Password"
        type="password"
      />
      <Form.InputField
        id="password-confirmation"
        label="Password Confirmation"
        placeholder="Password Confirmation"
        type="password"
      />
    </div>
  );
};

const FormFooter = () => {
  return (
    <div className="space-y-2">
      <Form.SubmitButton className="w-full">Signup</Form.SubmitButton>
      <span className="text-c-button">
        Already have an account?{" "}
        <Link href="/signin" className="text-accent-100">
          Signin here
        </Link>
      </span>
    </div>
  );
};

const CustomerSignupForm = () => {
  return (
    <Form action={SignupAction} className="space-y-12">
      <input type="hidden" name="role" value="customer" />
      <CredentialsFields />
      <FormFooter />
    </Form>
  );
};

const OwnerSignupForm = () => {
  return (
    <Form action={SignupAction} className="space-y-12">
      <input type="hidden" name="role" value="owner" />
      <CredentialsFields />
      <div className="space-y-3">
        <Form.InputField
          id="restaurant-name"
          label="Restaurant Name"
          placeholder="Restaurant Name"
        />
        <Form.FileField
          id="business-license"
          label="Business License"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        />
      </div>
      <FormFooter />
    </Form>
  );
};

const SignupForm = () => {
  const [role, setRole] = useState<SignupRole>("customer");
  return (
    <div className="space-y-6">
      <RoleToggle role={role} onChange={setRole} />
      {role === "customer" ? <CustomerSignupForm /> : <OwnerSignupForm />}
    </div>
  );
};

export default SignupForm;