import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VideoIndexingLog } from "../../shared/types/video-indexing";

vi.mock("../../server/utils/youtube", () => ({
  getYouTubeVideoInfo: vi.fn(),
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

const fetchMock = vi.fn();

vi.mock("subtitle", () => ({
  parseSync: vi.fn(),
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
    vi.stubGlobal("$fetch", fetchMock);
    fetchMock.mockReset();
    mockWriter.write.mockReset();
    mockWriter.releaseLock.mockReset();
    mockWritable.close.mockReset();
    const { getWritable } = await import("workflow");
    vi.mocked(getWritable).mockClear();
    const { getYouTubeVideoInfo } = await import("../../server/utils/youtube");
    vi.mocked(getYouTubeVideoInfo).mockReset();
    const { parseSync } = await import("subtitle");
    vi.mocked(parseSync).mockReset();
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

  it("maps video info and picks best thumbnail", async () => {
    const { getYouTubeVideoInfo } = await import("../../server/utils/youtube");
    vi.mocked(getYouTubeVideoInfo).mockResolvedValue({
      title: "My Video",
      duration: 120,
      thumbnail: "",
      thumbnails: [
        { width: 100, url: "https://small" },
        { width: 300, url: "https://large" },
      ],
      tags: ["tag"],
      language: "en",
      automatic_captions: {
        en: [{ ext: "vtt", url: "https://sub" }],
      },
    });

    const info = await steps.getInfo("abc");

    expect(info).toEqual({
      title: "My Video",
      duration: 120,
      thumbnailUrl: "https://large",
      tags: ["tag"],
      language: "en",
      subtitlesUrl: "https://sub",
    });
  });

  it("flags videos longer than max duration", async () => {
    const result = await steps.validateVideoInfo({
      title: "",
      duration: 60 * 60 + 1,
      thumbnailUrl: "",
      tags: [],
      language: "en",
      subtitlesUrl: "",
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
      subtitlesUrl: "",
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

  it("returns subtitles when parsing transcript", async () => {
    fetchMock.mockResolvedValue("WEBVTT");
    const { parseSync } = await import("subtitle");
    vi.mocked(parseSync).mockReturnValue([
      { type: "cue", data: { start: 0, end: 1, text: " Hello " } },
      { type: "header", data: "WEBVTT" },
    ]);

    const result = await steps.generateTranscript({
      title: "",
      duration: 120,
      thumbnailUrl: "",
      tags: [],
      language: "en",
      subtitlesUrl: "https://sub",
    });

    expect(result).toEqual([{ start: 0, end: 1, text: "Hello" }]);
  });

  it("returns unsupported language when subtitles missing", async () => {
    const result = await steps.generateTranscript({
      title: "",
      duration: 120,
      thumbnailUrl: "",
      tags: [],
      language: "en",
      subtitlesUrl: "",
    });

    expect(result).toBe(VideoIndexingErrors.UNSUPPORTED_LANGUAGE);
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
        subtitlesUrl: "https://sub",
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
        subtitlesUrl: "https://sub",
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
          subtitlesUrl: "https://sub",
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
