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
  const expectedWords = expected.split(" ");
  const actualWords = actual.split(" ");
  let matchCount = 0;

  expectedWords.forEach((word, index) => {
    if (actualWords[index] === word) {
      matchCount += 1;
    }
  });

  return Math.round((matchCount / expectedWords.length) * 100);
}
