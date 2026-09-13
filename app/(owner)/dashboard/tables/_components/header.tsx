import { Button } from "@components";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

export const Header = ({ canManage }: { canManage: boolean }) => {
  return (
    <header className="w-full flex justify-between">
      <div className="flex flex-col">
        <h2 className="text-d-header-md text-foreground">Detailed Tables</h2>
        <span className="text-d-caption">
          Manage your tables and view current bookings
        </span>
      </div>
      {canManage ? (
        <Button
          as="link"
          variant="outline"
          className="flex justify-center items-center gap-1 py-0! px-3! w-fit! h-9! border-accent-200! text-accent-200!"
          href={`/dashboard/tables/add`}
        >
          <PlusIcon className="size-4" />
          <span>Add Table</span>
        </Button>
      ) : null}
    </header>
  );
};
