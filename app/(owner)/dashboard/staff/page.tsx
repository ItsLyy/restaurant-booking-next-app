import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";
import { getAuthUser, getDashboardRole, requireManagerOrAbove } from "@libs/session";
import { getCurrentRestaurantId } from "../../_libs/current-restaurant";

import { Card } from "../_components/card";
import { StaffMemberRow } from "./_components/staff-member-row";
import { getStaffData } from "./_data/staff";

export default async function StaffPage() {
  await requireManagerOrAbove();
  const role = (await getDashboardRole()) ?? "staff";
  const session = await getAuthUser();
  const restaurantId = await getCurrentRestaurantId();
  const { staff } = getStaffData(restaurantId);

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
              <StaffMemberRow
                key={member.id}
                member={member}
                viewerRole={role === "owner" ? "owner" : "manager"}
                currentUserId={session?.userId}
              />
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}