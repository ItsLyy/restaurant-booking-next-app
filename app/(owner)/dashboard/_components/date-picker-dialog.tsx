"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@components";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr";

import { formatDate } from "@utils";

interface DatePickerButtonProps {
  date: string;
  pathname: string;
  params: Record<string, string>;
}

export const DatePickerButton = ({
  date,
  pathname,
  params,
}: DatePickerButtonProps) => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(date);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const openDialog = () => {
    setValue(date);
    setOpen(true);
  };

  const closeDialog = () => setOpen(false);

  const goToDate = () => {
    if (!value) return;
    const query = new URLSearchParams({ ...params, date: value });
    router.push(
      query.toString() ? `${pathname}?${query.toString()}` : pathname,
      { scroll: false },
    );
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex justify-center items-center gap-1 py-2! px-4! h-9! w-fit! border-muted! text-muted!"
        aria-label="Pick a date from the calendar"
        onClick={openDialog}
      >
        <CalendarBlankIcon className="size-4" />
        {formatDate(date)}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby="date-picker-title"
        onCancel={closeDialog}
        className="m-auto bg-transparent p-0 open:flex open:items-center open:justify-center [&::backdrop]:bg-black/40"
      >
        <div className="w-72 max-w-[90vw] rounded-xl border border-muted bg-base-100 shadow-lg text-foreground p-5">
          <h2
            id="date-picker-title"
            className="text-d-header-card text-foreground"
          >
            Pick a date
          </h2>
          <div className="mt-3">
            <label
              htmlFor="date-picker-input"
              className="text-d-caption text-muted"
            >
              Date
            </label>
            <input
              id="date-picker-input"
              type="date"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="w-full h-10 rounded-md border border-muted bg-base-200 px-3 text-d-body text-foreground focus:outline-none focus:border-accent-200 focus:ring-2 focus:ring-accent-200/20"
            />
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="outline"
              className="border! rounded-md! h-10! px-4!"
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button
              className="rounded-md! h-10! px-4!"
              disabled={!value}
              onClick={goToDate}
            >
              View
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
};