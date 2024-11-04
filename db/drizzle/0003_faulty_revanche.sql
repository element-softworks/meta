ALTER TABLE "ConciergeToken" RENAME COLUMN "teamId" TO "userId";--> statement-breakpoint
DROP INDEX IF EXISTS "ConciergeToken_email_token_key";--> statement-breakpoint
DROP INDEX IF EXISTS "ConciergeToken_teamId_email_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "ConciergeToken_token_key";