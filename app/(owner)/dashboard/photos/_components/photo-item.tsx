"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { TrashIcon } from "@phosphor-icons/react/dist/ssr";

import { toast } from "sonner";

import type { IRestaurantPhoto } from "@types";

import { SafeImage } from "@components";

import { deletePhotoAction } from "../_actions/photo-actions";

import { ConfirmDialog } from "../../_components/confirm-dialog";

export const PhotoItem = ({ photo }: { photo: IRestaurantPhoto }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (busy) return;
    setBusy(true);
    setActionError(null);
    try {
      const formData = new FormData();
      formData.set("photoId", photo.id);
      const state = await deletePhotoAction({ success: false, message: "" }, formData);
      if (!state.success) {
        setActionError(state.message ?? "Could not delete this photo.");
        toast.error(state.message ?? "Could not delete this photo.");
        setBusy(false);
        return;
      }
      setOpen(false);
      toast.success(state.message ?? "Photo deleted.");
      setBusy(false);
      router.refresh();
    } catch {
      setActionError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="group flex flex-col gap-2 border border-muted rounded-lg p-2 bg-base-100">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-base-200">
        <SafeImage
          src={photo.url}
          alt={`Photo ${photo.id}`}
          fill
          sizes="(min-width: 1024px) 200px, (min-width: 640px) 220px, 160px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <span className="text-d-caption text-muted truncate">{photo.id}</span>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-md border border-negative/40 px-3 h-9 text-c-caption text-negative transition-colors hover:bg-negative/10"
      >
        <TrashIcon className="size-4" />
        Delete
      </button>

      <ConfirmDialog
        open={open}
        title="Delete photo"
        message={
          <>
            Delete <span className="text-foreground">{photo.id}</span>? This
            removes it from both the file and the live site immediately. This
            cannot be undone.
          </>
        }
        confirmLabel="Delete photo"
        confirmVariant="danger"
        busy={busy}
        error={actionError}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (busy) return;
          setActionError(null);
          setOpen(false);
        }}
      />
    </div>
  );
};