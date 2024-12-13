ALTER TABLE "StoreGeolocation" ALTER COLUMN "longitude" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "StoreGeolocation" DROP COLUMN IF EXISTS "latitude";