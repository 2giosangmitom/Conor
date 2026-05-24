<script setup lang="ts">
import { VideoIndexingStepCode, type VideoIndexingLog } from "~~/shared/types/video-indexing";
import { useSession } from "~/utils/auth";
import type {
  VideoInfo,
  VideoSentence,
  PracticeAttemptDraft,
  PracticeLocalSession,
  PracticeSessionResponse,
  PracticeSessionRecord,
  LoaderStep,
  AnswerStatus,
  SentenceAttemptStatus,
} from "~/types/practice";
import { formatMs, normalizeText, splitWords, calculateAccuracy } from "~~/shared/utils/practice";

definePageMeta({
  layout: "practice",
});

const route = useRoute();
const { data: session } = await useSession(useFetch);
const { origin } = useRequestURL();

const videoTitle = computed(() => video.value?.title ?? "Luyện nghe chép chính tả tiếng Anh");
const pageTitle = computed(() => `Luyện nghe chép chính tả: ${videoTitle.value}`);
const pageDescription = computed(() =>
  video.value
    ? `Luyện nghe chép chính tả tiếng Anh với "${video.value.title}". Nghe từng câu, gõ lại chính xác và nhận phản hồi tức thì từ video YouTube.`
    : "Luyện nghe chép chính tả tiếng Anh với video YouTube yêu thích. Nghe từng câu và gõ lại chính xác những gì bạn nghe được.",
);

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogType: "article",
  ogTitle: computed(() => `${pageTitle.value} - NgheGo`),
  ogDescription: pageDescription,
  ogUrl: computed(() => `${origin}/practice/${youtubeId.value}`),
  ogImage: `${origin}/images/logo.svg`,
  twitterCard: "summary_large_image",
  twitterTitle: computed(() => `${pageTitle.value} - NgheGo`),
  twitterDescription: pageDescription,
  twitterImage: `${origin}/images/logo.svg`,
});

const youtubeId = computed(() => String(route.params.youtube_id ?? ""));
const isSignedIn = computed(() => Boolean(session.value?.user));

const runId = ref<string | null>(null);
const isIndexing = ref(false);
const isReady = ref(false);
const isFailed = ref(false);
const errorReason = ref<string | null>(null);
const connectionIssue = ref<string | null>(null);
const lastLog = ref<VideoIndexingLog | null>(null);
const hasTerminalFailure = ref(false);

const video = shallowRef<VideoInfo | null>(null);
const sentences = shallowRef<VideoSentence[]>([]);

const stepTemplate: LoaderStep[] = [
  { id: "fetchData", label: "Tải dữ liệu video", status: "pending" },
  { id: "checkDuration", label: "Kiểm tra độ dài", status: "pending" },
  { id: "checkLanguage", label: "Kiểm tra ngôn ngữ", status: "pending" },
  { id: "generateTranscript", label: "Tạo transcript", status: "pending" },
  { id: "analyzeVideo", label: "Phân tích nội dung", status: "pending" },
  { id: "persistVideo", label: "Lưu vào hệ thống", status: "pending" },
  { id: "complete", label: "Hoàn tất lập chỉ mục", status: "pending" },
];

const steps = ref<LoaderStep[]>(stepTemplate.map((step) => ({ ...step })));

const eventSource = shallowRef<EventSource | null>(null);

const { data: fetchResponse, refresh: refreshVideo } = await useAsyncData(
  () => `video-${youtubeId.value}`,
  () => $fetch.raw(`/api/video/${youtubeId.value}`),
  { server: false, immediate: true, watch: [youtubeId] },
);

const activeSentenceIndex = ref(0);
const answerInput = ref("");
const answerStatus = ref<AnswerStatus>("idle");
const hintCount = ref(0);
const attemptStart = ref<number | null>(null);
const replayCount = ref(0);
const sessionId = ref<string | null>(null);
const sessionScore = ref(0);
const resumeModalOpen = ref(false);
const hasResumeCandidate = ref(false);
const pendingResumeIndex = ref(0);
const pendingResumeDate = ref<string | null>(null);
const revealedWords = ref(0);
const errorWordIndices = ref(new Set<number>());
const currentWordCharProgress = ref(0);
const currentWordTypedChars = ref("");
const revealedWordIndices = ref<number[]>([]);
const errorAudio = shallowRef<HTMLAudioElement | null>(null);
const successAudio = shallowRef<HTMLAudioElement | null>(null);
const sentenceAttempts = ref<SentenceAttemptStatus[]>([]);

