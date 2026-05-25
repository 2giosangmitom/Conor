export interface VideoInfo {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  thumbnailUrl: string;
}

export interface VideoSentence {
  id: string;
  videoId: string;
  sentenceIndex: number;
  startTime: number;
  endTime: number;
  text: string;
}

export interface PlayerLike {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
}

export type AnswerStatus = "idle" | "checking" | "correct" | "incorrect";

export type SentenceAttemptStatus = "none" | "correct" | "incorrect";

export interface PracticeAttemptDraft {
  sentenceId: string;
  userText: string;
  accuracy: number;
  hintsUsed: number;
}

export interface PracticeLocalSession {
  youtubeId: string;
  currentSentenceIndex: number;
  attempts: PracticeAttemptDraft[];
  updatedAt: string;
}

export interface PracticeAttemptSummary {
  transcriptSentenceId: string;
  accuracy: number;
  hintsUsed: number;
}

export interface PracticeSessionResponse {
  practice_session: {
    id: string;
    currentSentenceIndex: number;
    completed: boolean;
    score: number;
    lastPracticedAt: string;
  };
  video: {
    youtubeId: string;
  };
  attempts: PracticeAttemptSummary[];
}

export interface PracticeSessionRecord {
  id: string;
  currentSentenceIndex: number;
  completed: boolean;
  score: number;
  lastPracticedAt: string;
}

export interface PracticeMainProps {
  youtubeId: string;
  video: VideoInfo | null;
  sentences: VideoSentence[];
  activeSentenceIndex: number;
  answerInput: string;
  answerStatus: AnswerStatus;
  hintCount: number;
  replayCount: number;
  accuracy: number;
  completedCount: number;
  totalSentences: number;
  progressValue: number;
  progressPercent: number;
  wordCount: number;
  matchedWordCount: number;
  revealedWords: number;
  errorWordIndices: number[];
  currentWordCharProgress: number;
  currentWordTypedChars: string;
  formattedTimeRange: string;
  resumeModalOpen: boolean;
  pendingResumeIndex: number;
  pendingResumeDate: string | null;
  sentenceAttempts: SentenceAttemptStatus[];
  revealedWordIndices: number[];
}

export interface PracticeMainEmits {
  (e: "update:answerInput", value: string): void;
  (e: "update:resumeModalOpen", value: boolean): void;
  (
    e:
      | "checkAnswer"
      | "nextSentence"
      | "prevSentence"
      | "replaySentence"
      | "skip"
      | "resumeSession"
      | "startNewSession"
      | "playerReady",
  ): void;
  (e: "hint" | "moveToSentence", index: number): void;
  (e: "playerStateChange", event: { data: number }): void;
}

export interface LoaderStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "failed";
}

export interface PracticeLoaderProps {
  youtubeId: string;
  steps: LoaderStep[];
  runId: string | null;
  isIndexing: boolean;
  isFailed: boolean;
  connectionIssue: string | null;
  errorReason: string | null;
  currentStepLabel: string;
}

export interface PracticeLoaderEmits {
  (e: "retry"): void;
}
