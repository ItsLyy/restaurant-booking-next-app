"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

import { Button } from "@components";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { deleteRestaurantAction } from "../_actions/delete-restaurant-action";

interface DeleteRestaurantButtonProps {
  restaurantName: string;
}

export const DeleteRestaurantButton = ({
  restaurantName,
}: DeleteRestaurantButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteRestaurantAction();
      if (res.success) {
        toast.success(res.message ?? "Restaurant deleted successfully.");
        setIsOpen(false);
        router.push(res.redirectTo ?? "/");
        router.refresh();
      } else {
        setError(res.message ?? "Failed to delete restaurant.");
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        className="border-negative! text-negative! hover:bg-negative/10! h-9! px-3! rounded-md! flex items-center gap-1.5 cursor-pointer text-c-caption font-medium"
        onClick={() => {
          setError(null);
          setIsOpen(true);
        }}
      >
        <TrashIcon className="size-4" />
        <span>Delete restaurant</span>
      </Button>

      <ConfirmDialog
        open={isOpen}
        title="Delete Restaurant"
        message={
          <>
            Are you sure you want to delete <strong>{restaurantName}</strong>?
            This will permanently erase all associated tables, bookings,
            operating hours, and photos. All staff members and your own account
            will immediately revert to regular customer accounts.
          </>
        }
        confirmLabel="Delete Restaurant"
        confirmVariant="danger"
        busy={isPending}
        error={error}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!isPending) {
            setIsOpen(false);
            setError(null);
          }
        }}
      />
    </>
  );
};
