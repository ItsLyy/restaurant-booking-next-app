import { tablesCountByFloor } from "../../../tables/add/_data/options";
import { AddTableForm } from "../../../tables/add/_components/add-table-form";

import { AddTableModal } from "./_components/add-table-modal";

export default async function InterceptedAddTablePage() {
  const { defaultFloor } = tablesCountByFloor();

  return (
    <AddTableModal>
      <AddTableForm defaultFloor={defaultFloor} />
    </AddTableModal>
  );
}