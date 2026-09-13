"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

import { Button } from "@components";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { leaveRestaurantAction } from "../_actions/leave-restaurant-action";

interface LeaveRestaurantButtonProps {
  restaurantName: string;
}

export const LeaveRestaurantButton = ({
  restaurantName,
}: LeaveRestaurantButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const res = await leaveRestaurantAction();
      if (res.success) {
        toast.success(res.message ?? "You have left the restaurant.");
        setIsOpen(false);
        router.push(res.redirectTo ?? "/profile");
        router.refresh();
      } else {
        setError(res.message ?? "Failed to leave restaurant.");
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
        <SignOutIcon className="size-4" />
        <span>Leave restaurant</span>
      </Button>

      <ConfirmDialog
        open={isOpen}
        title="Leave Restaurant"
        message={
          <>
            Are you sure you want to leave <strong>{restaurantName}</strong>? You
            will immediately lose access to this restaurant&apos;s dashboard and
            your account will revert to a customer account.
          </>
        }
        confirmLabel="Leave Restaurant"
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
