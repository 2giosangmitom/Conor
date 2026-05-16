import { getYouTubeVideoInfo } from "../../utils/youtube";
import { FatalError, getWritable } from "workflow";
import { parseSync, type Node } from "subtitle";
import type { ReadabilityApi } from "text-readability";
import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";
import { TOPIC_CATALOG, type TopicDefinition } from "./topic-catalog";
import { db, schema } from "@nuxthub/db";
import { eq } from "drizzle-orm";
import { kv } from "@nuxthub/kv";
import {
  VideoIndexingEventCode,
  type VideoIndexingLog,
} from "../../../shared/types/video-indexing";

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

const MAX_TRANSCRIPT_LENGTH = 15000;
const RS_MODULE = "text-readability";
let readabilityApi: ReadabilityApi | undefined;
const MAX_TOPIC_INPUT_LENGTH = 3000;
const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";

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
    .slice(0, MAX_TRANSCRIPT_LENGTH);

  const level = await getEnglishLevel(transcript);
  const topic = await labelTopic(transcript, metadata);

  return {
    topic,
    level,
  };
}

async function labelTopic(
  transcript: string,
  metadata: { title: string; tags: string[] },
): Promise<string> {
  const input = buildTopicInput(transcript, metadata);
  const [catalogEmbeddings, inputEmbedding] = await Promise.all([
    getTopicCatalogEmbeddings(),
    embedText(input),
  ]);

  if (!inputEmbedding) {
    return "Khác";
  }

  let bestIndex = 0;
  let bestScore = -1;

  for (let index = 0; index < catalogEmbeddings.length; index += 1) {
    const embedding = catalogEmbeddings[index];
    if (!embedding) {
      continue;
    }

    const score = cosineSimilarity(inputEmbedding, embedding);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  return TOPIC_CATALOG[bestIndex]?.label ?? "Khác";
}

function buildTopicInput(transcript: string, metadata: { title: string; tags: string[] }): string {
  const title = metadata.title.trim();
  const tags = metadata.tags.filter((item) => item.trim().length > 0).join(", ");

  const parts = [title, tags, transcript].filter((value) => value.length > 0);

  return parts.join(". ").slice(0, MAX_TOPIC_INPUT_LENGTH);
}

let embeddingPipeline: FeatureExtractionPipeline | undefined;
let topicCatalogEmbeddings: Array<number[] | null> | undefined;

async function getEmbeddingPipeline(): Promise<FeatureExtractionPipeline> {
  if (embeddingPipeline) {
    return embeddingPipeline;
  }

  const instance = await pipeline("feature-extraction", MODEL_NAME, {
    dtype: "q8",
  });

  if (typeof instance !== "function") {
    throw new Error("Embedding pipeline initialization failed");
  }

  embeddingPipeline = instance as FeatureExtractionPipeline;
  return embeddingPipeline;
}

async function embedText(text: string): Promise<number[] | null> {
  const extractor = await getEmbeddingPipeline();
  const output = (await extractor(text, {
    pooling: "mean",
  })) as unknown;

  return extractEmbedding(output);
}

function extractEmbedding(output: unknown): number[] | null {
  let raw: number[] | null = null;

  if (
    output &&
    typeof output === "object" &&
    "tolist" in output &&
    typeof (output as { tolist: unknown }).tolist === "function"
  ) {
    const list = (output as { tolist(): unknown[][] }).tolist();
    if (Array.isArray(list) && list.length > 0 && Array.isArray(list[0])) {
      raw = list[0] as unknown as number[];
    }
  }

  if (!raw || raw.length === 0) {
    return null;
  }

  return normalizeVector(raw);
}

function normalizeVector(vec: number[]): number[] {
  let magnitude = 0;
  for (const v of vec) {
    magnitude += v * v;
  }
  magnitude = Math.sqrt(magnitude);
  if (magnitude === 0) return vec;
  return vec.map((v) => v / magnitude);
}

async function getTopicCatalogEmbeddings(): Promise<Array<number[] | null>> {
  if (!topicCatalogEmbeddings) {
    const entries = buildTopicEntries(TOPIC_CATALOG);
    const embeddings = await Promise.all(entries.map((topic) => embedText(topic)));
    topicCatalogEmbeddings = embeddings;
  }

  return topicCatalogEmbeddings;
}

function buildTopicEntries(catalog: TopicDefinition[]): string[] {
  return catalog.map((topic) => `${topic.label}. ${topic.description}`.trim());
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    sum += (a[i] ?? 0) * (b[i] ?? 0);
  }

  return sum;
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
async function getReadabilityApi(): Promise<ReadabilityApi> {
  if (readabilityApi) {
    return readabilityApi;
  }

  const module = (await import(RS_MODULE)) as unknown as { default: ReadabilityApi };
  readabilityApi = module.default;
  return readabilityApi;
}
