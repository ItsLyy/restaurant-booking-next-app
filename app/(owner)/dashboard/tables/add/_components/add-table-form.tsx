"use client";

import { useActionState } from "react";

import { Button } from "@components";

import { createTableAction } from "../../_actions/table-actions";

import { PLACE_LABELS, TABLE_CATEGORIES } from "../../_data/table-meta";

interface AddTableFormProps {
  defaultFloor: number;
}

const inputBase =
  "px-4 h-10 border border-muted bg-base-200 text-foreground placeholder:text-muted/60 rounded-lg text-c-button focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 ease-in-out transition-colors duration-300";

const PLACE_OPTIONS = Object.entries(PLACE_LABELS) as [
  keyof typeof PLACE_LABELS,
  string,
][];

const placesForCategory = (category: string): string =>
  category === "outdoor" || category === "private" ? category : "indoor";

export const AddTableForm = ({ defaultFloor }: AddTableFormProps) => {
  const [state, formAction, pending] = useActionState(createTableAction, {
    ok: false,
  });

  return (
    <form action={formAction} className="grid grid-cols-2 gap-4 max-w-2xl">
      <div className="flex flex-col gap-1 col-span-2">
        <label htmlFor="name" className="text-c-caption font-medium">
          Table name<span className="text-negative">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={60}
          placeholder="e.g. Rooftop Corner"
          className={inputBase}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-c-caption font-medium">
          Category<span className="text-negative">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue="standard"
          className={inputBase}
        >
          {TABLE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)} (
              {placesForCategory(category)})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="floor" className="text-c-caption font-medium">
          Floor<span className="text-negative">*</span>
        </label>
        <input
          id="floor"
          name="floor"
          type="number"
          min={1}
          required
          defaultValue={defaultFloor}
          className={inputBase}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="capacity" className="text-c-caption font-medium">
          Capacity (pax)<span className="text-negative">*</span>
        </label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          min={1}
          max={50}
          required
          defaultValue={2}
          className={inputBase}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="price" className="text-c-caption font-medium">
          Price<span className="text-negative">*</span>
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min={0}
          step={500}
          required
          defaultValue={15000}
          className={inputBase}
        />
      </div>

      <div className="col-span-2 flex flex-col gap-1">
        <span className="text-c-caption text-muted">
          {PLACE_OPTIONS.map(
            ([place, label]) =>
              `${label} = ${place.charAt(0).toUpperCase() + place.slice(1)}`,
          ).join(" · ")}
        </span>
      </div>

      {state.error ? (
        <p role="alert" className="col-span-2 text-d-body text-negative">
          {state.error}
        </p>
      ) : null}

      <div className="col-span-2 flex justify-end gap-2">
        <Button
          as="link"
          variant="outline"
          className="border! rounded-md! h-10! px-4!"
          href="/dashboard/tables"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="rounded-md! h-10! px-4!"
        >
          {pending ? "Adding…" : "Add table"}
        </Button>
      </div>
    </form>
  );
};