"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CircleNotchIcon,
  EnvelopeSimpleIcon,
  UserIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";
import type { FormAction, FormState } from "@types";

import { AllergySelector } from "./allergy-selector";
import { AvatarUploader } from "./avatar-uploader";

export interface ProfileEditInitial {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  allergics: string[];
}

export interface ProfileEditFormProps {
  action: FormAction;
  initial: ProfileEditInitial;
  submitLabel?: string;
  pendingLabel?: string;
  successMessage?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  className?: string;
}

export const ProfileEditForm = ({
  action,
  initial,
  submitLabel = "Save changes",
  pendingLabel = "Saving…",
  successMessage = "Profile updated.",
  onCancel,
  onSuccess,
  className = "",
}: ProfileEditFormProps) => {
  const router = useRouter();

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  useEffect(() => {
    if (!state.success) return;
    toast.success(state.message ?? successMessage);
    onSuccess?.();
    router.refresh();
  }, [state, router, successMessage, onSuccess]);

  const errors = state.errors ?? {};
  const fieldError = (id: string) => errors[id]?.[0];

  const fullName = `${initial.firstName} ${initial.lastName}`.trim();

  return (
    <form action={formAction} className={`flex flex-col gap-6 ${className}`}>
      {/* 1. Interactive Avatar Uploader with Live Preview */}
      <AvatarUploader
        initialAvatar={initial.avatar}
        fullName={fullName}
        error={fieldError("avatar")}
      />

      {/* 2. Personal Information Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            First name <span className="text-negative">*</span>
          </span>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <UserIcon className="size-4" />
            </div>
            <input
              name="firstName"
              type="text"
              required
              defaultValue={initial.firstName}
              placeholder="First name"
              className="w-full pl-9 pr-3.5 h-10 bg-base-100 border border-muted/60 rounded-xl text-foreground placeholder:text-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 transition-colors"
            />
          </div>
          {fieldError("firstName") && (
            <span className="flex items-center gap-1 text-xs text-negative">
              <WarningCircleIcon className="size-3.5 shrink-0" />
              {fieldError("firstName")}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Last name <span className="text-negative">*</span>
          </span>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <UserIcon className="size-4" />
            </div>
            <input
              name="lastName"
              type="text"
              required
              defaultValue={initial.lastName}
              placeholder="Last name"
              className="w-full pl-9 pr-3.5 h-10 bg-base-100 border border-muted/60 rounded-xl text-foreground placeholder:text-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 transition-colors"
            />
          </div>
          {fieldError("lastName") && (
            <span className="flex items-center gap-1 text-xs text-negative">
              <WarningCircleIcon className="size-3.5 shrink-0" />
              {fieldError("lastName")}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Email address <span className="text-negative">*</span>
          </span>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
              <EnvelopeSimpleIcon className="size-4" />
            </div>
            <input
              name="email"
              type="email"
              required
              defaultValue={initial.email}
              placeholder="you@example.com"
              className="w-full pl-9 pr-3.5 h-10 bg-base-100 border border-muted/60 rounded-xl text-foreground placeholder:text-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 transition-colors"
            />
          </div>
          {fieldError("email") && (
            <span className="flex items-center gap-1 text-xs text-negative">
              <WarningCircleIcon className="size-3.5 shrink-0" />
              {fieldError("email")}
            </span>
          )}
        </label>
      </div>

      {/* 3. Food Allergies & Dietary Restrictions */}
      <AllergySelector initialAllergies={initial.allergics} />

      {/* 4. Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-muted/40">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={pending}
            className="rounded-xl! h-10! px-5! text-xs!"
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="rounded-xl! h-10! px-6! text-xs! flex items-center gap-2"
        >
          {pending ? (
            <>
              <CircleNotchIcon className="size-4 animate-spin" />
              <span>{pendingLabel}</span>
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
};