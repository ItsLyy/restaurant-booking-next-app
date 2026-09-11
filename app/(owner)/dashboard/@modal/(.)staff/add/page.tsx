import { AddStaffModal } from "./_components/add-staff-modal";
import { HireStaffForm } from "../../../staff/_components/hire-staff-form";
import { requireOwner } from "@libs/session";

export default async function InterceptedAddStaffPage() {
  await requireOwner();

  return (
    <AddStaffModal>
      <HireStaffForm />
    </AddStaffModal>
  );
}