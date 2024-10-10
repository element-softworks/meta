CREATE TABLE IF NOT EXISTS "Bug" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"status" "BugStatus" DEFAULT 'OPEN' NOT NULL,
	"comment" text NOT NULL
);
