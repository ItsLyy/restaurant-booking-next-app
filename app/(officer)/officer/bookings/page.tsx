import { Card } from "../../../(owner)/dashboard/_components/card";
import { DateFilter } from "../../../(owner)/dashboard/_components/date-filter";
import { Footer, PAGE_SIZE } from "../../../(owner)/dashboard/bookings/_components/footer";
import { SearchInput } from "../../../(owner)/dashboard/bookings/_components/search-input";
import { BookingTableFilter } from "../../../(owner)/dashboard/bookings/_components/booking-table-filter";
import { BookingsSummary } from "../../../(owner)/dashboard/bookings/_components/bookings-summary";
import { BookingDetailTable } from "../../../(owner)/dashboard/bookings/_components/bookings-detail-table";

import {
  getBookingsCounts,
  getBookingsData,
  normalizeDate,
} from "../../../(owner)/dashboard/bookings/_data/bookings";
import { parseBookingFilter } from "../../../(owner)/dashboard/bookings/_components/booking-filter";
import { buildBookingsHref } from "../../../(owner)/dashboard/bookings/_components/url-params";

const BASE_PATH = "/officer/bookings";

export default async function OfficerBookingsPage({
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
        <header className="flex flex-col gap-1">
          <h2 className="text-d-header-md text-foreground">Bookings</h2>
          <span className="text-d-caption text-muted">
            Manage today&apos;s reservations as a cashier.
          </span>
        </header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DateFilter
            date={date}
            pathname={BASE_PATH}
            params={{
              ...(filter !== "all" ? { status: filter } : {}),
              ...(query ? { q: query } : {}),
            }}
          />
          <SearchInput base={BASE_PATH} initialQuery={typeof q === "string" ? q : ""} />
        </div>
        <BookingsSummary bookings={bookings} counts={counts} />
        <BookingTableFilter
          current={filter}
          counts={counts}
          date={date}
          query={query}
          base={BASE_PATH}
        />
        <BookingDetailTable
          bookings={pagedBookings}
          viewDate={date}
          base={BASE_PATH}
          emptyHref={buildBookingsHref({ date }, BASE_PATH)}
        />
        <Footer
          page={currentPage}
          pages={pageCount}
          count={filteredBookings.length}
          total={counts.total}
          date={date}
          filter={filter}
          query={query}
          base={BASE_PATH}
        />
      </Card>
    </section>
  );
}