import { Pagination } from "../../_components/pagination";

import { buildBookingsHref } from "./url-params";

import type { BookingFilter } from "./booking-filter";

export const PAGE_SIZE = 10;

interface FooterProps {
  page: number;
  pages: number;
  count: number;
  total: number;
  date: string;
  filter: BookingFilter;
  query: string;
  base?: string;
}

export const Footer = ({
  page,
  pages,
  count,
  total,
  date,
  filter,
  query,
  base,
}: FooterProps) => {
  const start = count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, count);
  const label =
    count === 0
      ? `No bookings shown of ${total}`
      : count === total
        ? `Showing ${start}–${end} of ${total}`
        : `Showing ${start}–${end} of ${count} (filtered from ${total})`;

  return (
    <footer className="flex justify-between w-full">
      <span className="text-d-body">{label}</span>
      {pages > 1 ? (
        <Pagination
          page={page}
          pages={pages}
          buildHref={(nextPage) =>
            buildBookingsHref({ date, filter, query, page: nextPage }, base)
          }
        />
      ) : null}
    </footer>
  );
};