const DB_NAME = "nghego-practice";
const DB_VERSION = 1;
const STORE_NAME = "sessions";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "youtubeId" });
      }
    };
  });
}

const practiceDb = {
  sessions: {
    async get(youtubeId: string): Promise<PracticeLocalSession | undefined> {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(youtubeId);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    },
    async put(session: PracticeLocalSession): Promise<void> {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(session);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    },
    async delete(youtubeId: string): Promise<void> {
      const db = await openDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(youtubeId);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    },
  },
};

const currentSentence = computed(() => sentences.value[activeSentenceIndex.value]);
const totalSentences = computed(() => sentences.value.length);
const completedCount = computed(() => Math.min(activeSentenceIndex.value, totalSentences.value));
const accuracy = computed(() => {
  if (completedCount.value === 0) return 0;
  return Math.round(sessionScore.value / completedCount.value);
});
const progressPercent = computed(() => {
  if (totalSentences.value === 0) return 0;
  return Math.round((completedCount.value / totalSentences.value) * 100);
});
const progressValue = computed(() => {
  const value = progressPercent.value;
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
});

const formattedTimeRange = computed(() => {
  if (!currentSentence.value) return "";
  return `${formatMs(currentSentence.value.startTime)} - ${formatMs(currentSentence.value.endTime)}`;
});

const wordCount = computed(() => currentWords.value.length);
const matchedWordCount = computed(() => {
  if (currentWords.value.length === 0) return 0;
  let matches = 0;
  currentWords.value.forEach((word, index) => {
    if (answerWords.value[index] === word) {
      matches += 1;
    }
  });
  return matches;
});

const currentWords = ref<string[]>([]);
const answerWords = ref<string[]>([]);

const showLoader = computed(() => isIndexing.value || isFailed.value || connectionIssue.value);
const showPractice = computed(
  () => isReady.value && Boolean(video.value) && sentences.value.length > 0,
);

function resetLoader() {
  steps.value = stepTemplate.map((step) => ({ ...step }));
  runId.value = null;
  isIndexing.value = false;
  isReady.value = false;
  isFailed.value = false;
  hasTerminalFailure.value = false;
  errorReason.value = null;
  connectionIssue.value = null;
  lastLog.value = null;
}

function stopStream() {
  if (eventSource.value) {
    eventSource.value.close();
    eventSource.value = null;
  }
}

function markStepStatus(stepId: string, status: LoaderStep["status"]) {
  const step = steps.value.find((item) => item.id === stepId);
  if (!step) return;
  step.status = status;
}

function markPreviousDone(stepId: string) {
  const index = steps.value.findIndex((item) => item.id === stepId);
  if (index < 0) return;
  for (let i = 0; i < index; i += 1) {
    if (steps.value[i]) {
      steps.value[i]!.status = "done";
    }
  }
}

