ALTER TABLE "officers" DROP CONSTRAINT "officers_restaurant_id_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "officers" ADD CONSTRAINT "officers_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;