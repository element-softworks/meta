ALTER TABLE "Bug" RENAME COLUMN "role" TO "status";--> statement-breakpoint
ALTER TABLE "Bug" ALTER COLUMN "status" SET DATA TYPE BugStatus;--> statement-breakpoint
ALTER TABLE "Bug" ALTER COLUMN "status" SET DEFAULT 'OPEN';