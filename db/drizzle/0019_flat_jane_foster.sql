ALTER TABLE "Bug" RENAME COLUMN "bugStatus" TO "status";--> statement-breakpoint
ALTER TABLE "Bug" ALTER COLUMN "status" DROP NOT NULL;