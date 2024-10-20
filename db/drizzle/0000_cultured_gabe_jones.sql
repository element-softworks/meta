DO $$ BEGIN
 CREATE TYPE "public"."TeamRole" AS ENUM('OWNER', 'ADMIN', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."UserRole" AS ENUM('ADMIN', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Account" (
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "Account_pkey" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Bug" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"images" text[] DEFAULT '{}'::text[] NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"title" text NOT NULL,
	"comment" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ConciergeToken" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp (3) NOT NULL,
	"teamId" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" "TeamRole" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Customer" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teamId" text NOT NULL,
	"userId" text NOT NULL,
	"stripeCustomerId" text NOT NULL,
	"stripeSubscriptionId" text NOT NULL,
	"startDate" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"endDate" timestamp (3),
	"planId" text NOT NULL,
	"email" text NOT NULL,
	"status" text NOT NULL,
	"cancelAtPeriodEnd" boolean NOT NULL,
	"type" text DEFAULT 'subscription' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "CustomerInvoice" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoiceId" text,
	"customerId" text NOT NULL,
	"stripeSubscriptionId" text NOT NULL,
	"amountPaid" double precision NOT NULL,
	"amountDue" double precision NOT NULL,
	"total" double precision NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"amountRemaining" double precision NOT NULL,
	"invoicePdf" text,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"teamId" text NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Session" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"endsAt" timestamp (3),
	"ipAddress" text,
	"isBot" boolean,
	"userAgent" text,
	"browser" text,
	"engine" text,
	"os" text,
	"device" text,
	"cpu" text,
	"email" text,
	"deviceType" text,
	"converted" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Team" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdBy" text NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"isArchived" boolean DEFAULT false NOT NULL,
	"image" text,
	"stripeCustomerId" text,
	"stripePaymentId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TeamMember" (
	"teamId" text NOT NULL,
	"userId" text NOT NULL,
	"role" "TeamRole" DEFAULT 'USER' NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	CONSTRAINT "TeamMember_pkey" PRIMARY KEY("teamId","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TwoFactorConfirmation" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TwoFactorToken" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp (3),
	"image" text,
	"password" text,
	"role" "UserRole" DEFAULT 'USER' NOT NULL,
	"isTwoFactorEnabled" boolean DEFAULT false NOT NULL,
	"isArchived" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP,
	"lastLogin" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"notificationsEnabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserNotification" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"readAt" timestamp (3),
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "VerificationToken" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"newEmail" text,
	"token" text NOT NULL,
	"expiresAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Customer" ADD CONSTRAINT "Customer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "CustomerInvoice" ADD CONSTRAINT "CustomerInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserNotification" ADD CONSTRAINT "UserNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ConciergeToken_email_token_key" ON "ConciergeToken" USING btree ("email","token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ConciergeToken_teamId_email_idx" ON "ConciergeToken" USING btree ("teamId","email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ConciergeToken_token_key" ON "ConciergeToken" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Customer_stripeCustomerId_key" ON "Customer" USING btree ("stripeCustomerId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Customer_teamId_userId_idx" ON "Customer" USING btree ("teamId","userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "CustomerInvoice_customerId_idx" ON "CustomerInvoice" USING btree ("customerId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "PasswordResetToken_email_token_idx" ON "PasswordResetToken" USING btree ("email","token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_email_token_key" ON "PasswordResetToken" USING btree ("email","token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_token_key" ON "PasswordResetToken" USING btree ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Team_stripeCustomerId_stripePaymentId_idx" ON "Team" USING btree ("stripeCustomerId","stripePaymentId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TeamMember_userId_teamId_idx" ON "TeamMember" USING btree ("userId","teamId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "TwoFactorConfirmation_userId_key" ON "TwoFactorConfirmation" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "TwoFactorToken_email_token_key" ON "TwoFactorToken" USING btree ("email","token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "TwoFactorToken_token_key" ON "TwoFactorToken" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "User_email_name_idx" ON "User" USING btree ("email","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "UserNotification_userId_idx" ON "UserNotification" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_email_token_key" ON "VerificationToken" USING btree ("email","token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "VerificationToken_newEmail_token_idx" ON "VerificationToken" USING btree ("newEmail","token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken" USING btree ("token");