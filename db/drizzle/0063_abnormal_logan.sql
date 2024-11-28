CREATE TABLE IF NOT EXISTS "Policy" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdBy" text NOT NULL,
	"updatedAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedBy" text NOT NULL,
	"archivedAt" timestamp (3),
	"archivedBy" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PolicyQuestion" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"questionId" text NOT NULL,
	"policyId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PolicyStore" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"questionId" text NOT NULL,
	"policyId" text NOT NULL
);
