"use client";

import {
  useEffect,
  useActionState,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  CircleNotchIcon,
  GlobeIcon,
  MapPinIcon,
  PercentIcon,
  SignpostIcon,
  StorefrontIcon,
  TextAlignLeftIcon,
  TextTIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";

import type { ReactNode } from "react";
import type { KeyboardEvent } from "react";
import type { ComponentType } from "react";
import type { IconProps } from "@phosphor-icons/react";
import type { FormAction, FormState } from "@types";

const fieldStyles =
  "w-full pl-9 pr-3.5 h-10 bg-base-100 border border-muted/60 rounded-xl text-foreground placeholder:text-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 transition-colors";

const textAreaStyles =
  "w-full pl-9 pr-3.5 py-2.5 min-h-28 resize-y bg-base-100 border border-muted/60 rounded-xl text-foreground placeholder:text-muted/60 text-sm focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 transition-colors";

const labelStyles = "flex flex-col gap-1.5";

const hintStyles = "flex items-center gap-1 text-xs text-muted";

const errorStyles =
  "flex items-center gap-1 text-xs text-negative";

const FieldIcon = ({
  icon: Icon,
  className = "",
}: {
  icon: ComponentType<IconProps>;
  className?: string;
}) => (
  <span className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted ${className}`}>
    <Icon className="size-4" />
  </span>
);

const SectionTitle = ({
  icon: Icon,
  children,
}: {
  icon: ComponentType<IconProps>;
  children: ReactNode;
}) => (
  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground sm:col-span-2">
    <Icon className="size-4 text-accent-200" />
    {children}
  </h3>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <span className={errorStyles}>
      <WarningCircleIcon className="size-3.5 shrink-0" />
      {message}
    </span>
  ) : null;

const TagsField = ({ defaultValue }: { defaultValue: string[] }) => {
  const [tags, setTags] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const tag = value.trim().toLowerCase();
    if (!tag || tags.includes(tag) || tags.length >= 8) return;
    setTags((prev) => [...prev, tag]);
    setDraft("");
  };

  const removeTag = (index: number) =>
    setTags((prev) => prev.filter((_, i) => i !== index));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key === "Enter" || key === ",") {
      event.preventDefault();
      addTag(draft);
    } else if (key === "Backspace" && draft === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className={labelStyles}>
      <label
        htmlFor="restaurant-tags-input"
        className="text-xs font-semibold text-foreground flex items-center gap-1"
      >
        Tags
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex flex-wrap items-center gap-1.5 min-h-10 px-3 py-2 bg-base-100 border border-muted/60 rounded-xl cursor-text transition-colors focus-within:ring-2 focus-within:ring-accent-200/20 focus-within:border-accent-200"
      >
        {tags.map((tag, index) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-accent-200/20 py-0.5 pl-2.5 pr-1 text-xs font-medium text-accent-200 capitalize"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={(event) => {
                event.stopPropagation();
                removeTag(index);
              }}
              className="grid place-items-center size-4 rounded-full cursor-pointer hover:bg-accent-200/30 transition-colors"
            >
              <XIcon weight="bold" className="size-3" />
            </button>
          </span>
        ))}
        <input
          id="restaurant-tags-input"
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "e.g. japanese, sushi, omakase" : "Add…"}
          aria-label="Add tag"
          className="flex-1 min-w-24 bg-transparent py-0 text-sm text-foreground placeholder:text-muted/60 outline-none"
        />
      </div>
      <input type="hidden" name="tags" value={tags.join(", ")} />
      <div className="flex items-center justify-between text-xs text-muted">
        <span className={hintStyles}>Press Enter or comma to add.</span>
        <span className={`${tags.length >= 8 ? "text-negative" : ""} tabular-nums`}>
          {tags.length}/8
        </span>
      </div>
    </div>
  );
};

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
  const [description, setDescription] = useState(initial.description);

  useEffect(() => {
    if (!state.success) return;
    toast.success(state.message ?? "Restaurant updated.");
    router.refresh();
  }, [state, router]);

  const errors = state.errors ?? {};
  const fieldError = (id: string) => errors[id]?.[0];

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <SectionTitle icon={StorefrontIcon}>Restaurant information</SectionTitle>

        <label className={`${labelStyles} sm:col-span-2`}>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Restaurant name <span className="text-negative">*</span>
          </span>
          <div className="relative">
            <FieldIcon icon={StorefrontIcon} />
            <input
              name="name"
              type="text"
              required
              defaultValue={initial.name}
              placeholder="The Green Garden"
              className={fieldStyles}
            />
          </div>
          <FieldError message={fieldError("name")} />
        </label>

        <label className={`${labelStyles} sm:col-span-2`}>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Short description
          </span>
          <div className="relative">
            <FieldIcon icon={TextTIcon} />
            <input
              name="shortDescription"
              type="text"
              defaultValue={initial.shortDescription ?? ""}
              placeholder="Seasonal tasting menu in the heart of the city"
              className={fieldStyles}
            />
          </div>
          <span className={hintStyles}>
            Shown on cards and search results. 200 characters max.
          </span>
        </label>

        <SectionTitle icon={MapPinIcon}>Location</SectionTitle>

        <label className={labelStyles}>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Country <span className="text-negative">*</span>
          </span>
          <div className="relative">
            <FieldIcon icon={GlobeIcon} />
            <input
              name="country"
              type="text"
              required
              defaultValue={initial.country}
              placeholder="Italy"
              className={fieldStyles}
            />
          </div>
          <FieldError message={fieldError("country")} />
        </label>

        <label className={labelStyles}>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            City <span className="text-negative">*</span>
          </span>
          <div className="relative">
            <FieldIcon icon={MapPinIcon} />
            <input
              name="city"
              type="text"
              required
              defaultValue={initial.city}
              placeholder="Florence"
              className={fieldStyles}
            />
          </div>
          <FieldError message={fieldError("city")} />
        </label>

        <label className={`${labelStyles} sm:col-span-2`}>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Address <span className="text-negative">*</span>
          </span>
          <div className="relative">
            <FieldIcon icon={SignpostIcon} />
            <input
              name="address"
              type="text"
              required
              defaultValue={initial.address}
              placeholder="12 Via dei Neri"
              className={fieldStyles}
            />
          </div>
          <FieldError message={fieldError("address")} />
        </label>

        <SectionTitle icon={PercentIcon}>Menu & offers</SectionTitle>

        <label className={labelStyles}>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Member discount
          </span>
          <div className="relative">
            <FieldIcon icon={PercentIcon} />
            <input
              name="discount"
              type="number"
              min={0}
              max={90}
              defaultValue={initial.discount ?? ""}
              placeholder="0"
              className={`${fieldStyles} pr-9`}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
              %
            </span>
          </div>
          <span className={hintStyles}>Set between 0 and 90. 0 removes the offer.</span>
          <FieldError message={fieldError("discount")} />
        </label>

        <TagsField defaultValue={initial.tags} />

        <SectionTitle icon={TextAlignLeftIcon}>About</SectionTitle>

        <label className={`${labelStyles} sm:col-span-2`}>
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            Description <span className="text-negative">*</span>
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute top-3 left-0 flex items-start pl-3 text-muted">
              <TextAlignLeftIcon className="size-4" />
            </span>
            <textarea
              name="description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Tell diners what makes your restaurant special…"
              maxLength={2000}
              className={textAreaStyles}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <FieldError message={fieldError("description")} />
            <span className={`${description.length >= 2000 ? "text-negative" : ""} tabular-nums`}>
              {description.length}/2000
            </span>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-muted/40">
        <Button
          type="submit"
          disabled={pending}
          className="rounded-xl! h-10! px-6! text-xs! flex items-center gap-2"
        >
          {pending ? (
            <>
              <CircleNotchIcon className="size-4 animate-spin" />
              <span>Saving…</span>
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
};