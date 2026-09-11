"use client";

import { useEffect } from "react";
import { useActionState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@components";

import type { FormAction, FormState } from "@types";

const inputBase =
  "px-4 h-10 border border-muted bg-base-200 text-foreground placeholder:text-muted/60 rounded-lg text-c-button focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 ease-in-out transition-colors duration-300";

const textAreaBase = `${inputBase} h-28 py-2 resize-none`;

export interface RestaurantEditInitial {
  name: string;
  country: string;
  city: string;
  address: string;
  description: string;
  shortDescription?: string;
  discount?: number;
  tags: string[];
}

export const RestaurantEditForm = ({
  action,
  initial,
}: {
  action: FormAction;
  initial: RestaurantEditInitial;
}) => {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  useEffect(() => {
    if (!state.success) return;
    toast.success(state.message ?? "Restaurant updated.");
    router.refresh();
  }, [state, router]);

  const errors = state.errors ?? {};
  const fieldError = (id: string) => errors[id]?.[0];

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-c-caption font-medium">
            Restaurant name<span className="text-negative">*</span>
          </span>
          <input
            name="name"
            type="text"
            required
            defaultValue={initial.name}
            className={inputBase}
          />
          {fieldError("name") ? (
            <span className="text-c-caption text-negative">
              {fieldError("name")}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-c-caption font-medium">
            Country<span className="text-negative">*</span>
          </span>
          <input
            name="country"
            type="text"
            required
            defaultValue={initial.country}
            className={inputBase}
          />
          {fieldError("country") ? (
            <span className="text-c-caption text-negative">
              {fieldError("country")}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-c-caption font-medium">
            City<span className="text-negative">*</span>
          </span>
          <input
            name="city"
            type="text"
            required
            defaultValue={initial.city}
            className={inputBase}
          />
          {fieldError("city") ? (
            <span className="text-c-caption text-negative">
              {fieldError("city")}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-c-caption font-medium">
            Address<span className="text-negative">*</span>
          </span>
          <input
            name="address"
            type="text"
            required
            defaultValue={initial.address}
            className={inputBase}
          />
          {fieldError("address") ? (
            <span className="text-c-caption text-negative">
              {fieldError("address")}
            </span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-c-caption font-medium">Tags</span>
          <input
            name="tags"
            type="text"
            defaultValue={initial.tags.join(", ")}
            placeholder="japanese, sushi, omakase"
            className={inputBase}
          />
          <span className="text-c-caption text-muted">
            Comma-separated keywords, max 8.
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-c-caption font-medium">Member discount (%)</span>
          <input
            name="discount"
            type="number"
            min={0}
            max={90}
            defaultValue={initial.discount ?? ""}
            placeholder="0"
            className={inputBase}
          />
          {fieldError("discount") ? (
            <span className="text-c-caption text-negative">
              {fieldError("discount")}
            </span>
          ) : null}
        </label>

        <div className="hidden sm:block" />

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-c-caption font-medium">Short description</span>
          <input
            name="shortDescription"
            type="text"
            defaultValue={initial.shortDescription ?? ""}
            className={inputBase}
          />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-c-caption font-medium">
            Description<span className="text-negative">*</span>
          </span>
          <textarea
            name="description"
            required
            defaultValue={initial.description}
            className={textAreaBase}
          />
          {fieldError("description") ? (
            <span className="text-c-caption text-negative">
              {fieldError("description")}
            </span>
          ) : null}
        </label>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          className="rounded-md! h-10! px-6!"
        >
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
};