function handleLogEntry(entry: VideoIndexingLog) {
  lastLog.value = entry;
  connectionIssue.value = null;

  const startMap: Record<string, string> = {
    [VideoIndexingStepCode.FetchDataStart]: "fetchData",
    [VideoIndexingStepCode.CheckDurationStart]: "checkDuration",
    [VideoIndexingStepCode.CheckLanguageStart]: "checkLanguage",
    [VideoIndexingStepCode.GenerateTranscriptStart]: "generateTranscript",
    [VideoIndexingStepCode.AnalyzeVideoStart]: "analyzeVideo",
    [VideoIndexingStepCode.PersistVideoStart]: "persistVideo",
  };

  const completeMap: Record<string, string> = {
    [VideoIndexingStepCode.FetchDataComplete]: "fetchData",
    [VideoIndexingStepCode.CheckDurationComplete]: "checkDuration",
    [VideoIndexingStepCode.CheckLanguageComplete]: "checkLanguage",
    [VideoIndexingStepCode.GenerateTranscriptComplete]: "generateTranscript",
    [VideoIndexingStepCode.AnalyzeVideoComplete]: "analyzeVideo",
    [VideoIndexingStepCode.PersistVideoComplete]: "persistVideo",
    [VideoIndexingStepCode.IndexComplete]: "complete",
  };

  const failedMap: Record<string, string> = {
    [VideoIndexingStepCode.CheckDurationFailed]: "checkDuration",
    [VideoIndexingStepCode.CheckLanguageFailed]: "checkLanguage",
    [VideoIndexingStepCode.GenerateTranscriptFailed]: "generateTranscript",
    [VideoIndexingStepCode.IndexFailed]: "complete",
  };

  const startStep = startMap[entry.code];
  if (startStep) {
    markPreviousDone(startStep);
    markStepStatus(startStep, "running");
  }

  const completeStep = completeMap[entry.code];
  if (completeStep) {
    markPreviousDone(completeStep);
    markStepStatus(completeStep, "done");
  }

  const failedStep = failedMap[entry.code];
  if (failedStep) {
    markPreviousDone(failedStep);
    markStepStatus(failedStep, "failed");
    isFailed.value = true;
    isIndexing.value = false;
    hasTerminalFailure.value = true;
    errorReason.value = entry.reason ?? "Lỗi không xác định";
    stopStream();
  }
}

function startStream(id: string) {
  stopStream();
  if (!id) return;

  const source = new EventSource(`/api/workflow/${id}`);
  eventSource.value = source;

  source.addEventListener("log", (event) => {
    try {
      const payload = JSON.parse((event as MessageEvent).data) as VideoIndexingLog;
      handleLogEntry(payload);
    } catch {
      connectionIssue.value = "Không đọc được dữ liệu từ máy chủ.";
    }
  });

  source.addEventListener("done", async () => {
    stopStream();
    isIndexing.value = false;
    if (hasTerminalFailure.value) return;
    await refreshVideo();
  });

  source.addEventListener("error", () => {
    if (hasTerminalFailure.value) return;
    connectionIssue.value = "Mất kết nối tới tiến trình xử lý.";
  });
}

function setReadyState(payload: { video: VideoInfo; sentences: VideoSentence[] }) {
  video.value = payload.video;
  sentences.value = payload.sentences;
  sentenceAttempts.value = payload.sentences.map(() => "none" as const);
  isReady.value = true;
  isIndexing.value = false;
  isFailed.value = false;
  hasTerminalFailure.value = false;
  errorReason.value = null;
  stopStream();
}

function setIndexingState(payload: { runId: string }) {
  isIndexing.value = true;
  isReady.value = false;
  isFailed.value = false;
  hasTerminalFailure.value = false;
  errorReason.value = null;
  runId.value = payload.runId;
  startStream(payload.runId);
}

function setFailedState(message: string) {
  isFailed.value = true;
  isReady.value = false;
  isIndexing.value = false;
  hasTerminalFailure.value = true;
  errorReason.value = message;
  stopStream();
}

async function retryIndexing() {
  resetLoader();
  await refreshVideo();
}

async function loadResumeCandidate() {
  if (!video.value) return;
  if (isSignedIn.value) {
    const response = await $fetch<PracticeSessionResponse[]>(
      `/api/practice/${video.value.youtubeId}`,
      {
        query: { lastest: true },
      },
    ).catch(() => []);

    const latest = response[0];
    if (latest?.practice_session && !latest.practice_session.completed) {
      hasResumeCandidate.value = true;
      pendingResumeIndex.value = latest.practice_session.currentSentenceIndex;
      pendingResumeDate.value = latest.practice_session.lastPracticedAt;
      sessionId.value = latest.practice_session.id;
      sessionScore.value = latest.practice_session.score;
      resumeModalOpen.value = true;
      return;
    }
  } else {
    const localSession = await practiceDb.sessions.get(video.value.youtubeId);
    if (localSession) {
      hasResumeCandidate.value = true;
      pendingResumeIndex.value = localSession.currentSentenceIndex;
      pendingResumeDate.value = localSession.updatedAt;
      resumeModalOpen.value = true;
      return;
    }
  }

  await startNewSession();
}

