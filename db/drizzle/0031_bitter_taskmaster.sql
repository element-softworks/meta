DO $$ BEGIN
 CREATE TYPE "public"."" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coachApplicationApplication" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coachId" text NOT NULL,
	"status" "" DEFAULT 'PENDING' NOT NULL,
	"reviewedAt" timestamp (3),
	"reviewedBy" text,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
