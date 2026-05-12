CREATE TYPE "public"."english_level" AS ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2');--> statement-breakpoint
CREATE TABLE "user_video_history" (
	"user_id" text NOT NULL,
	"video_id" text NOT NULL,
	"current_progress" integer NOT NULL,
	"last_watched_at" timestamp NOT NULL,
	CONSTRAINT "user_video_history_user_id_video_id_pk" PRIMARY KEY("user_id","video_id")
);
--> statement-breakpoint
CREATE TABLE "video" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"url" varchar NOT NULL,
	"video_length" timestamp NOT NULL,
	"tag" varchar NOT NULL,
	"vtt" varchar NOT NULL,
	"level" "english_level" NOT NULL,
	"thumbnail_url" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_video_history" ADD CONSTRAINT "user_video_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_video_history" ADD CONSTRAINT "user_video_history_video_id_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video"("id") ON DELETE cascade ON UPDATE no action;