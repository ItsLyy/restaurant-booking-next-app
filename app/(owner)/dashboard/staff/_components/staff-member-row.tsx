"use client";

import { useState, useTransition } from "react";
import { TrashIcon } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

import { Avatar, Badge, Button } from "@components";
import { formatDate } from "@utils";
import { ConfirmDialog } from "../../_components/confirm-dialog";
import { fireStaffAction } from "../_actions/fire-staff-action";
import { changeStaffRoleAction } from "../_actions/change-staff-role-action";
import type { StaffMember } from "../_data/staff";

interface StaffMemberRowProps {
  member: StaffMember;
  viewerRole: "owner" | "manager";
  currentUserId?: string;
}

export const StaffMemberRow = ({
  member,
  viewerRole,
  currentUserId,
}: StaffMemberRowProps) => {
  const [isFireDialogOpen, setIsFireDialogOpen] = useState(false);
  const [isFiring, startFireTransition] = useTransition();
  const [isChangingRole, startRoleTransition] = useTransition();
  const [fireError, setFireError] = useState<string | null>(null);

  const isSelf = member.id === currentUserId;
  const canFire =
    !isSelf &&
    (viewerRole === "owner" || (viewerRole === "manager" && member.position === "staff"));
  const canChangeRole = viewerRole === "owner";

  const handleRoleChange = (newPosition: "manager" | "staff") => {
    if (newPosition === member.position) return;
    startRoleTransition(async () => {
      const res = await changeStaffRoleAction(member.id, newPosition);
      if (res.success) {
        toast.success(res.message ?? "Role updated successfully.");
      } else {
        toast.error(res.message ?? "Failed to update role.");
      }
    });
  };

  const handleFireConfirm = () => {
    setFireError(null);
    startFireTransition(async () => {
      const res = await fireStaffAction(member.id);
      if (res.success) {
        toast.success(res.message ?? "Staff member removed.");
        setIsFireDialogOpen(false);
      } else {
        setFireError(res.message ?? "Failed to remove staff member.");
      }
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-muted rounded-lg p-4 bg-base-100 transition-colors">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar
            src={member.avatar}
            alt={`${member.firstName} ${member.lastName}`}
            className="size-11! rounded-full! shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-c-button text-foreground font-semibold truncate">
                {member.firstName} {member.lastName}
              </span>

              {canChangeRole ? (
                <div className="inline-flex items-center gap-1.5">
                  <select
                    value={member.position}
                    disabled={isChangingRole}
                    onChange={(e) =>
                      handleRoleChange(e.target.value as "manager" | "staff")
                    }
                    className="text-c-caption capitalize font-medium rounded-md px-2 py-0.5 border border-muted bg-base-200 text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-200 disabled:opacity-50"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </select>
                  {isChangingRole ? (
                    <span className="text-c-caption text-muted animate-pulse">
                      Updating…
                    </span>
                  ) : null}
                </div>
              ) : (
                <Badge variant="neutral" className="capitalize">
                  {member.position}
                </Badge>
              )}

              {member.invitedByName ? (
                <span className="text-c-caption text-muted hidden sm:inline">
                  · Invited by {member.invitedByName}
                </span>
              ) : null}
            </div>
            <span className="text-c-caption text-muted truncate block">
              @{member.username} · {member.email}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          {member.createdAt ? (
            <span className="text-c-caption text-muted hidden md:block">
              Joined {formatDate(member.createdAt)}
            </span>
          ) : null}

          {canFire ? (
            <Button
              variant="outline"
              className="border-negative! text-negative! hover:bg-negative/10! h-8! px-2.5! rounded-md! flex items-center gap-1 text-c-caption cursor-pointer"
              onClick={() => {
                setFireError(null);
                setIsFireDialogOpen(true);
              }}
            >
              <TrashIcon className="size-3.5" />
              <span>Fire</span>
            </Button>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={isFireDialogOpen}
        title="Remove Staff Member"
        message={
          <>
            Are you sure you want to remove{" "}
            <strong>
              {member.firstName} {member.lastName}
            </strong>{" "}
            from the restaurant team? Their role will immediately revert to a
            customer.
          </>
        }
        confirmLabel="Fire Staff"
        confirmVariant="danger"
        busy={isFiring}
        error={fireError}
        onConfirm={handleFireConfirm}
        onCancel={() => {
          if (!isFiring) {
            setIsFireDialogOpen(false);
            setFireError(null);
          }
        }}
      />
    </>
  );
};
