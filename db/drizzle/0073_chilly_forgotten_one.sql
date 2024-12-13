CREATE TABLE IF NOT EXISTS "FixtureTypeCategory" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdBy" text NOT NULL,
	"archivedAt" timestamp (3),
	"archivedBy" text,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "FixtureType" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FixtureType" ADD CONSTRAINT "FixtureType_category_FixtureTypeCategory_id_fk" FOREIGN KEY ("category") REFERENCES "public"."FixtureTypeCategory"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
