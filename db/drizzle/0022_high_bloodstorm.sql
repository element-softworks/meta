ALTER TABLE "Bug" RENAME COLUMN "bugStatus" TO "role";--> statement-breakpoint
ALTER TABLE "Bug" ALTER COLUMN "role" SET DATA TYPE UserRole;--> statement-breakpoint
ALTER TABLE "Bug" ALTER COLUMN "role" SET DEFAULT 'USER';