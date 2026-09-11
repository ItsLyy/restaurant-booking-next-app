import Link from "next/link";

import { getAllBookings } from "@data/bookings/get-all-bookings";
import { requireCustomer } from "@libs/session";

import { formatDayDate, formatTime, resolvePaymentStatus } from "@utils";

import { Pagination } from "./_components/pagination";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View your restaurant bookings.",
  robots: {
    index: false,
    follow: false,
  },
};

const PAGE_SIZE = 5;

const buildPageHref = (page: number) =>
  page <= 1 ? "/bookings" : `/bookings?page=${page}`;

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const customer = await requireCustomer("/bookings");

  const [{ page: pageParam }, bookings] = await Promise.all([
    searchParams,
    getAllBookings(customer.userId),
  ]);

  const pageCount = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const parsedPage =
    typeof pageParam === "string" ? Number.parseInt(pageParam, 10) : NaN;
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, pageCount)
      : 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedBookings = bookings.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-c-header-lg text-foreground">My Bookings</h1>
        <span className="text-c-normal text-muted">
          {bookings.length} reservation{bookings.length === 1 ? "" : "s"}
        </span>
      </div>

      {pagedBookings.length > 0 ? (
        <>
          <ul className="space-y-4">
            {pagedBookings.map(
              ({ booking, bookingCode, restaurantName, paymentStatus }) => (
                <li key={booking.id}>
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="block bg-base-200 p-6 rounded-3xl border border-muted space-y-2 transition-colors hover:border-accent-200/40"
                  >
                    <span className="text-c-header-md text-foreground">
                      {restaurantName}
                    </span>
                    <span className="text-c-normal text-muted block">
                      {bookingCode} ·{" "}
                      {resolvePaymentStatus(booking.status, paymentStatus)}
                    </span>
                    <span className="text-c-normal text-muted block">
                      {formatDayDate(booking.date)} · {formatTime(booking.time)}{" "}
                      · {booking.partySize} people
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ul>

          {pageCount > 1 ? (
            <Pagination
              page={currentPage}
              pages={pageCount}
              buildPageHref={buildPageHref}
            />
          ) : null}
        </>
      ) : (
        <p className="text-c-normal text-muted">No bookings yet.</p>
      )}
    </section>
  );
}