import { relations } from "drizzle-orm";
import {
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["customer", "owner", "officer"]);

export const officerPositionEnum = pgEnum("officer_position", [
  "manager",
  "staff",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);

export const cancelledByEnum = pgEnum("cancelled_by", ["user", "restaurant"]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "unpaid",
  "paid",
  "refunded",
  "unrefunded",
  "failed",
]);

export const photoTypeEnum = pgEnum("photo_type", ["cover", "post", "menu"]);

export const otpTypeEnum = pgEnum("otp_type", [
  "email_verification",
  "password_reset",
  "two_factor",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: roleEnum("role").notNull(),
  emailVerifyAt: text("email_verify_at").notNull(),
  allergics: text("allergics").array().notNull().default([]),
  avatar: text("avatar"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("users_email_idx").on(table.email),
  index("users_username_idx").on(table.username),
]);

export const customers = pgTable("customers", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const owners = pgTable("owners", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  businessLicense: text("business_license"),
  verifyAt: text("verify_at"),
});

export const officers = pgTable("officers", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  position: officerPositionEnum("position").notNull(),
  invitedBy: text("invited_by").notNull(),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const restaurants = pgTable("restaurants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  tags: text("tags").array().notNull().default([]),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  categoryId: text("category_id").references(() => categories.id),
  discount: integer("discount"),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("restaurants_owner_id_idx").on(table.ownerId),
  index("restaurants_category_id_idx").on(table.categoryId),
]);

export const tables = pgTable("tables", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  floor: integer("floor").notNull(),
  capacity: integer("capacity").notNull(),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("tables_restaurant_id_idx").on(table.restaurantId),
]);

export const restaurantHours = pgTable("restaurant_hours", {
  id: text("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(),
  openTime: text("open_time").notNull(),
  closeTime: text("close_time").notNull(),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
}, (table) => [
  index("restaurant_hours_restaurant_id_idx").on(table.restaurantId),
]);

export const restaurantPhotos = pgTable("restaurant_photos", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  type: photoTypeEnum("type").notNull(),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("restaurant_photos_restaurant_id_idx").on(table.restaurantId),
]);

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  partySize: integer("party_size").notNull(),
  specialRequest: text("special_request"),
  status: bookingStatusEnum("status").notNull(),
  customerId: text("customer_id")
    .notNull()
    .references(() => users.id),
  tableId: text("table_id")
    .notNull()
    .references(() => tables.id),
  cancelledBy: cancelledByEnum("cancelled_by"),
  cancelledDate: text("cancelled_date"),
  cancelledReason: text("cancelled_reason"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("bookings_customer_id_idx").on(table.customerId),
  index("bookings_table_id_idx").on(table.tableId),
  index("bookings_status_idx").on(table.status),
]);

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  price: integer("price").notNull(),
  status: paymentStatusEnum("status").notNull(),
  deadline: text("deadline").notNull(),
  gatewayToken: text("gateway_token").notNull(),
  paidAt: text("paid_at"),
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("payments_booking_id_idx").on(table.bookingId),
]);

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  customerComment: text("customer_comment").notNull(),
  customerRating: doublePrecision("customer_rating").notNull(),
  customerCommentAt: text("customer_comment_at").notNull(),
  ownerReply: text("owner_reply"),
  ownerReplyAt: text("owner_reply_at"),
  bookingId: text("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("reviews_booking_id_idx").on(table.bookingId),
]);

export const otpTokens = pgTable("otp_tokens", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  code: text("code").notNull(),
  type: otpTypeEnum("type").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [
  index("otp_tokens_email_idx").on(table.email),
]);

const customersRelations = relations(customers, ({ one }) => ({
  user: one(users, { fields: [customers.userId], references: [users.id] }),
}));

const ownersRelations = relations(owners, ({ one }) => ({
  user: one(users, { fields: [owners.userId], references: [users.id] }),
}));

const officersRelations = relations(officers, ({ one }) => ({
  user: one(users, { fields: [officers.userId], references: [users.id] }),
  restaurant: one(restaurants, {
    fields: [officers.restaurantId],
    references: [restaurants.id],
  }),
}));

const usersRelations = relations(users, ({ one, many }) => ({
  customerProfile: one(customers, {
    fields: [users.id],
    references: [customers.userId],
  }),
  ownerProfile: one(owners, {
    fields: [users.id],
    references: [owners.userId],
  }),
  officerProfile: one(officers, {
    fields: [users.id],
    references: [officers.userId],
  }),
  ownedRestaurants: many(restaurants),
  bookings: many(bookings),
}));

const categoriesRelations = relations(categories, ({ many }) => ({
  restaurants: many(restaurants),
}));

const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  owner: one(users, { fields: [restaurants.ownerId], references: [users.id] }),
  category: one(categories, {
    fields: [restaurants.categoryId],
    references: [categories.id],
  }),
  tables: many(tables),
  hours: many(restaurantHours),
  photos: many(restaurantPhotos),
  officers: many(officers),
}));

const tablesRelations = relations(tables, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [tables.restaurantId],
    references: [restaurants.id],
  }),
  bookings: many(bookings),
}));

const restaurantHoursRelations = relations(restaurantHours, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [restaurantHours.restaurantId],
    references: [restaurants.id],
  }),
}));

const restaurantPhotosRelations = relations(restaurantPhotos, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [restaurantPhotos.restaurantId],
    references: [restaurants.id],
  }),
}));

const bookingsRelations = relations(bookings, ({ one }) => ({
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
  }),
  table: one(tables, { fields: [bookings.tableId], references: [tables.id] }),
  payment: one(payments, {
    fields: [bookings.id],
    references: [payments.bookingId],
  }),
  review: one(reviews, {
    fields: [bookings.id],
    references: [reviews.bookingId],
  }),
}));

const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));

const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
}));

export type UserRow = typeof users.$inferSelect;
export type CustomerRow = typeof customers.$inferSelect;
export type OwnerRow = typeof owners.$inferSelect;
export type OfficerRow = typeof officers.$inferSelect;
export type RestaurantRow = typeof restaurants.$inferSelect;
export type TableRow = typeof tables.$inferSelect;
export type BookingRow = typeof bookings.$inferSelect;
export type PaymentRow = typeof payments.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type OtpTokenRow = typeof otpTokens.$inferSelect;

export {
  bookingsRelations,
  categoriesRelations,
  customersRelations,
  officersRelations,
  ownersRelations,
  paymentsRelations,
  restaurantHoursRelations,
  restaurantPhotosRelations,
  restaurantsRelations,
  reviewsRelations,
  tablesRelations,
  usersRelations,
};