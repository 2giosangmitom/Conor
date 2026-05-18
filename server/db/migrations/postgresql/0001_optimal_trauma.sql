ALTER TABLE "practice_session" ALTER COLUMN "score" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "practice_session" ALTER COLUMN "score" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "practice_session" ALTER COLUMN "last_practiced_at" SET NOT NULL;