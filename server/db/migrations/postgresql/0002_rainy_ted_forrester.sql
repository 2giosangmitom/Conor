DROP INDEX "practice_session_user_video_idx";--> statement-breakpoint
--> statement-breakpoint
-- Deduplicate: keep one session per (user_id, video_id), pick highest progress
DELETE FROM "practice_session" WHERE "id" IN (
  SELECT "id" FROM (
    SELECT "id",
      ROW_NUMBER() OVER (
        PARTITION BY "user_id", "video_id"
        ORDER BY "current_sentence_index" DESC, "last_practiced_at" DESC
      ) AS rn
    FROM "practice_session"
  ) ranked
  WHERE rn > 1
);--> statement-breakpoint
CREATE UNIQUE INDEX "practice_session_user_video_unique_idx" ON "practice_session" USING btree ("user_id","video_id");