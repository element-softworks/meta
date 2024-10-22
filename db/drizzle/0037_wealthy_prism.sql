CREATE TABLE IF NOT EXISTS "coachSchedule" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coachId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timeframe" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timeframeDayId" text NOT NULL,
	"startDate" timestamp (3) NOT NULL,
	"endDate" timestamp (3) NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timeframeDay" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coachScheduleId" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Coach" ALTER COLUMN "scheduleId" DROP NOT NULL;