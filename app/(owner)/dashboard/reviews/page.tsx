import { Card } from "../_components/card";
import { Pagination } from "../_components/pagination";

import { getDashboardReviews } from "./_data/reviews";

import { ReviewItem } from "./_components/review-item";

export const PAGE_SIZE = 10;

export default async function DashboardReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page: pageParam } = await searchParams;

  const reviews = getDashboardReviews();

  const pageCount = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const parsedPage =
    typeof pageParam === "string" ? Number.parseInt(pageParam, 10) : NaN;
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? Math.min(parsedPage, pageCount)
      : 1;
  const pagedReviews = reviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const start = reviews.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, reviews.length);

  return (
    <section className="px-4 pt-3 pb-6 w-full">
      <Card className="size-full flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h2 className="text-d-header-lg text-foreground">Reviews</h2>
          <span className="text-d-caption text-muted">
            Customer reviews of your restaurant, newest first. Reply once to
            acknowledge their visit — the reply appears on your public page.
          </span>
        </header>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted py-12 text-center">
            <p className="text-d-caption text-muted">
              No reviews yet. Reviews appear here once diners rate their visit.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pagedReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}

        <footer className="flex justify-between w-full">
          {reviews.length === 0 ? null : (
            <span className="text-d-body">
              Showing {start}–{end} of {reviews.length}
            </span>
          )}
          {pageCount > 1 ? (
            <Pagination
              page={currentPage}
              pages={pageCount}
              buildHref={(nextPage) => ({
                pathname: "/dashboard/reviews",
                query: { page: nextPage },
              })}
            />
          ) : null}
        </footer>
      </Card>
    </section>
  );
}