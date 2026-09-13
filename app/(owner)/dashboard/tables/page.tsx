import { Card } from "../_components/card";
import { DateFilter } from "../_components/date-filter";
import { Footer, PAGE_SIZE } from "./_components/footer";
import { Header } from "./_components/header";
import { TableCard } from "./_components/table-card";
import { TablePlaceFilter } from "./_components/table-place-filter";
import { TableStatusFilter } from "./_components/table-status-filter";
import { TablesSummary } from "./_components/tables-summary";

import { getTablesData, normalizeDate } from "./_data/tables";
import { parsePlaceFilter, parseStatusFilter } from "./_components/filters";
import { getDashboardRole } from "@libs/session";

export default async function DashboardTablesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [role, {
    date: dateParam,
    place,
    status,
    page: pageParam,
  }] = await Promise.all([
    getDashboardRole(),
    searchParams,
  ]);

  const date = normalizeDate(dateParam);
  const placeFilter = parsePlaceFilter(place);
  const statusFilter = parseStatusFilter(status);

  const data = getTablesData(date);

  const visibleTables = data.tables.filter(
    (table) =>
      (placeFilter === "all" || table.place === placeFilter) &&
      (statusFilter === "all" || table.status === statusFilter),
  );

  const pageCount = Math.max(1, Math.ceil(visibleTables.length / PAGE_SIZE));
  const parsedPage =
    typeof pageParam === "string" ? Number.parseInt(pageParam, 10) : NaN;
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, pageCount)
      : 1;
  const pagedTables = visibleTables.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <section className="px-4 pt-3 pb-6 size-full flex">
      <Card className="flex flex-col gap-4 size-full">
        <Header canManage={role !== "staff"} />
        <DateFilter
          date={date}
          pathname="/dashboard/tables"
          params={{
            ...(placeFilter !== "all" ? { place: placeFilter } : {}),
            ...(statusFilter !== "all" ? { status: statusFilter } : {}),
          }}
        />
        <TablesSummary totals={data.totals} />
        <div className="w-full flex flex-col gap-2">
          <TablePlaceFilter
            current={placeFilter}
            date={date}
            status={statusFilter}
            counts={data.placeCounts}
          />
          <TableStatusFilter
            current={statusFilter}
            date={date}
            place={placeFilter}
            counts={data.statusCounts}
          />
        </div>
        {visibleTables.length === 0 ? (
          <p className="text-muted text-d-caption text-center py-10">
            No tables match the current filters.
          </p>
        ) : (
          <div className="w-full flex overflow-x-auto scrollbar-hidden gap-2">
            {pagedTables.map((table) => (
              <TableCard key={table.id} table={table} />
            ))}
          </div>
        )}
        <Footer
          count={visibleTables.length}
          total={data.statusCounts.all}
          page={currentPage}
          pages={pageCount}
          date={date}
          place={placeFilter}
          status={statusFilter}
        />
      </Card>
    </section>
  );
}
