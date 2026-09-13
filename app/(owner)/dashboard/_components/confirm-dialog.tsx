"use client";

import { useEffect, useRef } from "react";

import { Button } from "@components";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  confirmVariant?: "default" | "danger";
  busy: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  confirmVariant = "default",
  busy,
  error,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      onCancel={onCancel}
      className="m-auto bg-transparent p-0 open:flex open:items-center open:justify-center [&::backdrop]:bg-black/40"
    >
      <div className="w-96 max-w-[90vw] rounded-xl border border-muted bg-base-100 shadow-lg text-foreground p-5">
        <h2
          id="confirm-dialog-title"
          className="text-d-header-card text-foreground"
        >
          {title}
        </h2>
        <div id="confirm-dialog-message" className="mt-2 text-d-body text-muted">
          {message}
        </div>
        {children}
        {error ? (
          <p className="mt-3 text-d-body text-negative" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button
            variant="outline"
            className="border! rounded-md! h-10! px-4!"
            disabled={busy}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant={
              confirmVariant === "danger" ? "outline" : "default"
            }
            className={
              confirmVariant === "danger"
                ? "border-negative! text-negative! rounded-md! h-10! px-4!"
                : "rounded-md! h-10! px-4!"
            }
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
};