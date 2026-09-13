import fs from "fs";
import path from "path";
import postgres from "postgres";
import { dirname } from "path";
import { fileURLToPath } from "url";

process.loadEnvFile?.(".env.local");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BOOKINGS = path.join(ROOT, "app/_data/dummy/bookings.json");
const REVIEWS = path.join(ROOT, "app/_data/dummy/reviews.json");

const customers = ["user-003", "user-004", "user-005", "user-006", "user-007"];
const tables = ["table-103", "table-104", "table-105", "table-106", "table-107"];
const base = Date.parse("2026-07-01T18:00:00.000Z");

const count = Number.parseInt(process.argv[2] ?? "5", 10);

const bookings = JSON.parse(fs.readFileSync(BOOKINGS, "utf8"));
const reviews = JSON.parse(fs.readFileSync(REVIEWS, "utf8"));

const newBookings = Array.from({ length: count }, (_, i) => {
  const customerId = customers[i % customers.length];
  return {
    id: `booking-t${i + 1}`,
    date: "2026-07-10",
    time: "19:00",
    partySize: 2,
    specialRequest: null,
    status: "completed",
    customerId,
    tableId: tables[i % tables.length],
    createdAt: new Date(base + i * 60000).toISOString(),
    updatedAt: new Date(base + i * 60000 + 1000).toISOString(),
  };
});

const newReviews = Array.from({ length: count }, (_, i) => {
  return {
    id: `review-t${i + 1}`,
    customerComment: `Temporary test review #${i + 1}`,
    customerRating: 4 + (i % 2),
    customerCommentAt: new Date(base + i * 3600000).toISOString(),
    bookingId: `booking-t${i + 1}`,
    createdAt: new Date(base + i * 3600000).toISOString(),
    updatedAt: new Date(base + i * 3600000).toISOString(),
  };
});

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1 });
for (const b of newBookings) {
  await sql`
    insert into bookings (id, date, time, party_size, special_request, status, customer_id, table_id, created_at, updated_at)
    values (${b.id}, ${b.date}, ${b.time}, ${b.partySize}, ${b.specialRequest}, ${b.status}, ${b.customerId}, ${b.tableId}, ${b.createdAt}, ${b.updatedAt})
    on conflict (id) do update set status = ${b.status}, customer_id = ${b.customerId}, table_id = ${b.tableId}
  `;
}
for (const r of newReviews) {
  await sql`
    insert into reviews (id, customer_comment, customer_rating, customer_comment_at, booking_id, created_at, updated_at)
    values (${r.id}, ${r.customerComment}, ${r.customerRating}, ${r.customerCommentAt}, ${r.bookingId}, ${r.createdAt}, ${r.updatedAt})
    on conflict (id) do update set customer_comment = ${r.customerComment}
  `;
}
await sql.end();

for (const b of newBookings) {
  if (!bookings.some((x) => x.id === b.id)) bookings.push(b);
}
for (const r of newReviews) {
  if (!reviews.some((x) => x.id === r.id)) reviews.push(r);
}
fs.writeFileSync(BOOKINGS, `${JSON.stringify(bookings, null, 2)}\n`, "utf8");
fs.writeFileSync(REVIEWS, `${JSON.stringify(reviews, null, 2)}\n`, "utf8");
console.log("seeded 5 test bookings + 5 test reviews");