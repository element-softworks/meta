CREATE TABLE IF NOT EXISTS "Coach" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"user" text NOT NULL,
	"verified" timestamp (3),
	"verifiedBy" text,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"archivedAt" timestamp (3),
	"cooldown" integer DEFAULT 15 NOT NULL
);
