import { tablesCountByFloor } from "../../../tables/add/_data/options";
import { AddTableForm } from "../../../tables/add/_components/add-table-form";

import { AddTableModal } from "./_components/add-table-modal";
import { requireOwner } from "@libs/session";

export default async function InterceptedAddTablePage() {
  await requireOwner();
  const { defaultFloor } = tablesCountByFloor();

  return (
    <AddTableModal>
      <AddTableForm defaultFloor={defaultFloor} />
    </AddTableModal>
  );
}