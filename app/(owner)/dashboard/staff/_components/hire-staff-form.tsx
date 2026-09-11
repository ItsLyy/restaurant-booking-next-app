"use client";

import { UserPlusIcon } from "@phosphor-icons/react/dist/ssr";

import { Form } from "@components";
import { useFormContext } from "@components/general/form";

import { hireStaffAction } from "../_actions/hire-staff-action";

const PositionField = () => {
  const { state } = useFormContext();
  const fieldError = state.errors?.position?.[0];

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="position"
        className="text-c-caption font-medium"
      >
        Position <span className="text-negative">*</span>
      </label>
      <select
        id="position"
        name="position"
        defaultValue="staff"
        aria-invalid={fieldError ? true : undefined}
        className={`px-4 h-10 w-full border bg-base-200 text-foreground rounded-lg text-c-button focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 ease-in-out transition-colors duration-300 ${
          fieldError ? "border-negative" : "border-muted"
        }`}
      >
        <option value="manager">Manager</option>
        <option value="staff">Staff</option>
      </select>
      {fieldError ? (
        <span className="text-c-caption text-negative">{fieldError}</span>
      ) : null}
    </div>
  );
};

export const HireStaffForm = () => {
  return (
    <Form action={hireStaffAction} className="space-y-6">
      <div className="space-y-3">
        <Form.InputField
          id="first-name"
          label="First name"
          labelRequired
          placeholder="e.g. Kenji"
          leftSlot={<UserPlusIcon className="size-4" />}
        />
        <Form.InputField
          id="last-name"
          label="Last name"
          labelRequired
          placeholder="e.g. Watanabe"
        />
        <Form.InputField
          id="email"
          label="Email"
          type="email"
          labelRequired
          placeholder="kenji@example.com"
        />
        <Form.InputField
          id="username"
          label="Username"
          labelRequired
          placeholder="kenji_watanabe"
        />
        <PositionField />
      </div>
      <Form.SubmitButton className="w-full">
        Add staff member
      </Form.SubmitButton>
    </Form>
  );
};