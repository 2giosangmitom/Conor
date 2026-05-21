import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../server/workflows/video-indexing/steps", () => ({
  getInfo: vi.fn(),
  validateVideoInfo: vi.fn(),
  generateTranscript: vi.fn(),
  analyzeVideo: vi.fn(),
  persistVideoIndex: vi.fn(),
  closeLogStream: vi.fn(),
  emitLogEntry: vi.fn(),
  clearIndexingKey: vi.fn(),
}));

const steps = await import("../../server/workflows/video-indexing/steps");
const { handleIndexVideo } = await import("../../server/workflows/video-indexing/index");

const getInfo = steps.getInfo as unknown as ReturnType<typeof vi.fn>;
const validateVideoInfo = steps.validateVideoInfo as unknown as ReturnType<typeof vi.fn>;
const generateTranscript = steps.generateTranscript as unknown as ReturnType<typeof vi.fn>;
const analyzeVideo = steps.analyzeVideo as unknown as ReturnType<typeof vi.fn>;
const persistVideoIndex = steps.persistVideoIndex as unknown as ReturnType<typeof vi.fn>;
const closeLogStream = steps.closeLogStream as unknown as ReturnType<typeof vi.fn>;
const emitLogEntry = steps.emitLogEntry as unknown as ReturnType<typeof vi.fn>;
const clearIndexingKey = steps.clearIndexingKey as unknown as ReturnType<typeof vi.fn>;

describe("video indexing workflow", () => {
  beforeEach(() => {
    getInfo.mockReset();
    validateVideoInfo.mockReset();
    generateTranscript.mockReset();
    analyzeVideo.mockReset();
    persistVideoIndex.mockReset();
    closeLogStream.mockReset();
    emitLogEntry.mockReset();
    clearIndexingKey.mockReset();
  });

  it("indexes a video successfully", async () => {
    const videoInfo = {
      title: "Sample",
      duration: 120,
      thumbnailUrl: "https://img",
      tags: ["tag"],
      language: "en",
      subtitlesUrl: "https://sub",
    };
    const subtitles = [{ start: 0, end: 1, text: "Hello" }];
    const analysis = { topic: "General", level: "A2" };
    const persisted = { id: "1", youtubeId: "abc" };

    getInfo.mockResolvedValue(videoInfo);
    validateVideoInfo.mockResolvedValue({ ok: true });
    generateTranscript.mockResolvedValue(subtitles);
    analyzeVideo.mockResolvedValue(analysis);
    persistVideoIndex.mockResolvedValue(persisted);

    const result = await handleIndexVideo("abc");

    expect(result).toEqual(persisted);
    expect(emitLogEntry).toHaveBeenCalledWith(expect.objectContaining({ code: "INDEX_START" }));
    expect(getInfo).toHaveBeenCalledWith("abc");
    expect(validateVideoInfo).toHaveBeenCalledWith(videoInfo);
    expect(generateTranscript).toHaveBeenCalledWith(videoInfo);
    expect(analyzeVideo).toHaveBeenCalledWith(subtitles, {
      title: videoInfo.title,
      tags: videoInfo.tags,
    });
    expect(persistVideoIndex).toHaveBeenCalledWith({
      youtubeId: "abc",
      info: videoInfo,
      analysis,
      subtitles,
    });
    expect(emitLogEntry).toHaveBeenCalledWith(expect.objectContaining({ code: "INDEX_COMPLETE" }));
    expect(closeLogStream).toHaveBeenCalledTimes(1);
  });

  it("aborts when duration check fails", async () => {
    const videoInfo = {
      title: "Long",
      duration: 9999,
      thumbnailUrl: "https://img",
      tags: [],
      language: "en",
      subtitlesUrl: "https://sub",
    };

    getInfo.mockResolvedValue(videoInfo);
    validateVideoInfo.mockResolvedValue({
      ok: false,
      code: "VIDEO_TOO_LONG",
      reason: "VIDEO_TOO_LONG",
    });

    const result = await handleIndexVideo("abc");

    expect(result).toBeNull();
    expect(emitLogEntry).toHaveBeenCalledWith(
      expect.objectContaining({ code: "INDEX_FAILED", reason: "VIDEO_TOO_LONG" }),
    );
    expect(closeLogStream).toHaveBeenCalledTimes(1);
  });

  it("aborts when transcript generation fails", async () => {
    const videoInfo = {
      title: "Missing subtitles",
      duration: 30,
      thumbnailUrl: "https://img",
      tags: [],
      language: "en",
      subtitlesUrl: "",
    };

    getInfo.mockResolvedValue(videoInfo);
    validateVideoInfo.mockResolvedValue({ ok: true });
    generateTranscript.mockResolvedValue("UNSUPPORTED_LANGUAGE");

    const result = await handleIndexVideo("abc");

    expect(result).toBeNull();
    expect(analyzeVideo).not.toHaveBeenCalled();
    expect(persistVideoIndex).not.toHaveBeenCalled();
    expect(emitLogEntry).toHaveBeenCalledWith(
      expect.objectContaining({ code: "INDEX_FAILED", reason: "UNSUPPORTED_LANGUAGE" }),
    );
    expect(closeLogStream).toHaveBeenCalledTimes(1);
  });

  it("logs failure and rethrows on unexpected errors", async () => {
    const videoInfo = {
      title: "Sample",
      duration: 120,
      thumbnailUrl: "https://img",
      tags: ["tag"],
      language: "en",
      subtitlesUrl: "https://sub",
    };
    const subtitles = [{ start: 0, end: 1, text: "Hello" }];

    getInfo.mockResolvedValue(videoInfo);
    validateVideoInfo.mockResolvedValue({ ok: true });
    generateTranscript.mockResolvedValue(subtitles);
    analyzeVideo.mockResolvedValue({ topic: "General", level: "A2" });
    persistVideoIndex.mockRejectedValue(new Error("DB_FAIL"));

    await expect(handleIndexVideo("abc")).rejects.toThrow("DB_FAIL");

    expect(emitLogEntry).toHaveBeenCalledWith(
      expect.objectContaining({ code: "INDEX_FAILED", reason: "DB_FAIL" }),
    );
    expect(closeLogStream).toHaveBeenCalledTimes(1);
  });
});