async function startNewSession() {
  resumeModalOpen.value = false;
  hasResumeCandidate.value = false;
  pendingResumeIndex.value = 0;
  pendingResumeDate.value = null;

  if (isSignedIn.value) {
    const sessionRecord = await $fetch<PracticeSessionRecord>("/api/practice", {
      method: "POST",
      body: { youtubeId: youtubeId.value },
    });
    sessionId.value = sessionRecord.id;
    sessionScore.value = sessionRecord.score;
  } else if (video.value) {
    await practiceDb.sessions.delete(video.value.youtubeId);
    await practiceDb.sessions.put({
      youtubeId: video.value.youtubeId,
      currentSentenceIndex: 0,
      attempts: [],
      updatedAt: new Date().toISOString(),
    });
  }

  activeSentenceIndex.value = 0;
  answerInput.value = "";
  hintCount.value = 0;
  answerStatus.value = "idle";
  replayCount.value = 0;
  attemptStart.value = Date.now();
  await playSegment();
}

async function resumeSession() {
  resumeModalOpen.value = false;
  if (hasResumeCandidate.value) {
    activeSentenceIndex.value = Math.min(pendingResumeIndex.value, totalSentences.value - 1);
  }

  if (!isSignedIn.value && video.value) {
    const localSession = await practiceDb.sessions.get(video.value.youtubeId);
    if (localSession?.attempts) {
      const attempt = localSession.attempts.find(
        (item) => item.sentenceId === currentSentence.value?.id,
      );
      if (attempt) {
        answerInput.value = attempt.userText;
      }
      if (localSession.currentSentenceIndex !== undefined) {
        activeSentenceIndex.value = Math.min(
          localSession.currentSentenceIndex,
          totalSentences.value - 1,
        );
      }
    }
  } else {
    await persistProgress();
  }

  attemptStart.value = Date.now();
  await playSegment();
}

async function saveLocalProgress() {
  if (!video.value) return;
  const session = (await practiceDb.sessions.get(video.value.youtubeId)) ?? {
    youtubeId: video.value.youtubeId,
    currentSentenceIndex: activeSentenceIndex.value,
    attempts: [],
    updatedAt: new Date().toISOString(),
  };

  session.currentSentenceIndex = activeSentenceIndex.value;
  session.updatedAt = new Date().toISOString();
  await practiceDb.sessions.put(session);
}

