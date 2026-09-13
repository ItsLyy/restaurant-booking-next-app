import { cache } from "react";
import { desc, eq, inArray } from "drizzle-orm";

import { db } from "@db/client";
import {
  bookings,
  owners,
  restaurants,
  restaurantPhotos,
  reviews,
  tables,
  users,
} from "@db/schema";

import type { IOwner, IRestaurant, IRestaurantPhoto, IReview, IUser } from "@types";

interface Review extends IReview {
  customer: Omit<IUser, "role">;
}

interface GetRestaurantResponse extends Omit<
  IRestaurant,
  "ownerId" | "createdAt" | "updatedAt"
> {
  cover: string;
  coverId: string;
  owner: Omit<IOwner, "role">;
  photos: IRestaurantPhoto[];
  menus: IRestaurantPhoto[];
  reviews: Review[];
}

function toPhoto(row: (typeof restaurantPhotos.$inferSelect)): IRestaurantPhoto {
  return {
    id: row.id,
    url: row.url,
    type: row.type,
    restaurantId: row.restaurantId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toUserWithoutRole(user: (typeof users.$inferSelect)) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerifyAt: user.emailVerifyAt,
    allergics: user.allergics,
    avatar: user.avatar ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const getRestaurant = cache(async function getRestaurant(
  slug: string,
): Promise<GetRestaurantResponse | null> {
  const restaurant =
    (
      await db
        .select()
        .from(restaurants)
        .where(eq(restaurants.slug, slug))
        .limit(1)
    )[0] ?? null;
  if (!restaurant) return null;

  const [photos, restaurantTables] = await Promise.all([
    db
      .select()
      .from(restaurantPhotos)
      .where(eq(restaurantPhotos.restaurantId, restaurant.id)),
    db
      .select()
      .from(tables)
      .where(eq(tables.restaurantId, restaurant.id)),
  ]);

  const restaurantTableIds = restaurantTables.map((table) => table.id);
  const restaurantBookings = restaurantTableIds.length
    ? await db
        .select()
        .from(bookings)
        .where(inArray(bookings.tableId, restaurantTableIds))
    : [];

  const restaurantBookingIds = restaurantBookings.map((booking) => booking.id);
  const restaurantReviews = restaurantBookingIds.length
    ? await db
        .select()
        .from(reviews)
        .where(inArray(reviews.bookingId, restaurantBookingIds))
        .orderBy(desc(reviews.customerCommentAt))
    : [];

  const cover = photos.find((photo) => photo.type === "cover");
  if (!cover) {
    throw new Error(
      `No cover photo found for restaurant "${restaurant.name}"`,
    );
  }

  const owner =
    (
      await db
        .select({
          user: users,
          owner: owners,
        })
        .from(users)
        .innerJoin(owners, eq(owners.userId, users.id))
        .where(eq(users.id, restaurant.ownerId))
        .limit(1)
    )[0] ?? null;
  if (!owner) {
    throw new Error(
      `Owner "${restaurant.ownerId}" not found for restaurant "${restaurant.name}"`,
    );
  }

  const customerOfBooking = new Map(
    restaurantBookings.map((booking) => [booking.id, booking.customerId]),
  );
  const reviewCustomerIds = [
    ...new Set(
      restaurantReviews.flatMap((review) => {
        const customerId = customerOfBooking.get(review.bookingId);
        return customerId ? [customerId] : [];
      }),
    ),
  ];

  const reviewCustomers = reviewCustomerIds.length
    ? await db.select().from(users).where(inArray(users.id, reviewCustomerIds))
    : [];
  const customerById = new Map(reviewCustomers.map((customer) => [customer.id, customer]));

  const reviewWithCustomers = restaurantReviews.map((review) => {
    const bookingId = review.bookingId;
    const customerId = customerOfBooking.get(bookingId);
    const customer = customerId ? customerById.get(customerId) : undefined;

    if (!customer) {
      throw new Error(
        `Customer not found for review "${review.id}" of restaurant "${restaurant.name}"`,
      );
    }

    return {
      id: review.id,
      customerComment: review.customerComment,
      customerRating: review.customerRating,
      customerCommentAt: review.customerCommentAt,
      ownerReply: review.ownerReply ?? undefined,
      ownerReplyAt: review.ownerReplyAt ?? undefined,
      bookingId: review.bookingId,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      customer: toUserWithoutRole(customer),
    };
  });

  return {
    id: restaurant.id,
    cover: cover.url,
    coverId: cover.id,
    name: restaurant.name,
    slug: restaurant.slug,
    description: restaurant.description,
    shortDescription: restaurant.shortDescription ?? undefined,
    country: restaurant.country,
    city: restaurant.city,
    address: restaurant.address,
    tags: restaurant.tags,
    owner: {
      ...toUserWithoutRole(owner.user),
      businessLicense: owner.owner.businessLicense ?? undefined,
      verifyAt: owner.owner.verifyAt ?? undefined,
    },
    discount: restaurant.discount ?? undefined,
    lat: restaurant.lat ?? undefined,
    lng: restaurant.lng ?? undefined,
    photos: photos
      .filter((photo) => photo.type === "post")
      .slice(0, 3)
      .map(toPhoto),
    menus: photos.filter((photo) => photo.type === "menu").map(toPhoto),
    reviews: reviewWithCustomers,
  };
});