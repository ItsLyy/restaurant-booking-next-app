import { Button } from "@components";

export default function DashboardTableNotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-d-header-lg text-foreground text-center">
        Table not found
      </h1>
      <p className="text-d-body text-muted text-center">
        This table does not exist or has been removed.
      </p>
      <Button as="link" href="/dashboard/tables">
        Back to tables
      </Button>
    </div>
  );
}