async function saveAttemptLocal(attempt: PracticeAttemptDraft) {
  if (!video.value) return;
  const session = (await practiceDb.sessions.get(video.value.youtubeId)) ?? {
    youtubeId: video.value.youtubeId,
    currentSentenceIndex: activeSentenceIndex.value,
    attempts: [],
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = session.attempts.findIndex(
    (item) => item.sentenceId === attempt.sentenceId,
  );
  if (existingIndex >= 0) {
    session.attempts[existingIndex] = attempt;
  } else {
    session.attempts.push(attempt);
  }

  session.currentSentenceIndex = activeSentenceIndex.value;
  session.updatedAt = new Date().toISOString();
  await practiceDb.sessions.put(session);
}

async function persistProgress() {
  if (isSignedIn.value) {
    const response = await $fetch<PracticeSessionRecord>("/api/practice/progress", {
      method: "POST",
      body: {
        youtubeId: youtubeId.value,
        currentSentenceIndex: activeSentenceIndex.value,
        completed: activeSentenceIndex.value >= totalSentences.value - 1,
        score: sessionScore.value,
      },
    });
    sessionId.value = response.id;
    sessionScore.value = response.score;
  } else {
    await saveLocalProgress();
  }
}

async function persistAttempt(accuracyValue: number, userText: string) {
  if (!currentSentence.value) return;
  const attempt: PracticeAttemptDraft = {
    sentenceId: currentSentence.value.id,
    userText,
    accuracy: accuracyValue,
    hintsUsed: hintCount.value,
    timeTaken: attemptStart.value
      ? Math.max(0, Math.round((Date.now() - attemptStart.value) / 1000))
      : 0,
  };

  if (isSignedIn.value && sessionId.value) {
    await $fetch("/api/practice/attempt", {
      method: "POST",
      body: {
        practiceSessionId: sessionId.value,
        transcriptSentenceId: currentSentence.value.id,
        expectedText: currentSentence.value.text,
        userText,
        accuracy: accuracyValue,
        hintsUsed: hintCount.value,
        timeTaken: attempt.timeTaken,
      },
    });
  } else {
    await saveAttemptLocal(attempt);
  }
}

function useHint() {
  if (!currentSentence.value) return;
  const expectedWords = splitWords(currentSentence.value.text);
  const typedWords = splitWords(answerInput.value);

  for (let i = 0; i < expectedWords.length; i += 1) {
    if (revealedWordIndices.value.includes(i)) continue;
    const typedWord = normalizeText(typedWords[i] ?? "");
    const expectedWord = normalizeText(expectedWords[i] ?? "");
    if (typedWord !== expectedWord) {
      revealedWordIndices.value.push(i);
      hintCount.value += 1;
      return;
    }
  }
}

async function checkAnswer() {
  if (!currentSentence.value) return;
  answerStatus.value = "checking";
  const expected = normalizeText(currentSentence.value.text);
  const actual = normalizeText(answerInput.value);
  const accuracyValue = calculateAccuracy(expected, actual);
  if (!Number.isFinite(accuracyValue)) {
    answerStatus.value = "incorrect";
    if (errorAudio.value) {
      errorAudio.value.currentTime = 0;
      errorAudio.value.play().catch(() => {});
    }
    return;
  }
  sessionScore.value += accuracyValue;
  answerStatus.value = accuracyValue >= 90 ? "correct" : "incorrect";
  sentenceAttempts.value[activeSentenceIndex.value] =
    answerStatus.value === "correct" ? "correct" : "incorrect";
  if (answerStatus.value === "correct" && successAudio.value) {
    successAudio.value.currentTime = 0;
    successAudio.value.play().catch(() => {});
  }
  if (answerStatus.value === "incorrect" && errorAudio.value) {
    errorAudio.value.currentTime = 0;
    errorAudio.value.play().catch(() => {});
  }

  const expectedWords = splitWords(currentSentence.value.text);
  const typedWords = splitWords(answerInput.value);
  const newErrorIndices = new Set<number>();
  for (let i = 0; i < expectedWords.length; i += 1) {
    const typedWord = normalizeText(typedWords[i] ?? "");
    const expectedWord = normalizeText(expectedWords[i] ?? "");
    if (typedWord !== expectedWord) {
      newErrorIndices.add(i);
    }
  }
  errorWordIndices.value = newErrorIndices;
  revealedWords.value = expectedWords.length;

  await persistAttempt(accuracyValue, answerInput.value);
  await persistProgress();
}

async function moveToSentence(index: number) {
  const safeIndex = Math.min(Math.max(index, 0), totalSentences.value - 1);
  activeSentenceIndex.value = safeIndex;
  answerInput.value = "";
  answerWords.value = [];
  answerStatus.value = "idle";
  hintCount.value = 0;
  replayCount.value = 0;
  revealedWords.value = 0;
  errorWordIndices.value = new Set();
  currentWordCharProgress.value = 0;
  currentWordTypedChars.value = "";
  revealedWordIndices.value = [];
  sentenceAttempts.value[safeIndex] = "none";
  attemptStart.value = Date.now();
  await persistProgress();
  await playSegment();
}

async function nextSentence() {
  if (activeSentenceIndex.value >= totalSentences.value - 1) return;
  await moveToSentence(activeSentenceIndex.value + 1);
}

async function prevSentence() {
  if (activeSentenceIndex.value <= 0) return;
  await moveToSentence(activeSentenceIndex.value - 1);
}

async function replaySentence() {
  replayCount.value = 0;
  await playSegment();
}

function handlePlayerReady() {
  void playSegment();
}

const currentStepLabel = computed(() => {
  const running = steps.value.find((step) => step.status === "running");
  if (running) return running.label;
  if (isFailed.value) return "Đã dừng do lỗi";
  if (isReady.value) return "Sẵn sàng luyện tập";
  return "Đang chờ tiến trình";
});

watch(
  () => fetchResponse.value,
  (response) => {
    if (!response) return;
    if (response.status === 200) {
      const payload = response._data as { video: VideoInfo; sentences: VideoSentence[] };
      setReadyState(payload);
      return;
    }
    if (response.status === 202) {
      const payload = response._data as { runId: string };
      if (hasTerminalFailure.value) return;
      setIndexingState(payload);
      return;
    }
    setFailedState("Không thể tải thông tin video.");
  },
  { immediate: true },
);

watch(
  () => isReady.value,
  async (ready) => {
    if (!ready) return;
    await loadResumeCandidate();
  },
);

watch(
  () => currentSentence.value?.text,
  (value) => {
    currentWords.value = value ? splitWords(value) : [];
    answerWords.value = splitWords(answerInput.value);
  },
  { immediate: true },
);

watch(
  () => answerInput.value,
  (value) => {
    answerWords.value = splitWords(value);
    if (answerStatus.value === "correct" || answerStatus.value === "incorrect") {
      answerStatus.value = "idle";
      errorWordIndices.value = new Set();
      revealedWords.value = 0;
    }
    if (!currentSentence.value) return;
    const expectedWordsArr = splitWords(currentSentence.value.text);
    const typedWordsArr = splitWords(value);
    if (typedWordsArr.length === 0) {
      currentWordCharProgress.value = 0;
      currentWordTypedChars.value = "";
      return;
    }

    const isLastWordComplete = value.endsWith(" ");
    const completedCount = isLastWordComplete ? typedWordsArr.length : typedWordsArr.length - 1;
    const currentWordIndex = completedCount;
    if (currentWordIndex < expectedWordsArr.length && !isLastWordComplete) {
      const words = value.trim().split(/\s+/);
      const rawCurrentWord = words[words.length - 1] ?? "";
      currentWordTypedChars.value = rawCurrentWord;
      currentWordCharProgress.value = rawCurrentWord.length;
    } else {
      currentWordTypedChars.value = "";
      currentWordCharProgress.value = 0;
    }
  },
);

watch(
  () => currentSentence.value,
  () => {
    replayCount.value = 0;
    attemptStart.value = Date.now();
  },
);

watch(
  () => youtubeId.value,
  () => {
    resetLoader();
  },
);

const practiceMainRef = ref<{
  player?: {
    playVideo: () => void;
    pauseVideo: () => void;
    stopVideo: () => void;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    getCurrentTime: () => number;
    loadVideoById: (options: {
      videoId: string;
      startSeconds?: number;
      endSeconds?: number;
    }) => void;
  };
} | null>(null);

function getPlayer() {
  return practiceMainRef.value?.player;
}
const timeCheckInterval = ref<number | null>(null);
const PLAYER_STATE_ENDED = 0;
const PLAYER_STATE_PLAYING = 1;
const PLAYER_STATE_PAUSED = 2;

function handlePlayerState(event: { data: number }) {
  if (event.data === PLAYER_STATE_PLAYING) {
    startTimeCheck();
  } else if (event.data === PLAYER_STATE_PAUSED || event.data === PLAYER_STATE_ENDED) {
    stopTimeCheck();
    if (replayCount.value < 2 && currentSentence.value) {
      replayCount.value += 1;
      const player = getPlayer();
      if (player) {
        player.loadVideoById({
          videoId: youtubeId.value,
          startSeconds: currentSentence.value.startTime / 1000,
          endSeconds: currentSentence.value.endTime / 1000,
        });
        startTimeCheck();
      }
    }
  }
}

function startTimeCheck() {
  stopTimeCheck();
  timeCheckInterval.value = window.setInterval(() => {
    const player = getPlayer();
    if (!player || !currentSentence.value) return;
    const currentTime = player.getCurrentTime();
    const endTime = currentSentence.value.endTime / 1000;
    if (currentTime >= endTime && currentTime > 0) {
      player.pauseVideo();
    }
  }, 250);
}

function stopTimeCheck() {
  if (timeCheckInterval.value !== null) {
    clearInterval(timeCheckInterval.value);
    timeCheckInterval.value = null;
  }
}

async function playSegment() {
  if (!currentSentence.value) return;
  const player = getPlayer();
  if (!player) return;
  replayCount.value = 0;
  player.loadVideoById({
    videoId: youtubeId.value,
    startSeconds: currentSentence.value.startTime / 1000,
    endSeconds: currentSentence.value.endTime / 1000,
  });
  startTimeCheck();
}

defineShortcuts({
  meta_enter: {
    usingInput: true,
    handler: () => {
      if (
        answerStatus.value !== "checking" &&
        answerStatus.value !== "correct" &&
        answerStatus.value !== "incorrect"
      ) {
        checkAnswer();
      }
    },
  },
  meta_arrowleft: {
    usingInput: true,
    handler: () => prevSentence(),
  },
  meta_arrowright: {
    usingInput: true,
    handler: () => nextSentence(),
  },
  meta_r: {
    usingInput: true,
    handler: () => replaySentence(),
  },
  meta_h: {
    usingInput: true,
    handler: () => useHint(),
  },
  meta_s: {
    usingInput: true,
    handler: () => nextSentence(),
  },
});

onMounted(() => {
  errorAudio.value = new Audio("/audio/fahhh.mp3");
  successAudio.value = new Audio("/audio/quick-ting.mp3");
});

onBeforeUnmount(() => {
  stopStream();
  stopTimeCheck();
});
</script>

<template>
  <div class="mx-auto max-w-7xl px-3 py-4 sm:px-4 lg:px-6">
    <PracticeLoader
      v-if="showLoader"
      :youtube-id="youtubeId"
      :steps="steps"
      :run-id="runId"
      :is-indexing="isIndexing"
      :is-failed="isFailed"
      :connection-issue="connectionIssue"
      :error-reason="errorReason"
      :current-step-label="currentStepLabel"
      @retry="retryIndexing"
    />

    <PracticeMain
      v-else-if="showPractice"
      ref="practiceMainRef"
      :youtube-id="youtubeId"
      :video="video"
      :sentences="sentences"
      :active-sentence-index="activeSentenceIndex"
      :answer-input="answerInput"
      :answer-status="answerStatus"
      :hint-count="hintCount"
      :replay-count="replayCount"
      :accuracy="accuracy"
      :completed-count="completedCount"
      :total-sentences="totalSentences"
      :progress-value="progressValue"
      :progress-percent="progressPercent"
      :word-count="wordCount"
      :matched-word-count="matchedWordCount"
      :revealed-words="revealedWords"
      :error-word-indices="Array.from(errorWordIndices)"
      :current-word-char-progress="currentWordCharProgress"
      :current-word-typed-chars="currentWordTypedChars"
      :formatted-time-range="formattedTimeRange"
      :resume-modal-open="resumeModalOpen"
      :pending-resume-index="pendingResumeIndex"
      :pending-resume-date="pendingResumeDate"
      :sentence-attempts="sentenceAttempts"
      :revealed-word-indices="revealedWordIndices"
      @update:answer-input="answerInput = $event"
      @update:resume-modal-open="resumeModalOpen = $event"
      @check-answer="checkAnswer"
      @next-sentence="nextSentence"
      @prev-sentence="prevSentence"
      @replay-sentence="replaySentence"
      @move-to-sentence="moveToSentence"
      @hint="useHint"
      @skip="nextSentence"
      @resume-session="resumeSession"
      @start-new-session="startNewSession"
      @player-ready="handlePlayerReady"
      @player-state-change="handlePlayerState"
    />

    <UCard v-else class="border-muted/40 backdrop-blur">
      <div class="space-y-3">
        <USkeleton class="h-6 w-1/3" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-2/3" />
      </div>
    </UCard>
  </div>
</template>
