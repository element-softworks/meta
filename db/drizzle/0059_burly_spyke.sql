ALTER TYPE "AnswerType" ADD VALUE 'DROP_DOWN_SINGLE_SELECT';--> statement-breakpoint
ALTER TABLE "Answer" ADD COLUMN "answer" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Answer" ADD COLUMN "meta_choice_id" text;