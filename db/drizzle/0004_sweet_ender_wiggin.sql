ALTER TABLE "Session" RENAME COLUMN "userId" TO "email";--> statement-breakpoint
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_User_id_fk";
