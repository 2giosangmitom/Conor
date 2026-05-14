import {
  pgTable,
  text,
  timestamp,
  varchar,
  pgEnum,
  integer,
  jsonb,
  uuid,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schema } from "@nuxthub/db";

export const englishLevel = pgEnum("english_level", ["A1", "A2", "B1", "B2", "C1", "C2"]);

export const video = pgTable(
  "video",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 300 }).notNull(),
    youtubeId: varchar("youtube_id", { length: 20 }).notNull(),
    duration: integer("duration").notNull(), // seconds
    topic: varchar("topic", { length: 100 }).notNull(),
    level: englishLevel("level").notNull(),
    thumbnailUrl: varchar("thumbnail_url", {
      length: 500,
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("video_youtube_id_unique_idx").on(table.youtubeId),
    index("video_level_idx").on(table.level),
    index("video_topic_idx").on(table.topic),
  ],
);

export const videoTranscriptSentence = pgTable(
  "video_transcript_sentence",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    videoId: uuid("video_id")
      .references(() => video.id, {
        onDelete: "cascade",
      })
      .notNull(),
    sentenceIndex: integer("sentence_index").notNull(),
    startTime: integer("start_time").notNull(), // milliseconds
    endTime: integer("end_time").notNull(), // milliseconds
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("video_sentence_unique_idx").on(table.videoId, table.sentenceIndex),
    index("video_transcript_video_id_idx").on(table.videoId),
  ],
);

export const practiceSession = pgTable(
  "practice_session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => schema.user.id, {
        onDelete: "cascade",
      })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => video.id, {
        onDelete: "cascade",
      })
      .notNull(),
    currentSentenceIndex: integer("current_sentence_index").default(0).notNull(),
    completed: boolean("completed").default(false).notNull(),
    score: integer("score"),
    lastPracticedAt: timestamp("last_practiced_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("practice_session_user_idx").on(table.userId),
    index("practice_session_video_idx").on(table.videoId),
    index("practice_session_user_video_idx").on(table.userId, table.videoId),
  ],
);

export const practiceAttempt = pgTable(
  "practice_attempt",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    practiceSessionId: uuid("practice_session_id")
      .references(() => practiceSession.id, {
        onDelete: "cascade",
      })
      .notNull(),
    transcriptSentenceId: uuid("transcript_sentence_id")
      .references(() => videoTranscriptSentence.id, {
        onDelete: "cascade",
      })
      .notNull(),
    expectedText: text("expected_text").notNull(),
    userText: text("user_text").notNull(),
    accuracy: integer("accuracy").notNull(), // 0-100
    hintsUsed: integer("hints_used").default(0).notNull(),
    timeTaken: integer("time_taken").default(0).notNull(), // seconds
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("practice_attempt_session_idx").on(table.practiceSessionId),
    index("practice_attempt_transcript_sentence_idx").on(table.transcriptSentenceId),
  ],
);

export const wordMistake = pgTable(
  "word_mistake",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    practiceAttemptId: uuid("practice_attempt_id")
      .references(() => practiceAttempt.id, {
        onDelete: "cascade",
      })
      .notNull(),
    expectedWord: varchar("expected_word", {
      length: 100,
    }).notNull(),
    userWord: varchar("user_word", {
      length: 100,
    }),
    wordPosition: integer("word_position").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("word_mistake_attempt_idx").on(table.practiceAttemptId)],
);

export const videoRelations = relations(video, ({ many }) => ({
  transcriptSentences: many(videoTranscriptSentence),
  practiceSessions: many(practiceSession),
}));

export const videoTranscriptSentenceRelations = relations(
  videoTranscriptSentence,
  ({ one, many }) => ({
    video: one(video, {
      fields: [videoTranscriptSentence.videoId],
      references: [video.id],
    }),
    practiceAttempts: many(practiceAttempt),
  }),
);

export const userRelations = relations(schema.user, ({ many }) => ({
  practiceSessions: many(practiceSession),
}));

export const practiceSessionRelations = relations(practiceSession, ({ one, many }) => ({
  user: one(schema.user, {
    fields: [practiceSession.userId],
    references: [schema.user.id],
  }),
  video: one(video, {
    fields: [practiceSession.videoId],
    references: [video.id],
  }),
  attempts: many(practiceAttempt),
}));

export const practiceAttemptRelations = relations(practiceAttempt, ({ one, many }) => ({
  practiceSession: one(practiceSession, {
    fields: [practiceAttempt.practiceSessionId],
    references: [practiceSession.id],
  }),
  transcriptSentence: one(videoTranscriptSentence, {
    fields: [practiceAttempt.transcriptSentenceId],
    references: [videoTranscriptSentence.id],
  }),
  wordMistakes: many(wordMistake),
}));

export const wordMistakeRelations = relations(wordMistake, ({ one }) => ({
  practiceAttempt: one(practiceAttempt, {
    fields: [wordMistake.practiceAttemptId],
    references: [practiceAttempt.id],
  }),
}));
