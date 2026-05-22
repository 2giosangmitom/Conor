import { getWritable } from "workflow";
import {
  fetchTranscript,
  YoutubeTranscriptNotAvailableLanguageError,
} from "youtube-transcript-plus";
import type { ReadabilityApi } from "text-readability";
import natural from "natural";
import { TOPIC_CATALOG, type TopicDefinition } from "./topic-catalog";
import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";
import { VideoIndexingStepCode } from "../../../shared/types/video-indexing";
import { kv } from "@nuxthub/kv";

const { TfIdf } = natural;

interface VideoInfo {
  title: string;
  duration: number;
  thumbnailUrl: string;
  tags: string[];
  language: string;
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

const MAX_DURATION = 60 * 60;

const STREAM_NAMESPACE = "logs";

const INDEXING_KEY_PREFIX = "video-indexing:";

const MAX_TRANSCRIPT_LENGTH = 15000;
const RS_MODULE = "text-readability";
let readabilityApi: ReadabilityApi | undefined;
const MAX_TOPIC_INPUT_LENGTH = 3000;

const KEYWORD_BOOST_WEIGHT = 3.0;
const TITLE_BOOST_WEIGHT = 2.0;
const TAG_BOOST_WEIGHT = 1.5;

async function writeLog(entry: Omit<VideoIndexingLog, "timestamp">): Promise<void> {
  const log: VideoIndexingLog = { ...entry, timestamp: new Date().toISOString() };

  const writable = getWritable<VideoIndexingLog>({ namespace: STREAM_NAMESPACE });
  const writer = writable.getWriter();
  try {
    await writer.write(log);
  } finally {
    writer.releaseLock();
  }
}

export enum VideoIndexingErrors {
  VIDEO_TOO_LONG = "VIDEO_TOO_LONG",
  UNSUPPORTED_LANGUAGE = "UNSUPPORTED_LANGUAGE",
}

export async function getInfo(
  youtubeId: string,
): Promise<{ info: VideoInfo; transcript: VideoSubtitle[] }> {
  "use step";

  await writeLog({ level: "info", code: VideoIndexingStepCode.FetchDataStart });

  try {
    const result = await fetchTranscript(youtubeId, { lang: "en", videoDetails: true });

    await writeLog({ level: "info", code: VideoIndexingStepCode.FetchDataComplete });

    const thumbnails = result.videoDetails.thumbnails ?? [];
    const thumbnailUrl =
      thumbnails.length > 0
        ? thumbnails.reduce((best, t) => (t.width > best.width ? t : best)).url
        : "";

    const info: VideoInfo = {
      title: result.videoDetails.title,
      duration: result.videoDetails.lengthSeconds,
      thumbnailUrl,
      tags: result.videoDetails.keywords ?? [],
      language: result.segments[0]?.lang ?? "en",
    };

    const transcript: VideoSubtitle[] = result.segments.map((s) => ({
      start: Math.round(s.offset * 1000),
      end: Math.round((s.offset + s.duration) * 1000),
      text: s.text.trim(),
    }));

    return { info, transcript };
  } catch (error) {
    if (error instanceof YoutubeTranscriptNotAvailableLanguageError) {
      await writeLog({
        level: "error",
        code: VideoIndexingStepCode.GenerateTranscriptFailed,
        reason: "UNSUPPORTED_LANGUAGE",
      });
      throw new Error("UNSUPPORTED_LANGUAGE");
    }
    throw error;
  }
}

export type VideoValidationResult =
  | { ok: true }
  | { ok: false; code: VideoIndexingErrors; reason: string };

export async function validateVideoInfo(videoInfo: VideoInfo): Promise<VideoValidationResult> {
  "use step";

  await writeLog({ level: "info", code: VideoIndexingStepCode.CheckDurationStart });

  if (videoInfo.duration > MAX_DURATION) {
    await writeLog({
      level: "error",
      code: VideoIndexingStepCode.CheckDurationFailed,
      reason: VideoIndexingErrors.VIDEO_TOO_LONG,
    });
    return { ok: false, code: VideoIndexingErrors.VIDEO_TOO_LONG, reason: "VIDEO_TOO_LONG" };
  }

  await writeLog({ level: "info", code: VideoIndexingStepCode.CheckDurationComplete });
  await writeLog({ level: "info", code: VideoIndexingStepCode.CheckLanguageStart });

  if (!/^en(-.*)?$/i.test(videoInfo.language)) {
    await writeLog({
      level: "error",
      code: VideoIndexingStepCode.CheckLanguageFailed,
      reason: VideoIndexingErrors.UNSUPPORTED_LANGUAGE,
    });
    return {
      ok: false,
      code: VideoIndexingErrors.UNSUPPORTED_LANGUAGE,
      reason: "UNSUPPORTED_LANGUAGE",
    };
  }

  await writeLog({ level: "info", code: VideoIndexingStepCode.CheckLanguageComplete });
  return { ok: true };
}

export async function analyzeVideo(
  subtitles: VideoSubtitle[],
  metadata: { title: string; tags: string[] },
): Promise<VideoAnalysis> {
  "use step";

  await writeLog({ level: "info", code: VideoIndexingStepCode.AnalyzeVideoStart });

  const transcript = subtitles
    .map((subtitle) => subtitle.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TRANSCRIPT_LENGTH);

  const level = await getEnglishLevel(transcript);
  const topic = await labelTopic(transcript, metadata);

  await writeLog({ level: "info", code: VideoIndexingStepCode.AnalyzeVideoComplete });

  return { topic, level };
}

async function labelTopic(
  transcript: string,
  metadata: { title: string; tags: string[] },
): Promise<string> {
  const tfidf = new TfIdf();

  for (const topic of TOPIC_CATALOG) {
    const topicText = `${topic.label} ${topic.description} ${topic.keywords.join(" ")}`;
    tfidf.addDocument(topicText.toLowerCase());
  }

  const input = buildTopicInput(transcript, metadata);
  tfidf.addDocument(input.toLowerCase());

  const scores = TOPIC_CATALOG.map((topic, index) => {
    let score = 0;

    const terms = tfidf.listTerms(index);
    for (const term of terms) {
      score += term.tfidf;
    }

    const keywordMatches = calculateKeywordBoost(input, topic);
    const titleMatches = calculateTitleBoost(metadata.title, topic);
    const tagMatches = calculateTagBoost(metadata.tags, topic);

    return {
      label: topic.label,
      score: score + keywordMatches + titleMatches + tagMatches,
    };
  });

  scores.sort((a, b) => b.score - a.score);

  return scores[0]?.label ?? "Other";
}

function calculateKeywordBoost(text: string, topic: TopicDefinition): number {
  if (topic.keywords.length === 0) return 0;

  const lowerText = text.toLowerCase();
  let boost = 0;

  for (const keyword of topic.keywords) {
    const lowerKeyword = keyword.toLowerCase();
    const regex = new RegExp(`\\b${escapeRegex(lowerKeyword)}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) {
      boost += matches.length * KEYWORD_BOOST_WEIGHT;
    }
  }

  return boost;
}

function calculateTitleBoost(title: string, topic: TopicDefinition): number {
  if (topic.keywords.length === 0) return 0;

  const lowerTitle = title.toLowerCase();
  let boost = 0;

  for (const keyword of topic.keywords) {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerTitle.includes(lowerKeyword)) {
      boost += TITLE_BOOST_WEIGHT;
    }
  }

  return boost;
}

function calculateTagBoost(tags: string[], topic: TopicDefinition): number {
  if (topic.keywords.length === 0) return 0;

  let boost = 0;
  const lowerTags = tags.map((tag) => tag.toLowerCase());

  for (const tag of lowerTags) {
    for (const keyword of topic.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      if (tag.includes(lowerKeyword) || lowerKeyword.includes(tag)) {
        boost += TAG_BOOST_WEIGHT;
        break;
      }
    }
  }

  return boost;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTopicInput(transcript: string, metadata: { title: string; tags: string[] }): string {
  const title = metadata.title.trim();
  const tags = metadata.tags.filter((item) => item.trim().length > 0).join(", ");

  const parts = [title, tags, transcript].filter((value) => value.length > 0);

  return parts.join(". ").slice(0, MAX_TOPIC_INPUT_LENGTH);
}

async function getEnglishLevel(text: string): Promise<EnglishLevel> {
  if (!text) {
    return "A1";
  }

  const rs = await getReadabilityApi();

  const standard = rs.textStandard(text, true) as number | string;
  const grade = typeof standard === "number" ? standard : Number.parseFloat(standard);

  if (Number.isFinite(grade)) {
    return gradeToCefr(grade);
  }

  const readability = rs.fleschReadingEase(text);
  if (Number.isFinite(readability)) {
    return fleschToCefr(readability);
  }

  return "B1";
}

function gradeToCefr(grade: number): EnglishLevel {
  if (grade <= 2) return "A1";
  if (grade <= 4) return "A2";
  if (grade <= 6) return "B1";
  if (grade <= 8) return "B2";
  if (grade <= 10) return "C1";
  return "C2";
}

function fleschToCefr(score: number): EnglishLevel {
  if (score >= 90) return "A1";
  if (score >= 80) return "A2";
  if (score >= 70) return "B1";
  if (score >= 60) return "B2";
  if (score >= 50) return "C1";
  return "C2";
}

export async function persistVideoIndex(params: {
  youtubeId: string;
  info: VideoInfo;
  analysis: VideoAnalysis;
  subtitles: VideoSubtitle[];
}): Promise<typeof schema.video.$inferSelect> {
  "use step";

  await writeLog({ level: "info", code: VideoIndexingStepCode.PersistVideoStart });

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
    .onConflictDoNothing({ target: schema.video.youtubeId })
    .returning();

  const [existing] = inserted
    ? [inserted]
    : await db.select().from(schema.video).where(eq(schema.video.youtubeId, youtubeId));

  if (!existing) {
    throw new Error("VIDEO_NOT_SAVED");
  }

  if (inserted) {
    const transcriptRows = subtitles.map((subtitle, index) => ({
      videoId: existing.id,
      sentenceIndex: index,
      startTime: Math.round(subtitle.start),
      endTime: Math.round(subtitle.end),
      text: subtitle.text,
    }));

    if (transcriptRows.length > 0) {
      await db.insert(schema.videoTranscriptSentence).values(transcriptRows);
    }
  }

  await writeLog({ level: "info", code: VideoIndexingStepCode.PersistVideoComplete });

  return existing;
}

export async function emitLogEntry(entry: Omit<VideoIndexingLog, "timestamp">): Promise<void> {
  "use step";

  await writeLog(entry);
}

export async function closeLogStream(): Promise<void> {
  "use step";

  await getWritable<VideoIndexingLog>({ namespace: STREAM_NAMESPACE }).close();
}

export async function clearIndexingKey(youtubeId: string): Promise<void> {
  "use step";

  await kv.del(`${INDEXING_KEY_PREFIX}${youtubeId}`);
}

async function getReadabilityApi(): Promise<ReadabilityApi> {
  if (readabilityApi) {
    return readabilityApi;
  }

  const module = (await import(RS_MODULE)) as unknown as { default: ReadabilityApi };
  readabilityApi = module.default;
  return readabilityApi;
}
