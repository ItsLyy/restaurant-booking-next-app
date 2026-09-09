"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useSyncExternalStore } from "react";

import { useRouter } from "next/navigation";

import { XIcon } from "@phosphor-icons/react/dist/ssr";

import type { ReactNode } from "react";

const emptySubscribe = () => () => {};

export const AddBookingModal = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Renders the dialog in the document body after hydration so parent
  // containers with transform/overflow rules cannot clip the top layer.
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!isClient) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, [isClient]);

  const close = () => router.back();

  const dialog = (
    <dialog
      ref={dialogRef}
      aria-labelledby="add-booking-modal-title"
      onCancel={close}
      className="m-auto bg-transparent p-0 open:flex open:items-center open:justify-center [&::backdrop]:bg-black/40"
    >
      <div className="w-[28rem] max-w-[92vw] max-h-[90vh] overflow-y-auto rounded-xl border border-muted bg-base-100 shadow-lg text-foreground p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <h2
              id="add-booking-modal-title"
              className="text-d-header-md text-foreground"
            >
              Add Manual Booking
            </h2>
            <span className="text-d-caption">
              Create a confirmed reservation on behalf of a guest
            </span>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="cursor-pointer rounded-md p-1 hover:bg-accent-200/10"
          >
            <XIcon className="size-4 text-muted" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );

  if (!isClient) return null;

  return createPortal(dialog, document.body);
};