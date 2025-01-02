CREATE TABLE IF NOT EXISTS "Channel" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdBy" text NOT NULL,
	"archivedAt" timestamp (3),
	"archivedBy" text,
	"image" text,
	"country" text NOT NULL,
	"name" text NOT NULL
);
