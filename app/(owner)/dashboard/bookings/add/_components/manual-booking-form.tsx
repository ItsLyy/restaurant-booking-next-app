"use client";

import { useActionState } from "react";

import { Button } from "@components";

import { createManualBookingAction } from "../../../_actions/booking-actions";

interface ManualBookingFormProps {
  defaultDate: string;
  tables: { id: string; name: string; capacity: number }[];
}

const inputBase =
  "px-4 h-10 border border-muted bg-base-200 text-foreground placeholder:text-muted/60 rounded-lg text-c-button focus:outline-none focus:ring-2 focus:ring-accent-200/20 focus:border-accent-200 ease-in-out transition-colors duration-300";

export const ManualBookingForm = ({
  defaultDate,
  tables,
}: ManualBookingFormProps) => {
  const [state, formAction, pending] = useActionState(
    createManualBookingAction,
    { ok: false },
  );

  return (
    <form action={formAction} className="grid grid-cols-2 gap-4">
      <p className="col-span-2 text-d-caption text-muted">
        The customer will be filled in automatically from the account that
        creates this booking (owner or officer).
      </p>

      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="text-c-caption font-medium">
          Date<span className="text-negative">*</span>
        </label>
        <input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={defaultDate}
          className={inputBase}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="time" className="text-c-caption font-medium">
          Time<span className="text-negative">*</span>
        </label>
        <input
          id="time"
          name="time"
          type="time"
          required
          defaultValue="19:00"
          className={inputBase}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="partySize" className="text-c-caption font-medium">
          Party size<span className="text-negative">*</span>
        </label>
        <input
          id="partySize"
          name="partySize"
          type="number"
          min={1}
          max={24}
          required
          defaultValue={2}
          className={inputBase}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="tableId" className="text-c-caption font-medium">
          Table<span className="text-negative">*</span>
        </label>
        <select
          id="tableId"
          name="tableId"
          required
          defaultValue={tables[0]?.id ?? ""}
          className={inputBase}
        >
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              {table.name} — seats {table.capacity}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 col-span-2">
        <label htmlFor="specialRequest" className="text-c-caption font-medium">
          Special request
        </label>
        <textarea
          id="specialRequest"
          name="specialRequest"
          rows={3}
          className={`${inputBase} h-auto py-2 resize-none`}
        />
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
          href="/dashboard/bookings"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="rounded-md! h-10! px-4!"
        >
          {pending ? "Creating…" : "Create booking"}
        </Button>
      </div>
    </form>
  );
};