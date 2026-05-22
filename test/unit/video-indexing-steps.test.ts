import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VideoIndexingLog } from "../../shared/types/video-indexing";

vi.mock("youtube-transcript-plus", () => ({
  fetchTranscript: vi.fn(),
  YoutubeTranscriptNotAvailableLanguageError: class extends Error {
    readonly videoId: string;
    readonly lang: string;
    readonly availableLangs: string[];
    constructor(lang: string, availableLangs: string[], videoId: string) {
      super(`Transcript not available in ${lang}`);
      this.name = "YoutubeTranscriptNotAvailableLanguageError";
      this.videoId = videoId;
      this.lang = lang;
      this.availableLangs = availableLangs;
    }
  },
}));

const mockWriter = {
  write: vi.fn(),
  releaseLock: vi.fn(),
};
const mockWritable = {
  getWriter: () => mockWriter,
  close: vi.fn(),
};

vi.mock("workflow", () => ({
  getWritable: vi.fn(() => mockWritable),
}));

let readabilityModule: { default: { textStandard: () => number; fleschReadingEase: () => number } };

vi.mock("text-readability", () => readabilityModule);

const steps = await import("../../server/workflows/video-indexing/steps");
const { VideoIndexingStepCode } = await import("../../shared/types/video-indexing");
const { VideoIndexingErrors } = steps;

const dbInsert = {
  values: vi.fn().mockReturnThis(),
  onConflictDoNothing: vi.fn().mockReturnThis(),
  returning: vi.fn(),
};
const dbSelect = vi.fn();
const dbInsertTranscript = vi.fn();

vi.mock("@nuxthub/db", () => {
  const videoTable = { youtubeId: "youtubeId", $inferSelect: {} };
  const transcriptTable = { tableName: "videoTranscriptSentence" };
  return {
    db: {
      insert: vi.fn((target) => {
        if (target === transcriptTable) return { values: dbInsertTranscript };
        if (target === videoTable) return dbInsert;
        return dbInsert;
      }),
      select: () => ({ from: () => ({ where: dbSelect }) }),
    },
    schema: {
      video: videoTable,
      videoTranscriptSentence: transcriptTable,
    },
  };
});

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
}));

