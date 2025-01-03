CREATE TABLE IF NOT EXISTS "Assessment" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_id" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_by" text NOT NULL,
	"updated_at" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_by" text NOT NULL,
	"archived_at" timestamp (3),
	"archived_by" text
);
