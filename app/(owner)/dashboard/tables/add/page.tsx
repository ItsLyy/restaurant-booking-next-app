import { Button } from "@components";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

import { Card } from "../../_components/card";

import { tablesCountByFloor } from "./_data/options";
import { AddTableForm } from "./_components/add-table-form";
import { requireManagerOrAbove } from "@libs/session";

export default async function AddTablePage() {
  await requireManagerOrAbove();
  const { defaultFloor } = await tablesCountByFloor();

  return (
    <section className="px-4 pt-3 pb-6 size-full">
      <Card className="size-full flex flex-col gap-6">
        <header className="w-full flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-d-header-md text-foreground">Add Table</h2>
            <span className="text-d-caption">
              Create a new table in your restaurant layout
            </span>
          </div>
          <Button
            as="link"
            variant="outline"
            className="flex justify-center items-center gap-1 py-0! px-3! w-fit! h-9! border-muted! text-muted!"
            href="/dashboard/tables"
          >
            <ArrowLeftIcon className="size-4" />
            <span>Back</span>
          </Button>
        </header>
        <AddTableForm defaultFloor={defaultFloor} />
      </Card>
    </section>
  );
}