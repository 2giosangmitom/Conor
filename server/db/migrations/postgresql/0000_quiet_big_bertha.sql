CREATE TYPE "public"."english_level" AS ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_attempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_session_id" uuid NOT NULL,
	"transcript_sentence_id" uuid NOT NULL,
	"expected_text" text NOT NULL,
	"user_text" text NOT NULL,
	"accuracy" integer NOT NULL,
	"hints_used" integer DEFAULT 0 NOT NULL,
	"time_taken" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"video_id" uuid NOT NULL,
	"current_sentence_index" integer DEFAULT 0 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"last_practiced_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'user',
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "video" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(300) NOT NULL,
	"youtube_id" varchar(20) NOT NULL,
	"duration" integer NOT NULL,
	"topic" varchar(100) NOT NULL,
	"level" "english_level" NOT NULL,
	"thumbnail_url" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_transcript_sentence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid NOT NULL,
	"sentence_index" integer NOT NULL,
	"start_time" integer NOT NULL,
	"end_time" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "word_mistake" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practice_attempt_id" uuid NOT NULL,
	"expected_word" varchar(100) NOT NULL,
	"user_word" varchar(100),
	"word_position" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_attempt" ADD CONSTRAINT "practice_attempt_practice_session_id_practice_session_id_fk" FOREIGN KEY ("practice_session_id") REFERENCES "public"."practice_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_attempt" ADD CONSTRAINT "practice_attempt_transcript_sentence_id_video_transcript_sentence_id_fk" FOREIGN KEY ("transcript_sentence_id") REFERENCES "public"."video_transcript_sentence"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_session" ADD CONSTRAINT "practice_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_session" ADD CONSTRAINT "practice_session_video_id_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_transcript_sentence" ADD CONSTRAINT "video_transcript_sentence_video_id_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_mistake" ADD CONSTRAINT "word_mistake_practice_attempt_id_practice_attempt_id_fk" FOREIGN KEY ("practice_attempt_id") REFERENCES "public"."practice_attempt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "practice_attempt_session_idx" ON "practice_attempt" USING btree ("practice_session_id");--> statement-breakpoint
CREATE INDEX "practice_attempt_transcript_sentence_idx" ON "practice_attempt" USING btree ("transcript_sentence_id");--> statement-breakpoint
CREATE INDEX "practice_session_user_idx" ON "practice_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "practice_session_video_idx" ON "practice_session" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "practice_session_user_video_idx" ON "practice_session" USING btree ("user_id","video_id");--> statement-breakpoint
CREATE UNIQUE INDEX "video_youtube_id_unique_idx" ON "video" USING btree ("youtube_id");--> statement-breakpoint
CREATE INDEX "video_level_idx" ON "video" USING btree ("level");--> statement-breakpoint
CREATE INDEX "video_topic_idx" ON "video" USING btree ("topic");--> statement-breakpoint
CREATE UNIQUE INDEX "video_sentence_unique_idx" ON "video_transcript_sentence" USING btree ("video_id","sentence_index");--> statement-breakpoint
CREATE INDEX "video_transcript_video_id_idx" ON "video_transcript_sentence" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "word_mistake_attempt_idx" ON "word_mistake" USING btree ("practice_attempt_id");