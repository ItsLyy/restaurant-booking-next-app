import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@components";
import { getDashboardRole, requireManagerOrAbove } from "@libs/session";

import { Card } from "../../_components/card";

import { HireStaffForm } from "../_components/hire-staff-form";

export default async function AddStaffPage() {
  await requireManagerOrAbove();
  const role = await getDashboardRole();

  return (
    <section className="px-4 pt-3 pb-6 size-full">
      <Card className="size-full flex flex-col gap-6">
        <header className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-d-header-md text-foreground">
              Add Staff Member
            </h2>
            <span className="text-d-caption">
              Hire a new officer for your restaurant
            </span>
          </div>
          <Button
            as="link"
            variant="outline"
            className="flex justify-center items-center gap-1 py-0! px-3! w-fit! h-9! border-muted! text-muted!"
            href="/dashboard/staff"
          >
            <ArrowLeftIcon className="size-4" />
            <span>Back</span>
          </Button>
        </header>
        <HireStaffForm canHireManager={role === "owner"} />
      </Card>
    </section>
  );
}