DROP TABLE "Team";--> statement-breakpoint
DROP TABLE "TeamMember";--> statement-breakpoint
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_teamId_fkey";
--> statement-breakpoint
ALTER TABLE "CustomerInvoice" DROP CONSTRAINT "CustomerInvoice_customerId_fkey";
--> statement-breakpoint
DROP INDEX IF EXISTS "Customer_stripeCustomerId_key";--> statement-breakpoint
DROP INDEX IF EXISTS "Customer_teamId_userId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "CustomerInvoice_customerId_idx";--> statement-breakpoint
ALTER TABLE "CustomerInvoice" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "stripeCustomerId" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "stripePaymentId" text;--> statement-breakpoint
ALTER TABLE "ConciergeToken" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
ALTER TABLE "Customer" DROP COLUMN IF EXISTS "teamId";--> statement-breakpoint
ALTER TABLE "CustomerInvoice" DROP COLUMN IF EXISTS "teamId";