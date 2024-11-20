ALTER TABLE "Coach" ALTER COLUMN "certificates" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "Coach" ALTER COLUMN "certificates" DROP NOT NULL;