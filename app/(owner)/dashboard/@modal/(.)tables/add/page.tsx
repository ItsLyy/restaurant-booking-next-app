import { tablesCountByFloor } from "../../../tables/add/_data/options";
import { AddTableForm } from "../../../tables/add/_components/add-table-form";

import { AddTableModal } from "./_components/add-table-modal";
import { requireManagerOrAbove } from "@libs/session";

export default async function InterceptedAddTablePage() {
  await requireManagerOrAbove();
  const { defaultFloor } = await tablesCountByFloor();

  return (
    <AddTableModal>
      <AddTableForm defaultFloor={defaultFloor} />
    </AddTableModal>
  );
}