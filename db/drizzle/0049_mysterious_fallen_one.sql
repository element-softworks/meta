DROP TABLE "Customer";--> statement-breakpoint
DROP TABLE "CustomerInvoice";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "stripeCustomerId";--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "stripePaymentId";