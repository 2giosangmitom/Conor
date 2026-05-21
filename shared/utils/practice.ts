export function formatMs(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:]/g, "");
}

export function splitWords(text: string): string[] {
  if (!text) return [];
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .split(" ")
    .filter((word) => word.length > 0);
}

export function calculateAccuracy(expected: string, actual: string): number {
  if (!expected) return 0;
  const expectedWords = splitWords(expected);
  const actualWords = splitWords(actual);
  if (expectedWords.length === 0) return 0;
  let matchCount = 0;

  for (let i = 0; i < expectedWords.length; i += 1) {
    if (actualWords[i] === expectedWords[i]) {
      matchCount += 1;
    }
  }

  return Math.round((matchCount / expectedWords.length) * 100);
}
