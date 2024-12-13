CREATE TABLE IF NOT EXISTS "StoreQuestion" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"questionId" text NOT NULL,
	"storeId" text NOT NULL,
	"answerId" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StoreQuestion" ADD CONSTRAINT "StoreQuestion_questionId_Question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StoreQuestion" ADD CONSTRAINT "StoreQuestion_storeId_Policy_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."Policy"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "StoreQuestion" ADD CONSTRAINT "StoreQuestion_answerId_Question_id_fk" FOREIGN KEY ("answerId") REFERENCES "public"."Question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
