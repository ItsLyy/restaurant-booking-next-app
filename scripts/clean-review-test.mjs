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

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1 });
await sql`delete from reviews where id like ${"review-t" + "%"}`;
await sql`delete from bookings where id like ${"booking-t" + "%"}`;
await sql.end();

for (const file of [BOOKINGS, REVIEWS]) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const cleaned = data.filter(
    (x) => !/^booking-t\d+$/.test(x.id) && !/^review-t\d+$/.test(x.id),
  );
  fs.writeFileSync(file, `${JSON.stringify(cleaned, null, 2)}\n`, "utf8");
}
console.log("cleaned test bookings + test reviews");