describe("video indexing steps", () => {
  beforeEach(async () => {
    mockWriter.write.mockReset();
    mockWriter.releaseLock.mockReset();
    mockWritable.close.mockReset();
    const { getWritable } = await import("workflow");
    vi.mocked(getWritable).mockClear();
    const { fetchTranscript } = await import("youtube-transcript-plus");
    vi.mocked(fetchTranscript).mockReset();
    dbInsert.values.mockClear();
    dbInsert.onConflictDoNothing.mockClear();
    dbInsert.returning.mockReset();
    dbSelect.mockReset();
    dbInsertTranscript.mockReset();
    readabilityModule = {
      default: {
        textStandard: () => 4,
        fleschReadingEase: () => 80,
      },
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps video info and returns transcript from fetchTranscript", async () => {
    const { fetchTranscript } = await import("youtube-transcript-plus");
    vi.mocked(fetchTranscript).mockResolvedValue({
      videoDetails: {
        videoId: "abc",
        title: "My Video",
        author: "Author",
        channelId: "UC123",
        lengthSeconds: 120,
        viewCount: 1000,
        description: "",
        keywords: ["tag"],
        thumbnails: [
          { url: "https://small", width: 100, height: 60 },
          { url: "https://large", width: 300, height: 180 },
        ],
        isLiveContent: false,
      },
      segments: [
        { text: "Hello world", offset: 0, duration: 1.5, lang: "en" },
        { text: "How are you", offset: 1.5, duration: 2.0, lang: "en" },
      ],
    });

    const result = await steps.getInfo("abc");

    expect(result.info).toEqual({
      title: "My Video",
      duration: 120,
      thumbnailUrl: "https://large",
      tags: ["tag"],
      language: "en",
    });
    expect(result.transcript).toEqual([
      { start: 0, end: 1500, text: "Hello world" },
      { start: 1500, end: 3500, text: "How are you" },
    ]);
  });

  it("flags videos longer than max duration", async () => {
    const result = await steps.validateVideoInfo({
      title: "",
      duration: 60 * 60 + 1,
      thumbnailUrl: "",
      tags: [],
      language: "en",
    });

    expect(result).toEqual({
      ok: false,
      code: VideoIndexingErrors.VIDEO_TOO_LONG,
      reason: "VIDEO_TOO_LONG",
    });
    expect(mockWriter.write).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "error",
        code: VideoIndexingStepCode.CheckDurationFailed,
        reason: VideoIndexingErrors.VIDEO_TOO_LONG,
      }) as VideoIndexingLog,
    );
  });

  it("flags non-English videos", async () => {
    const result = await steps.validateVideoInfo({
      title: "",
      duration: 120,
      thumbnailUrl: "",
      tags: [],
      language: "fr",
    });

    expect(result).toEqual({
      ok: false,
      code: VideoIndexingErrors.UNSUPPORTED_LANGUAGE,
      reason: "UNSUPPORTED_LANGUAGE",
    });
    expect(mockWriter.write).toHaveBeenCalledWith(
      expect.objectContaining({
        level: "error",
        code: VideoIndexingStepCode.CheckLanguageFailed,
        reason: VideoIndexingErrors.UNSUPPORTED_LANGUAGE,
      }) as VideoIndexingLog,
    );
  });

  it("classifies topic and level", async () => {
    const result = await steps.analyzeVideo(
      [
        { start: 0, end: 1, text: "This tutorial covers programming and code." },
        { start: 1, end: 2, text: "We build an API with a framework." },
      ],
      { title: "Programming basics", tags: ["code", "api"] },
    );

    expect(result).toMatchObject({
      topic: expect.any(String),
      level: expect.any(String),
    });
  });

  it("persists new video and transcript sentences", async () => {
    dbInsert.returning.mockResolvedValue([{ id: "1", youtubeId: "abc" }]);

    const result = await steps.persistVideoIndex({
      youtubeId: "abc",
      info: {
        title: "Title",
        duration: 120,
        thumbnailUrl: "https://img",
        tags: [],
        language: "en",
      },
      analysis: { topic: "Programming", level: "B1" },
      subtitles: [{ start: 0, end: 1000, text: "Hello" }],
    });

    expect(result).toEqual({ id: "1", youtubeId: "abc" });
    expect(dbInsertTranscript).toHaveBeenCalledWith([
      {
        videoId: "1",
        sentenceIndex: 0,
        startTime: 0,
        endTime: 1000,
        text: "Hello",
      },
    ]);
  });

  it("returns existing video when already indexed", async () => {
    dbInsert.returning.mockResolvedValue([]);
    dbSelect.mockResolvedValue([{ id: "1", youtubeId: "abc" }]);

    const result = await steps.persistVideoIndex({
      youtubeId: "abc",
      info: {
        title: "Title",
        duration: 120,
        thumbnailUrl: "https://img",
        tags: [],
        language: "en",
      },
      analysis: { topic: "Programming", level: "B1" },
      subtitles: [{ start: 0, end: 1, text: "Hello" }],
    });

    expect(result).toEqual({ id: "1", youtubeId: "abc" });
    expect(dbInsertTranscript).not.toHaveBeenCalled();
  });

  it("throws when video not saved", async () => {
    dbInsert.returning.mockResolvedValue([]);
    dbSelect.mockResolvedValue([]);

    await expect(
      steps.persistVideoIndex({
        youtubeId: "abc",
        info: {
          title: "Title",
          duration: 120,
          thumbnailUrl: "https://img",
          tags: [],
          language: "en",
        },
        analysis: { topic: "Programming", level: "B1" },
        subtitles: [{ start: 0, end: 1000, text: "Hello" }],
      }),
    ).rejects.toThrow("VIDEO_NOT_SAVED");
  });

  it("closes the workflow stream", async () => {
    await steps.closeLogStream();

    expect(mockWritable.close).toHaveBeenCalledTimes(1);
  });
});
