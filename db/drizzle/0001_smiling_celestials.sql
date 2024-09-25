CREATE TABLE IF NOT EXISTS "Session" (
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"archivedAt" timestamp (3),
	"ipAddress" text,
	"isBot" boolean,
	"userAgent" text,
	"browser" text,
	"engine" text,
	"os" text,
	"device" text,
	"cpu" text,
	"userId" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
