DROP TABLE "PolicyStore";--> statement-breakpoint
ALTER TABLE "Store" ADD COLUMN "policyId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Store" ADD CONSTRAINT "Store_policyId_Policy_id_fk" FOREIGN KEY ("policyId") REFERENCES "public"."Policy"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
