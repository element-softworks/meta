ALTER TABLE "PolicyQuestion" DROP CONSTRAINT "PolicyQuestion_questionId_Question_id_fk";
--> statement-breakpoint
ALTER TABLE "PolicyQuestion" DROP CONSTRAINT "PolicyQuestion_policyId_Policy_id_fk";
--> statement-breakpoint
ALTER TABLE "PolicyStore" DROP CONSTRAINT "PolicyStore_questionId_Store_id_fk";
--> statement-breakpoint
ALTER TABLE "PolicyStore" DROP CONSTRAINT "PolicyStore_policyId_Policy_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PolicyQuestion" ADD CONSTRAINT "PolicyQuestion_questionId_Question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PolicyQuestion" ADD CONSTRAINT "PolicyQuestion_policyId_Policy_id_fk" FOREIGN KEY ("policyId") REFERENCES "public"."Policy"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PolicyStore" ADD CONSTRAINT "PolicyStore_questionId_Store_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."Store"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PolicyStore" ADD CONSTRAINT "PolicyStore_policyId_Policy_id_fk" FOREIGN KEY ("policyId") REFERENCES "public"."Policy"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
