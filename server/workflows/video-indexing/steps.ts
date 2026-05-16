import { getYouTubeVideoInfo } from "../../utils/youtube";
import { FatalError, getWritable } from "workflow";
import { parseSync, type Node } from "subtitle";
import { generateText, Output } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";
import { kv } from "@nuxthub/kv";

interface VideoInfo {
  title: string;
  duration: number;
  thumbnailUrl: string;
  tags: string[];
  language: string;
  subtitlesUrl: string;
}

interface VideoSubtitle {
  start: number;
  end: number;
  text: string;
}

type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface VideoAnalysis {
  topic: string;
  level: EnglishLevel;
}

const MAX_DURATION = 60 * 60; // 1 hour in seconds
const SUPPORTED_LANGUAGES = ["en"];

const STREAM_NAMESPACE = "logs";

async function writeLog(entry: Omit<VideoIndexingLog, "timestamp">): Promise<void> {
  const writable = getWritable<VideoIndexingLog>({ namespace: STREAM_NAMESPACE });
  const writer = writable.getWriter();

  try {
    await writer.write({
      ...entry,
      timestamp: new Date().toISOString(),
    });
  } finally {
    writer.releaseLock();
  }
}

export enum VideoIndexingErrors {
  VIDEO_TOO_LONG = "VIDEO_TOO_LONG",
  UNSUPPORTED_LANGUAGE = "UNSUPPORTED_LANGUAGE",
}

export async function getInfo(youtubeId: string): Promise<VideoInfo> {
  "use step";

  await writeLog({
    level: "info",
    code: VideoIndexingEventCode.FetchingMetadata,
  });

  const info = await getYouTubeVideoInfo(youtubeId);

  return {
    title: info.title,
    duration: info.duration,
    thumbnailUrl:
      info.thumbnail ||
      info.thumbnails.sort((a: { width: number }, b: { width: number }) => b.width - a.width)[0]
        ?.url,
    tags: info.tags,
    language: info.language,
    subtitlesUrl: info.automatic_captions.en
      .filter((caption: { ext: string }) => caption.ext === "vtt")
      .map((caption: { url: string }) => caption.url)[0],
  };
}

export async function checkDuration(videoInfo: VideoInfo): Promise<void> {
  "use step";

  await writeLog({
    level: "info",
    code: VideoIndexingEventCode.CheckingDuration,
  });

  if (videoInfo.duration > MAX_DURATION) {
    throw new FatalError(VideoIndexingErrors.VIDEO_TOO_LONG);
  }
}

export async function checkLanguage(videoInfo: VideoInfo): Promise<void> {
  "use step";

  await writeLog({
    level: "info",
    code: VideoIndexingEventCode.CheckingLanguage,
  });

  if (!SUPPORTED_LANGUAGES.includes(videoInfo.language)) {
    throw new FatalError(VideoIndexingErrors.UNSUPPORTED_LANGUAGE);
  }
}

export async function generateTranscript(videoInfo: VideoInfo): Promise<VideoSubtitle[]> {
  "use step";

  await writeLog({
    level: "info",
    code: VideoIndexingEventCode.GeneratingTranscript,
  });

  if (!videoInfo.subtitlesUrl) {
    throw new FatalError(VideoIndexingErrors.UNSUPPORTED_LANGUAGE);
  }

  const subtitles = await $fetch<string>(videoInfo.subtitlesUrl);
  const nodes = parseSync(subtitles);

  return nodes
    .filter((node): node is Node & { type: "cue" } => node.type === "cue")
    .map((node) => ({
      start: node.data.start,
      end: node.data.end,
      text: node.data.text.trim(),
    }));
}

// Analyze the subtitles with AI to determine the topic and difficulty level of the video.
export async function analyzeVideo(
  subtitles: VideoSubtitle[],
  metadata: {
    title: string;
    tags: string[];
  },
): Promise<VideoAnalysis> {
  "use step";

  await writeLog({
    level: "info",
    code: VideoIndexingEventCode.AnalyzingVideo,
  });

  const transcript = subtitles
    .map((subtitle) => subtitle.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);

  const { output } = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({
      schema: z.object({
        topic: z.string().min(3).max(100),
        level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
      }),
    }),
    system: "You label English learning videos with a concise topic and CEFR level.",
    prompt: `Analyze the transcript, title, and tags to return a topic and CEFR level.
Title: ${metadata.title}
Tags: ${metadata.tags.join(", ")}
Transcript: ${transcript}`,
  });

  return output;
}

export async function persistVideoIndex(params: {
  youtubeId: string;
  info: VideoInfo;
  analysis: VideoAnalysis;
  subtitles: VideoSubtitle[];
}): Promise<typeof schema.video.$inferSelect> {
  "use step";

  await writeLog({
    level: "info",
    code: VideoIndexingEventCode.PersistingVideo,
  });

  const { youtubeId, info, analysis, subtitles } = params;

  const [inserted] = await db
    .insert(schema.video)
    .values({
      title: info.title,
      youtubeId,
      duration: info.duration,
      topic: analysis.topic,
      level: analysis.level,
      thumbnailUrl: info.thumbnailUrl,
    })
    .onConflictDoNothing({
      target: schema.video.youtubeId,
    })
    .returning();

  const [existing] = inserted
    ? [inserted]
    : await db.select().from(schema.video).where(eq(schema.video.youtubeId, youtubeId));

  if (!existing) {
    throw new FatalError("VIDEO_NOT_SAVED");
  }

  if (inserted) {
    const transcriptRows = subtitles.map((subtitle, index) => ({
      videoId: existing.id,
      sentenceIndex: index,
      startTime: Math.round(subtitle.start * 1000),
      endTime: Math.round(subtitle.end * 1000),
      text: subtitle.text,
    }));

    if (transcriptRows.length > 0) {
      await db.insert(schema.videoTranscriptSentence).values(transcriptRows);
    }
  }

  await writeLog({
    level: "info",
    code: VideoIndexingEventCode.PersistedVideo,
  });

  return existing;
}

export async function logIndexing(entry: Omit<VideoIndexingLog, "timestamp">): Promise<void> {
  "use step";

  await writeLog(entry);
}

export async function clearIndexingRun(youtubeId: string): Promise<void> {
  "use step";

  await kv.del(`video-indexing:${youtubeId}`);
}

export async function finalizeIndexing(): Promise<void> {
  "use step";

  await getWritable<VideoIndexingLog>({ namespace: STREAM_NAMESPACE }).close();
}
