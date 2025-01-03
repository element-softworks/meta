ALTER TABLE "Store" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "Store" RENAME COLUMN "createdBy" TO "created_by";--> statement-breakpoint
ALTER TABLE "Store" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "Store" RENAME COLUMN "updatedBy" TO "updated_by";--> statement-breakpoint
ALTER TABLE "Store" RENAME COLUMN "archivedAt" TO "archived_at";--> statement-breakpoint
ALTER TABLE "Store" RENAME COLUMN "archivedBy" TO "archived_by";--> statement-breakpoint
ALTER TABLE "Store" ADD COLUMN "meta_store_id" integer;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_meta_store_id_unique" ON "Store" USING btree ("meta_store_id");--> statement-breakpoint
ALTER TABLE "Store" ADD CONSTRAINT "Store_meta_store_id_unique" UNIQUE("meta_store_id");