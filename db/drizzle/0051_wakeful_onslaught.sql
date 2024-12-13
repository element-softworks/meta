CREATE TABLE IF NOT EXISTS "Location" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"max_capacity" integer,
	"cover_image_asset_id" text,
	"contact_email" varchar(256),
	"opening_times" jsonb,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdBy" text NOT NULL,
	"updatedAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" text NOT NULL,
	"archivedAt" timestamp (3),
	"archivedBy" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LocationGeolocation" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_id" text,
	"longitude" double precision NOT NULL,
	"latitude" double precision NOT NULL,
	"zoom" integer NOT NULL,
	"bounding_box" jsonb NOT NULL,
	"address_name" varchar(256) NOT NULL,
	"address_line_one" varchar(256),
	"address_line_two" varchar(256),
	"city" varchar(256),
	"county" varchar(256),
	"country" varchar(256),
	"post_code" varchar(32),
	"address_type" varchar(50) NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdBy" text NOT NULL,
	"updatedAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" text NOT NULL,
	"archivedAt" timestamp (3),
	"archivedBy" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LocationGeolocation" ADD CONSTRAINT "LocationGeolocation_location_id_Location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."Location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "location_name_index" ON "Location" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "location_geolocation_location_id_index" ON "LocationGeolocation" USING btree ("location_id");