DO $$ BEGIN
 CREATE TYPE "public"."BookingType" AS ENUM('BOOKING', 'BLOCKED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coachBooking" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coachId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdById" text,
	"bookingType" "BookingType" DEFAULT 'BOOKING' NOT NULL,
	"startDate" timestamp (3) NOT NULL,
	"endDate" timestamp (3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Coach" ADD COLUMN "bookingInAdvance" integer DEFAULT 28 NOT NULL;