import { config } from "dotenv";
import { promises as fs } from "fs";
import path from "path";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { hashPassword } from "@libs/password";

import * as schema from "./schema";

export const DEMO_USER_PASSWORD = "Password123!";

config({ path: ".env.local", quiet: true });

const DUMMY_DIR = path.join(process.cwd(), "app/_data/dummy");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DUMMY_DIR, file), "utf8");
  return JSON.parse(raw) as T;
}

interface UserJson {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "customer" | "owner" | "officer";
  emailVerifyAt: string;
  allergics: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OwnerJson extends UserJson {
  businessLicense?: string;
  verifyAt?: string;
}

interface OfficerJson extends UserJson {
  position: "manager" | "staff";
  invitedBy: string;
  restaurantId: string;
}

interface CategoryJson {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RestaurantJson {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  address: string;
  tags: string[];
  ownerId: string;
  categoryId?: string;
  discount?: number;
  description: string;
  shortDescription?: string;
  lat?: number;
  lng?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TableJson {
  id: string;
  name: string;
  price: number;
  category: string;
  floor: number;
  capacity: number;
  restaurantId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface HourJson {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  restaurantId: string;
}

interface PhotoJson {
  id: string;
  url: string;
  type: "cover" | "post" | "menu";
  restaurantId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BookingJson {
  id: string;
  date: string;
  time: string;
  partySize: number;
  specialRequest?: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  customerId: string;
  tableId: string;
  cancelled?: {
    date: string;
    by: "user" | "restaurant";
    reason: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface PaymentJson {
  id: string;
  price: number;
  status: "unpaid" | "paid" | "refunded" | "unrefunded" | "failed";
  deadline: string;
  gatewayToken: string;
  paidAt?: string;
  bookingId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ReviewJson {
  id: string;
  customerComment: string;
  customerRating: number;
  customerCommentAt: string;
  ownerReply?: string;
  ownerReplyAt?: string;
  bookingId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OtpJson {
  id: string;
  email: string;
  code: string;
  type: "email_verification" | "password_reset" | "two_factor";
  expiresAt: string;
  createdAt: string;
}

async function main() {
  const demoPasswordHash = await hashPassword(DEMO_USER_PASSWORD);
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in the environment.");
  }
  const client = postgres(connectionString, { ssl: "require", max: 1 });
  const db = drizzle(client, { schema, casing: "snake_case" });

  const [users, owners, officers, categories, restaurants, tables, hours, photos, bookingsJson, payments, reviews, otps] =
    await Promise.all([
      readJson<UserJson[]>("users.json"),
      readJson<OwnerJson[]>("owners.json"),
      readJson<OfficerJson[]>("officers.json"),
      readJson<CategoryJson[]>("categories.json"),
      readJson<RestaurantJson[]>("restaurants.json"),
      readJson<TableJson[]>("tables.json"),
      readJson<HourJson[]>("restaurant_hours.json"),
      readJson<PhotoJson[]>("restaurant_photos.json"),
      readJson<BookingJson[]>("bookings.json"),
      readJson<PaymentJson[]>("payments.json"),
      readJson<ReviewJson[]>("reviews.json"),
      readJson<OtpJson[]>("otp_tokens.json"),
    ]);

  const now = new Date().toISOString();
  const stamp = (value?: string) => value ?? now;

  const userRows = [
    ...users.map((u) => ({ base: u, extra: {} })),
    ...owners.map((o) => ({ base: o, extra: {} })),
    ...officers.map((o) => ({ base: o, extra: {} })),
  ].map(({ base }) => ({
    id: base.id,
    username: base.username,
    email: base.email,
    password: demoPasswordHash,
    firstName: base.firstName,
    lastName: base.lastName,
    role: base.role,
    emailVerifyAt: base.emailVerifyAt,
    allergics: base.allergics ?? [],
    avatar: base.avatar ?? null,
    createdAt: stamp(base.createdAt),
    updatedAt: stamp(base.updatedAt),
  }));

  const customerRows = users.map((u) => ({ userId: u.id }));
  const ownerRows = owners.map((o) => ({
    userId: o.id,
    businessLicense: o.businessLicense ?? null,
    verifyAt: o.verifyAt ?? null,
  }));
  const officerRows = officers.map((o) => ({
    userId: o.id,
    position: o.position,
    invitedBy: o.invitedBy,
    restaurantId: o.restaurantId,
  }));

  const categoryRows = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: null,
    createdAt: stamp(c.createdAt),
    updatedAt: stamp(c.updatedAt),
  }));

  const restaurantRows = restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    country: r.country,
    city: r.city,
    address: r.address,
    tags: r.tags ?? [],
    ownerId: r.ownerId,
    categoryId: r.categoryId ?? null,
    discount: r.discount ?? null,
    description: r.description,
    shortDescription: r.shortDescription ?? null,
    lat: r.lat ?? null,
    lng: r.lng ?? null,
    createdAt: stamp(r.createdAt),
    updatedAt: stamp(r.updatedAt),
  }));

