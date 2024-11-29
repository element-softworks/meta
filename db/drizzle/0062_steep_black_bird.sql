ALTER TABLE "Answer" ADD COLUMN "createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "Answer" ADD COLUMN "createdBy" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Answer" ADD COLUMN "updatedAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "Answer" ADD COLUMN "updatedBy" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Answer" ADD COLUMN "archivedAt" timestamp (3);--> statement-breakpoint
ALTER TABLE "Answer" ADD COLUMN "archivedBy" text;--> statement-breakpoint
ALTER TABLE "Question" ADD COLUMN "createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "Question" ADD COLUMN "createdBy" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Question" ADD COLUMN "updatedAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "Question" ADD COLUMN "updatedBy" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Question" ADD COLUMN "archivedAt" timestamp (3);--> statement-breakpoint
ALTER TABLE "Question" ADD COLUMN "archivedBy" text;