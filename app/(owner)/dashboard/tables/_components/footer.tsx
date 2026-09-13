import { Pagination } from "../../_components/pagination";

import { buildTablesHref } from "./url-params";

import type { PlaceFilter, StatusFilter } from "./filters";

export const PAGE_SIZE = 9;

interface FooterProps {
  page: number;
  pages: number;
  count: number;
  total: number;
  date: string;
  place: PlaceFilter;
  status: StatusFilter;
}

export const Footer = ({
  page,
  pages,
  count,
  total,
  date,
  place,
  status,
}: FooterProps) => {
  const start = count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, count);
  const label =
    count === 0
      ? `No tables shown of ${total}`
      : `Showing ${start}–${end} of ${total}`;

  return (
    <footer className="flex justify-between w-full">
      <span className="text-d-body">{label}</span>
      {pages > 1 ? (
        <Pagination
          page={page}
          pages={pages}
          buildHref={(nextPage) =>
            buildTablesHref({ date, place, status, page: nextPage })
          }
        />
      ) : null}
    </footer>
  );
};