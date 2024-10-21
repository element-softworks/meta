DROP TABLE "timeframe";--> statement-breakpoint
ALTER TABLE "Coach" DROP CONSTRAINT "Coach_userId_fkey";
--> statement-breakpoint
ALTER TABLE "Coach" DROP CONSTRAINT "Coach_scheduleId_fkey";
--> statement-breakpoint
DROP INDEX IF EXISTS "Coach_userId_idx";--> statement-breakpoint
ALTER TABLE "timeframeDay" ADD COLUMN "startDate" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "timeframeDay" ADD COLUMN "endDate" integer NOT NULL;