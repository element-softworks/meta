ALTER TABLE "Location" RENAME TO "Store";--> statement-breakpoint
ALTER TABLE "LocationGeolocation" RENAME TO "StoreGeolocation";--> statement-breakpoint
ALTER TABLE "StoreGeolocation" RENAME COLUMN "location_id" TO "store_id";--> statement-breakpoint
ALTER TABLE "StoreGeolocation" DROP CONSTRAINT "LocationGeolocation_location_id_Location_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "location_name_index";--> statement-breakpoint
DROP INDEX IF EXISTS "location_geolocation_location_id_index";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StoreGeolocation" ADD CONSTRAINT "StoreGeolocation_store_id_Store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."Store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_name_index" ON "Store" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_geolocation_store_id_index" ON "StoreGeolocation" USING btree ("store_id");