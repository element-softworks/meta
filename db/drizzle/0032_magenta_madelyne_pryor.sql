DO $$ BEGIN
 CREATE TYPE "public"."ApplicationStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "coachApplicationApplication" ALTER COLUMN "status" SET DATA TYPE ApplicationStatus;