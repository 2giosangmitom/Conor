import {
  pgTable,
  text,
  timestamp,
  varchar,
  pgEnum,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import { schema } from "@nuxthub/db";
import { relations } from "drizzle-orm";

export const englishLevel = pgEnum("english_level", ["A1", "A2", "B1", "B2", "C1", "C2"]);

export const video = pgTable("video", {
  id: text("id").primaryKey(),
  title: varchar("title").notNull(),
  description: varchar("description").notNull(),
  youtubeVideoId: varchar("youtube_video_id").notNull(),
  videoLength: timestamp("video_length").notNull(),
  topic: varchar("tag").notNull(),
  vtt: varchar("vtt").notNull(),
  level: englishLevel("level").notNull(),
  thumbnailUrl: varchar("thumbnail_url").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const userVideoHistory = pgTable(
  "user_video_history",
  {
    userId: text("user_id")
      .notNull()
      .references(() => schema.user.id, { onDelete: "cascade" }),
    videoId: text("video_id")
      .notNull()
      .references(() => video.id, { onDelete: "cascade" }),
    currentProgress: integer("current_progress").notNull(),
    lastWatchedAt: timestamp("last_watched_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.videoId] })],
);

export const videoRelations = relations(video, ({ many }) => ({
  userVideoHistory: many(userVideoHistory),
}));

export const userRelations = relations(schema.user, ({ many }) => ({
  userVideoHistory: many(userVideoHistory),
}));

export const userVideoHistoryRelations = relations(userVideoHistory, ({ one }) => ({
  user: one(schema.user, {
    fields: [userVideoHistory.userId],
    references: [schema.user.id],
  }),
  video: one(video, {
    fields: [userVideoHistory.videoId],
    references: [video.id],
  }),
}));
