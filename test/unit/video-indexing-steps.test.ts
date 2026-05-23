import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VideoIndexingLog } from "../../shared/types/video-indexing";
import { TOPIC_CATALOG } from "../../server/workflows/video-indexing/topic-catalog";

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

  describe("topic label algorithm", () => {
    const programmingTopic = TOPIC_CATALOG.find((t) => t.label === "Programming")!;
    const aiTopic = TOPIC_CATALOG.find((t) => t.label === "Artificial Intelligence")!;
    const artTopic = TOPIC_CATALOG.find((t) => t.label === "Art")!;

    describe("escapeRegex", () => {
      it("escapes regex special characters", () => {
        expect(steps.escapeRegex("hello.world")).toBe("hello\\.world");
        expect(steps.escapeRegex("test (1)")).toBe("test \\(1\\)");
        expect(steps.escapeRegex("a+b*c")).toBe("a\\+b\\*c");
        expect(steps.escapeRegex("normal")).toBe("normal");
      });
    });

    describe("buildTopicInput", () => {
      it("combines title, tags, and transcript", () => {
        const result = steps.buildTopicInput("This is the transcript content", {
          title: "Video Title",
          tags: ["tag1", "tag2"],
        });
        expect(result).toContain("Video Title");
        expect(result).toContain("tag1, tag2");
        expect(result).toContain("This is the transcript content");
      });

      it("handles empty tags gracefully", () => {
        const result = steps.buildTopicInput("Just transcript", { title: "Title", tags: [] });
        expect(result).not.toContain(", ");
        expect(result).toBe("Title. Just transcript");
      });

      it("filters empty tag strings", () => {
        const result = steps.buildTopicInput("transcript", {
          title: "Title",
          tags: ["", "valid", "  "],
        });
        expect(result).toContain("valid");
        expect(result).not.toContain(", ,");
      });

      it("truncates to MAX_TOPIC_INPUT_LENGTH", () => {
        const longTranscript = "word ".repeat(3000);
        const result = steps.buildTopicInput(longTranscript, { title: "Title", tags: ["tag"] });
        expect(result.length).toBeLessThanOrEqual(3000);
      });
    });

    describe("calculateKeywordBoost", () => {
      it("returns boost for matching keywords in text", () => {
        const text = "I love programming and writing code every day";
        const boost = steps.calculateKeywordBoost(text, programmingTopic);
        expect(boost).toBeGreaterThan(0);
      });

      it("returns 0 when no keywords match", () => {
        const text = "I like cooking and baking delicious food";
        const boost = steps.calculateKeywordBoost(text, programmingTopic);
        expect(boost).toBe(0);
      });

      it("returns 0 for topics with no keywords", () => {
        const otherTopic = TOPIC_CATALOG.find((t) => t.label === "Other")!;
        const boost = steps.calculateKeywordBoost("any text", otherTopic);
        expect(boost).toBe(0);
      });

      it("does not match partial words", () => {
        const text = "I love artificial flowers";
        const boost = steps.calculateKeywordBoost(text, artTopic);
        // "art" should NOT match inside "artificial" due to word boundary
        expect(boost).toBe(0);
      });

      it("matches multiple occurrences of the same keyword", () => {
        const text = "code review is important, clean code is better";
        const boost = steps.calculateKeywordBoost(text, programmingTopic);
        // "code" appears twice → 2 * 3.0 = 6.0
        expect(boost).toBeCloseTo(6.0);
      });
    });

    describe("calculateTitleBoost", () => {
      it("returns boost when title contains a keyword", () => {
        const boost = steps.calculateTitleBoost("Programming for Beginners", programmingTopic);
        expect(boost).toBeGreaterThan(0);
      });

      it("returns 0 when title contains no keywords", () => {
        const boost = steps.calculateTitleBoost("Random Title with No Match", programmingTopic);
        expect(boost).toBe(0);
      });

      it("does NOT match substrings across word boundaries", () => {
        const boost = steps.calculateTitleBoost("Artificial Intelligence Explained", artTopic);
        // "art" should NOT match in "Artificial" with word boundary regex
        expect(boost).toBe(0);
      });

      it("matches multi-word keywords correctly", () => {
        const boost = steps.calculateTitleBoost("Introduction to Machine Learning", aiTopic);
        // "machine learning" is a keyword in AI topic
        expect(boost).toBeGreaterThan(0);
      });

      it("does not match keywords split across words", () => {
        const boost = steps.calculateTitleBoost("Machine The Learning", aiTopic);
        // "machine learning" should NOT match "Machine\nThe\nLearning"
        expect(boost).toBe(0);
      });
    });

    describe("calculateTagBoost", () => {
      it("returns boost when tag matches a keyword exactly", () => {
        const boost = steps.calculateTagBoost(["programming", "tutorial"], programmingTopic);
        expect(boost).toBeGreaterThan(0);
      });

      it("returns 0 when no tags match any keyword", () => {
        const boost = steps.calculateTagBoost(["cooking", "recipe"], programmingTopic);
        expect(boost).toBe(0);
      });

      it("does NOT match substring tags to keywords (regression)", () => {
        // Tag "ai" should NOT match keyword "artificial" via substring
        const boost = steps.calculateTagBoost(["ai"], artTopic);
        expect(boost).toBe(0);
      });

      it("does NOT match tags that are substrings of keywords (regression)", () => {
        // Tag "art" should NOT match keyword "artificial" via substring
        const boost = steps.calculateTagBoost(["art"], aiTopic);
        expect(boost).toBe(0);
      });

      it("matches multi-word tag to keyword", () => {
        const boost = steps.calculateTagBoost(["machine learning"], aiTopic);
        // "machine learning" keyword matches "machine learning" tag
        expect(boost).toBeGreaterThan(0);
      });

      it("matches tag that is a word within a multi-word keyword", () => {
        // Tag "machine" should match keyword "machine learning" (tag is a word in keyword)
        const boost = steps.calculateTagBoost(["machine"], aiTopic);
        expect(boost).toBeGreaterThan(0);
      });

      it("matches keyword that is a word within a multi-word tag", () => {
        // Keyword "learning" should match tag "deep learning"
        const boost = steps.calculateTagBoost(["deep learning"], aiTopic);
        expect(boost).toBeGreaterThan(0);
      });

      it("handles empty tags array", () => {
        const boost = steps.calculateTagBoost([], programmingTopic);
        expect(boost).toBe(0);
      });

      it("matches a tag that is a single word within a multi-word keyword", () => {
        // Tag "analytics" matches keyword "data analytics" (tag is a word within keyword)
        const dsTopic = TOPIC_CATALOG.find((t) => t.label === "Data Science")!;
        const boost = steps.calculateTagBoost(["analytics"], dsTopic);
        expect(boost).toBeGreaterThan(0);
      });
    });

    describe("analyzeVideo integration", () => {
      it("classifies programming content as Programming", async () => {
        const result = await steps.analyzeVideo(
          [
            { start: 0, end: 1, text: "This tutorial covers programming and coding." },
            { start: 1, end: 2, text: "We build an API using a popular framework." },
          ],
          { title: "Learn Programming Basics", tags: ["programming", "code", "api"] },
        );

        expect(result.topic).toBe("Programming");
      });

      it("classifies AI content as Artificial Intelligence", async () => {
        const result = await steps.analyzeVideo(
          [
            { start: 0, end: 1, text: "This video explains how neural networks work." },
            { start: 1, end: 2, text: "Machine learning and deep learning concepts." },
            { start: 2, end: 3, text: "We discuss large language models and AI applications." },
          ],
          {
            title: "Introduction to AI and Machine Learning",
            tags: ["ai", "machine learning", "deep learning"],
          },
        );

        expect(result.topic).toBe("Artificial Intelligence");
      });

      it("classifies investing content as Investing", async () => {
        const result = await steps.analyzeVideo(
          [
            { start: 0, end: 1, text: "How to build a stock portfolio." },
            { start: 1, end: 2, text: "We discuss dividend investing and risk management." },
          ],
          {
            title: "Stock Market Investing for Beginners",
            tags: ["stocks", "dividend", "portfolio"],
          },
        );

        expect(result.topic).toBe("Investing");
      });

      it("returns Other for content with no matching topic", async () => {
        const result = await steps.analyzeVideo(
          [
            { start: 0, end: 1, text: "asdf zxcv qwer tyui" },
            { start: 1, end: 2, text: "lkjh mnbv poiu ytre" },
          ],
          { title: "Random gibberish", tags: [] },
        );

        expect(result.topic).toBe("Other");
      });

      it("does not misclassify based on substring tag matching (regression)", async () => {
        // Old bug: tag "ai" matched keyword "artificial" in AI via substring includes()
        // Old bug: tag "art" matched keyword "artificial" in AI via substring includes()
        // With word-boundary matching, these false positives no longer occur.
        // Here we test that tags containing "ai"/"art" as substrings don't boost AI.
        const result = await steps.analyzeVideo(
          [
            { start: 0, end: 1, text: "Learn to paint with watercolors on canvas." },
            { start: 1, end: 2, text: "This portrait tutorial covers drawing techniques." },
          ],
          { title: "Watercolor Art for Beginners", tags: ["portrait", "canvas", "drawing"] },
        );

        expect(result.topic).toBe("Art");
      });
    });
  });
});
