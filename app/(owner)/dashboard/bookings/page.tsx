import { Card } from "../_components/card";
import { DateFilter } from "../_components/date-filter";
import { Header } from "./_components/header";
import { Footer, PAGE_SIZE } from "./_components/footer";
import { SearchInput } from "./_components/search-input";
import { BookingTableFilter } from "./_components/booking-table-filter";
import { BookingsSummary } from "./_components/bookings-summary";
import { BookingDetailTable } from "./_components/bookings-detail-table";

import {
  getBookingsCounts,
  getBookingsData,
  normalizeDate,
} from "./_data/bookings";
import { parseBookingFilter } from "./_components/booking-filter";
import { buildBookingsHref } from "./_components/url-params";

export default async function DashboardBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date: dateParam, status, q, page: pageParam } = await searchParams;

  const date = normalizeDate(dateParam);
  const filter = parseBookingFilter(status);
  const query = typeof q === "string" ? q.trim().toLowerCase() : "";

  const { bookings } = getBookingsData(date);
  const counts = getBookingsCounts(bookings);

  const filteredBookings = bookings.filter((booking) => {
    if (filter !== "all" && booking.status !== filter) return false;
    if (query) {
      const haystack = `${booking.guest} ${booking.code} ${booking.table} ${booking.id}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const parsedPage =
    typeof pageParam === "string" ? Number.parseInt(pageParam, 10) : NaN;
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, pageCount)
      : 1;
  const pagedBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <section className="px-4 pt-3 pb-6 size-full">
      <Card className="size-full flex flex-col gap-4">
        <Header date={date} canManage />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DateFilter
            date={date}
            pathname="/dashboard/bookings"
            params={{
              ...(filter !== "all" ? { status: filter } : {}),
              ...(query ? { q: query } : {}),
            }}
          />
          <SearchInput initialQuery={typeof q === "string" ? q : ""} />
        </div>
        <BookingsSummary bookings={bookings} counts={counts} />
        <BookingTableFilter current={filter} counts={counts} date={date} query={query} />
        <BookingDetailTable
          bookings={pagedBookings}
          viewDate={date}
          emptyHref={buildBookingsHref({ date })}
        />
        <Footer
          page={currentPage}
          pages={pageCount}
          count={filteredBookings.length}
          total={counts.total}
          date={date}
          filter={filter}
          query={query}
        />
      </Card>
    </section>
  );
}