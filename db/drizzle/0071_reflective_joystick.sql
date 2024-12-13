CREATE TABLE IF NOT EXISTS "FixtureType" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdBy" text NOT NULL,
	"images" text[] DEFAULT '{}'::text[] NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL
);
