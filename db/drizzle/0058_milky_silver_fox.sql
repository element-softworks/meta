DO $$ BEGIN
 CREATE TYPE "public"."AnswerType" AS ENUM('MULTISELECT', 'DROPDOWN_SINGLE_SELECT', 'IMAGE', 'WHOLE_NUMBERS', 'YES/NO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Answer" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Question" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"meta_question_id" text,
	"question" text NOT NULL,
	"answer_type" "AnswerType" NOT NULL,
	"note" text,
	"fixture_related" text,
	"labels" text
);
