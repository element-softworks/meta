ALTER TABLE "timeframeDay" RENAME COLUMN "startDate" TO "startHour";--> statement-breakpoint
ALTER TABLE "timeframeDay" RENAME COLUMN "endDate" TO "endHour";--> statement-breakpoint
ALTER TABLE "timeframeDay" ALTER COLUMN "startHour" SET DATA TYPE numeric(4, 2);--> statement-breakpoint
ALTER TABLE "timeframeDay" ALTER COLUMN "endHour" SET DATA TYPE numeric(4, 2);