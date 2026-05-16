import { getYouTubeVideoInfo } from "../../utils/youtube";
import { FatalError } from "workflow";
import { parseSync, type Node } from "subtitle";
import { generateText, Output } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";

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

export enum VideoIndexingErrors {
  VIDEO_TOO_LONG = "VIDEO_TOO_LONG",
  UNSUPPORTED_LANGUAGE = "UNSUPPORTED_LANGUAGE",
}

export async function getInfo(youtubeId: string): Promise<VideoInfo> {
  "use step";

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

  if (videoInfo.duration > MAX_DURATION) {
    throw new FatalError(VideoIndexingErrors.VIDEO_TOO_LONG);
  }
}

export async function checkLanguage(videoInfo: VideoInfo): Promise<void> {
  "use step";

  if (!SUPPORTED_LANGUAGES.includes(videoInfo.language)) {
    throw new FatalError(VideoIndexingErrors.UNSUPPORTED_LANGUAGE);
  }
}

export async function generateTranscript(videoInfo: VideoInfo): Promise<VideoSubtitle[]> {
  "use step";

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

  const transcript = subtitles
    .map((subtitle) => subtitle.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);

  const { output } = await generateText({
    model: google("gemini-3.1-pro-preview"),
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
