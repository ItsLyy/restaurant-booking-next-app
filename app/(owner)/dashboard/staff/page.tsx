import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

import { Avatar, Badge, Button } from "@components";
import { formatDate } from "@utils";
import { requireOwner } from "@libs/session";

import { Card } from "../_components/card";

import { getStaffData } from "./_data/staff";

export default async function StaffPage() {
  await requireOwner();
  const { staff } = getStaffData();

  return (
    <section className="px-4 pt-3 pb-6 size-full">
      <Card className="size-full flex flex-col gap-4">
        <header className="w-full flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="text-d-header-md text-foreground">
              Staff Members
            </h2>
            <span className="text-d-caption text-muted">
              {staff.length} member{staff.length !== 1 ? "s" : ""} in your
              team
            </span>
          </div>
          <Button
            as="link"
            variant="outline"
            className="flex justify-center items-center gap-1 py-0! px-3! w-fit! h-9! border-accent-200! text-accent-200!"
            href="/dashboard/staff/add"
          >
            <PlusIcon className="size-4" />
            <span>Add Staff</span>
          </Button>
        </header>

        {staff.length === 0 ? (
          <p className="text-muted text-d-caption text-center py-10">
            No staff members hired yet.
          </p>
        ) : (
          <div className="w-full flex flex-col gap-2">
            {staff.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 border border-muted rounded-lg p-4 bg-base-100"
              >
                <Avatar
                  src={member.avatar}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="size-11! rounded-full!"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-c-button text-foreground font-semibold truncate">
                      {member.firstName} {member.lastName}
                    </span>
                    <Badge variant="neutral" className="capitalize">
                      {member.position}
                    </Badge>
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
                {member.createdAt ? (
                  <span className="text-c-caption text-muted shrink-0 hidden sm:block">
                    Joined {formatDate(member.createdAt)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}