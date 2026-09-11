import { AddStaffModal } from "./_components/add-staff-modal";
import { HireStaffForm } from "../../../staff/_components/hire-staff-form";
import { getDashboardRole, requireManagerOrAbove } from "@libs/session";

export default async function InterceptedAddStaffPage() {
  await requireManagerOrAbove();
  const role = await getDashboardRole();

  return (
    <AddStaffModal>
      <HireStaffForm canHireManager={role === "owner"} />
    </AddStaffModal>
  );
}