  const tableRows = tables.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    category: t.category,
    floor: t.floor,
    capacity: t.capacity,
    restaurantId: t.restaurantId,
    createdAt: stamp(t.createdAt),
    updatedAt: stamp(t.updatedAt),
  }));

  const hourRows = hours.map((h) => ({
    id: h.id,
    dayOfWeek: h.dayOfWeek,
    openTime: h.openTime,
    closeTime: h.closeTime,
    restaurantId: h.restaurantId,
  }));

  const photoRows = photos.map((p) => ({
    id: p.id,
    url: p.url,
    type: p.type,
    restaurantId: p.restaurantId,
    createdAt: stamp(p.createdAt),
    updatedAt: stamp(p.updatedAt),
  }));

  const bookingRows = bookingsJson.map((b) => ({
    id: b.id,
    date: b.date,
    time: b.time,
    partySize: b.partySize,
    specialRequest: b.specialRequest ?? null,
    status: b.status,
    customerId: b.customerId,
    tableId: b.tableId,
    cancelledBy: b.cancelled?.by ?? null,
    cancelledDate: b.cancelled?.date ?? null,
    cancelledReason: b.cancelled?.reason ?? null,
    createdAt: stamp(b.createdAt),
    updatedAt: stamp(b.updatedAt),
  }));

  const paymentRows = payments.map((p) => ({
    id: p.id,
    price: p.price,
    status: p.status,
    deadline: p.deadline,
    gatewayToken: p.gatewayToken,
    paidAt: p.paidAt ?? null,
    bookingId: p.bookingId,
    createdAt: stamp(p.createdAt),
    updatedAt: stamp(p.updatedAt),
  }));

  const reviewRows = reviews.map((r) => ({
    id: r.id,
    customerComment: r.customerComment,
    customerRating: r.customerRating,
    customerCommentAt: r.customerCommentAt,
    ownerReply: r.ownerReply ?? null,
    ownerReplyAt: r.ownerReplyAt ?? null,
    bookingId: r.bookingId,
    createdAt: stamp(r.createdAt),
    updatedAt: stamp(r.updatedAt),
  }));

  const otpRows = otps.map((o) => ({
    id: o.id,
    email: o.email,
    code: o.code,
    type: o.type,
    expiresAt: o.expiresAt,
    createdAt: o.createdAt,
  }));

  await db.transaction(async (tx) => {
    await tx.execute(
      "truncate table users, customers, owners, officers, categories, restaurants, tables, restaurant_hours, restaurant_photos, bookings, payments, reviews, otp_tokens cascade",
    );

    if (userRows.length) await tx.insert(schema.users).values(userRows);
    if (customerRows.length) {
      await tx.insert(schema.customers).values(customerRows);
    }
    if (ownerRows.length) await tx.insert(schema.owners).values(ownerRows);
    if (categoryRows.length) await tx.insert(schema.categories).values(categoryRows);
    if (restaurantRows.length) {
      await tx.insert(schema.restaurants).values(restaurantRows);
    }
    if (officerRows.length) await tx.insert(schema.officers).values(officerRows);
    if (tableRows.length) await tx.insert(schema.tables).values(tableRows);
    if (hourRows.length) await tx.insert(schema.restaurantHours).values(hourRows);
    if (photoRows.length) {
      await tx.insert(schema.restaurantPhotos).values(photoRows);
    }
    if (bookingRows.length) await tx.insert(schema.bookings).values(bookingRows);
    if (paymentRows.length) await tx.insert(schema.payments).values(paymentRows);
    if (reviewRows.length) await tx.insert(schema.reviews).values(reviewRows);
    if (otpRows.length) await tx.insert(schema.otpTokens).values(otpRows);
  });

  const counts = {
    users: userRows.length,
    customers: customerRows.length,
    owners: ownerRows.length,
    officers: officerRows.length,
    categories: categoryRows.length,
    restaurants: restaurantRows.length,
    tables: tableRows.length,
    hours: hourRows.length,
    photos: photoRows.length,
    bookings: bookingRows.length,
    payments: paymentRows.length,
    reviews: reviewRows.length,
    otpToks: otpRows.length,
  };
  console.log("Seed complete:", counts);
  await client.end();
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});