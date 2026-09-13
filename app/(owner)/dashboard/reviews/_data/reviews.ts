import { readFileSync, writeFileSync } from "fs";
import path from "path";

import rawUsers from "@data/dummy/users.json";
import rawOfficers from "@data/dummy/officers.json";
import rawOwners from "@data/dummy/owners.json";
import rawTables from "@data/dummy/tables.json";
import rawRestaurants from "@data/dummy/restaurants.json";

import type {
  IBooking,
  IOwner,
  IReview,
  ITable,
  IUser,
} from "@types";

const RESTAURANT_ID = "rest-001";

const BOOKINGS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/bookings.json",
);
const REVIEWS_FILE_PATH = path.join(
  process.cwd(),
  "app/_data/dummy/reviews.json",
);

const TABLES = rawTables as ITable[];
const BOOKINGS_PROVIDER = (): IBooking[] =>
  JSON.parse(readFileSync(BOOKINGS_FILE_PATH, "utf8")) as IBooking[];

function readReviews(): IReview[] {
  return JSON.parse(readFileSync(REVIEWS_FILE_PATH, "utf8")) as IReview[];
}

export function readAllReviews(): IReview[] {
  return readReviews();
}

export function writeAllReviews(reviews: IReview[]): void {
  writeFileSync(
    REVIEWS_FILE_PATH,
    `${JSON.stringify(reviews, null, 2)}\n`,
    "utf8",
  );
}

export function getRestaurantSlugForReview(review: IReview): string | null {
  const bookings = BOOKINGS_PROVIDER();
  const booking = bookings.find((item) => item.id === review.bookingId);
  const table = TABLES.find((item) => item.id === booking?.tableId);
  const restaurant = rawRestaurants.find(
    (item) => item.id === table?.restaurantId,
  );
  return restaurant?.slug ?? null;
}

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

const PEOPLE: Person[] = [
  ...(rawOwners as IOwner[]).map((owner) => ({
    id: owner.id,
    firstName: owner.firstName,
    lastName: owner.lastName,
    avatar: owner.avatar ?? "",
  })),
  ...(rawOfficers as unknown as Person[]),
  ...(rawUsers as IUser[]).map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar ?? "",
  })),
];

export interface DashboardReview {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  commentAt: string;
  ownerReply?: string;
  ownerReplyAt?: string;
}

export function getDashboardReviews(): DashboardReview[] {
  const bookings = BOOKINGS_PROVIDER();
  const tableIds = new Set(
    TABLES.filter((table) => table.restaurantId === RESTAURANT_ID).map(
      (table) => table.id,
    ),
  );

  const bookingById = new Map(bookings.map((booking) => [booking.id, booking]));
  const personById = new Map(PEOPLE.map((person) => [person.id, person]));

  return readReviews()
    .map((review) => {
      const booking = bookingById.get(review.bookingId);
      if (!booking || !tableIds.has(booking.tableId)) return null;

      const person = personById.get(booking.customerId);

      return {
        id: review.id,
        bookingId: review.bookingId,
        customerId: booking.customerId,
        customerName: person
          ? `${person.firstName} ${person.lastName}`
          : "Unknown guest",
        customerAvatar: person?.avatar ?? "",
        rating: review.customerRating,
        comment: review.customerComment,
        commentAt: review.customerCommentAt,
        ownerReply: review.ownerReply,
        ownerReplyAt: review.ownerReplyAt,
      } as DashboardReview;
    })
    .filter((review): review is DashboardReview => review !== null)
    .sort((a, b) => b.commentAt.localeCompare(a.commentAt));
}