import { describe, it, expect } from "vitest";
import {
  formatMs,
  normalizeText,
  splitWords,
  calculateAccuracy,
} from "../../shared/utils/practice";

describe("formatMs", () => {
  it("formats zero milliseconds correctly", () => {
    expect(formatMs(0)).toBe("0:00");
  });

  it("formats seconds correctly", () => {
    expect(formatMs(5000)).toBe("0:05");
    expect(formatMs(45000)).toBe("0:45");
    expect(formatMs(59999)).toBe("0:59");
  });

  it("formats minutes correctly", () => {
    expect(formatMs(60000)).toBe("1:00");
    expect(formatMs(120000)).toBe("2:00");
    expect(formatMs(365000)).toBe("6:05");
  });

  it("pads seconds with leading zero", () => {
    expect(formatMs(61000)).toBe("1:01");
    expect(formatMs(180500)).toBe("3:00");
  });

  it("handles large values", () => {
    expect(formatMs(3661000)).toBe("61:01");
  });
});

describe("normalizeText", () => {
  it("trims whitespace", () => {
    expect(normalizeText("  hello  ")).toBe("hello");
  });

  it("converts to lowercase", () => {
    expect(normalizeText("HELLO World")).toBe("hello world");
  });

  it("collapses multiple spaces", () => {
    expect(normalizeText("hello   world")).toBe("hello world");
  });

  it("removes punctuation", () => {
    expect(normalizeText("Hello, world!")).toBe("hello world");
    expect(normalizeText("What? Really: yes; ok!")).toBe("what really yes ok");
  });

  it("handles empty string", () => {
    expect(normalizeText("")).toBe("");
  });

  it("handles string with only punctuation", () => {
    expect(normalizeText("...,,,!!!")).toBe("");
  });
});

describe("splitWords", () => {
  it("splits text into lowercase words", () => {
    expect(splitWords("Hello World")).toEqual(["hello", "world"]);
  });

  it("removes punctuation from words", () => {
    expect(splitWords("Hello, world!")).toEqual(["hello", "world"]);
  });

  it("filters empty strings", () => {
    expect(splitWords("  ")).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(splitWords("")).toEqual([]);
  });

  it("handles multiple spaces between words", () => {
    expect(splitWords("hello   world")).toEqual(["hello", "world"]);
  });

  it("handles single word", () => {
    expect(splitWords("hello")).toEqual(["hello"]);
  });
});

describe("calculateAccuracy", () => {
  it("returns 100 for exact match", () => {
    expect(calculateAccuracy("hello world", "hello world")).toBe(100);
  });

  it("returns 0 for completely wrong answer", () => {
    expect(calculateAccuracy("hello world", "foo bar")).toBe(0);
  });

  it("calculates partial accuracy", () => {
    expect(calculateAccuracy("hello world foo", "hello world bar")).toBe(67);
  });

  it("returns 0 for empty expected", () => {
    expect(calculateAccuracy("", "hello")).toBe(0);
  });

  it("handles shorter actual than expected", () => {
    expect(calculateAccuracy("hello world foo", "hello")).toBe(33);
  });

  it("handles longer actual than expected", () => {
    expect(calculateAccuracy("hello", "hello world extra")).toBe(100);
  });

  it("is case insensitive after normalization", () => {
    expect(calculateAccuracy("Hello World", "hello world")).toBe(100);
  });

  it("handles punctuation differences", () => {
    expect(calculateAccuracy("hello, world!", "hello world")).toBe(100);
  });

  it("calculates accuracy with wrong word in middle", () => {
    expect(calculateAccuracy("tôi đi học hôm nay", "tôi đi chơi hôm nay")).toBe(80);
  });

  it("handles completely different words", () => {
    expect(calculateAccuracy("một hai ba", "x y z")).toBe(0);
  });

  it("returns 0 for empty actual", () => {
    expect(calculateAccuracy("hello world", "")).toBe(0);
  });
});
