<script setup lang="ts">
interface VideoInfo {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  thumbnailUrl: string;
}

interface VideoSentence {
  id: string;
  videoId: string;
  sentenceIndex: number;
  startTime: number;
  endTime: number;
  text: string;
}

interface PlayerLike {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
}

interface Props {
  youtubeId: string;
  video: VideoInfo | null;
  sentences: VideoSentence[];
  activeSentenceIndex: number;
  answerInput: string;
  answerStatus: "idle" | "checking" | "correct" | "incorrect";
  hintCount: number;
  replayCount: number;
  accuracy: number;
  completedCount: number;
  totalSentences: number;
  progressValue: number;
  progressPercent: number;
  wordCount: number;
  matchedWordCount: number;
  formattedTimeRange: string;
  resumeModalOpen: boolean;
  pendingResumeIndex: number;
  pendingResumeDate: string | null;
}

interface Emits {
  (e: "update:answerInput", value: string): void;
  (e: "update:resumeModalOpen", value: boolean): void;
  (
    e:
      | "checkAnswer"
      | "nextSentence"
      | "prevSentence"
      | "replaySentence"
      | "hint"
      | "skip"
      | "resumeSession"
      | "startNewSession"
      | "playerReady",
  ): void;
  (e: "moveToSentence", index: number): void;
  (e: "playerStateChange", event: { data: number }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const playerRef = ref<{ player?: PlayerLike } | null>(null);

function getAttemptStatus(index: number) {
  if (index < props.activeSentenceIndex) return "done";
  if (index === props.activeSentenceIndex) return "current";
  return "pending";
}

function formatMs(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
    <div class="space-y-6">
      <UCard class="border-muted/40 bg-background/80">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-wide text-muted">Video</p>
              <h1 class="text-xl font-semibold">{{ props.video?.title }}</h1>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                <UBadge variant="soft" color="primary">{{ props.video?.topic }}</UBadge>
                <span
                  >Segment {{ props.activeSentenceIndex + 1 }} / {{ props.totalSentences }}</span
                >
                <span>{{ props.formattedTimeRange }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UBadge variant="outline">{{ props.wordCount }} từ</UBadge>
              <UBadge variant="soft" color="success">
                Đúng {{ props.matchedWordCount }}/{{ props.wordCount }}
              </UBadge>
            </div>
          </div>
        </template>

        <div class="relative aspect-video overflow-hidden rounded-lg border border-muted/40">
          <ScriptYouTubePlayer
            ref="playerRef"
            :video-id="props.youtubeId"
            :player-options="{ host: 'https://www.youtube-nocookie.com' }"
            class="absolute inset-0"
            @ready="emit('playerReady')"
            @state-change="emit('playerStateChange', $event)"
          >
            <template #awaitingLoad>
              <div class="flex h-full w-full items-center justify-center bg-muted/40">
                <div class="text-center">
                  <UIcon name="i-lucide-play" class="mx-auto size-10 text-muted" />
                  <p class="mt-2 text-sm text-muted">Nhấn để tải video</p>
                </div>
              </div>
            </template>
            <template #loading>
              <div class="flex h-full w-full items-center justify-center bg-muted/40">
                <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-muted" />
              </div>
            </template>
          </ScriptYouTubePlayer>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div class="text-sm text-muted">
            Lặp lại {{ props.replayCount + 1 }}/3 · Accuracy {{ props.accuracy }}%
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <UButton
              variant="soft"
              color="neutral"
              icon="i-lucide-chevron-left"
              :disabled="props.activeSentenceIndex === 0"
              @click="emit('prevSentence')"
            >
              Prev
            </UButton>
            <UButton
              variant="soft"
              color="primary"
              icon="i-lucide-repeat"
              @click="emit('replaySentence')"
            >
              Replay
            </UButton>
            <UButton
              variant="soft"
              color="neutral"
              trailing-icon="i-lucide-chevron-right"
              :disabled="props.activeSentenceIndex >= props.totalSentences - 1"
              @click="emit('nextSentence')"
            >
              Next
            </UButton>
          </div>
        </div>
      </UCard>

      <UCard class="border-muted/40 bg-background/80">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-wide text-muted">Type what you hear</p>
              <h2 class="text-lg font-semibold">Nhập câu bạn nghe được</h2>
            </div>
            <UBadge
              variant="soft"
              :color="
                props.answerStatus === 'correct'
                  ? 'success'
                  : props.answerStatus === 'incorrect'
                    ? 'error'
                    : 'primary'
              "
            >
              {{
                props.answerStatus === "correct"
                  ? "Chính xác"
                  : props.answerStatus === "incorrect"
                    ? "Chưa đúng"
                    : "Đang luyện"
              }}
            </UBadge>
          </div>
        </template>

        <div class="space-y-4">
          <UTextarea
            :model-value="props.answerInput"
            placeholder="Nghe đoạn này rồi nhập lại nội dung..."
            :rows="4"
            @update:model-value="emit('update:answerInput', $event)"
          />
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-xs text-muted">
              <UIcon name="i-lucide-headphones" class="size-4" />
              <span>Segment {{ props.activeSentenceIndex + 1 }}</span>
              <span>•</span>
              <span>{{ props.matchedWordCount }}/{{ props.wordCount }} từ đúng</span>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-lucide-lightbulb"
                @click="emit('hint')"
              >
                Hint
              </UButton>
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-lucide-skip-forward"
                @click="emit('skip')"
              >
                Skip
              </UButton>
              <UButton
                color="primary"
                :loading="props.answerStatus === 'checking'"
                @click="emit('checkAnswer')"
              >
                Check answer
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <div class="space-y-6">
      <UCard class="border-muted/40 bg-background/80">
        <template #header>
          <h3 class="text-lg font-semibold">Session stats</h3>
        </template>
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-lg border border-muted/40 p-3 text-center">
            <p class="text-xs text-muted">Accuracy</p>
            <p class="text-lg font-semibold">{{ props.accuracy }}%</p>
          </div>
          <div class="rounded-lg border border-muted/40 p-3 text-center">
            <p class="text-xs text-muted">Done</p>
            <p class="text-lg font-semibold">{{ props.completedCount }}</p>
          </div>
          <div class="rounded-lg border border-muted/40 p-3 text-center">
            <p class="text-xs text-muted">Total</p>
            <p class="text-lg font-semibold">{{ props.totalSentences }}</p>
          </div>
        </div>
        <div class="mt-4">
          <div class="mb-2 flex items-center justify-between text-xs text-muted">
            <span>Progress</span>
            <span>{{ props.progressPercent }}%</span>
          </div>
          <UProgress :model-value="props.progressValue" :max="100" animation="swing" size="sm" />
        </div>
      </UCard>

      <UCard class="border-muted/40 bg-background/80">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Segments</h3>
            <UBadge variant="soft" color="primary">{{ props.totalSentences }} total</UBadge>
          </div>
        </template>
        <div class="space-y-2 max-h-[460px] overflow-auto">
          <button
            v-for="sentence in props.sentences"
            :key="sentence.id"
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-lg border border-muted/40 px-3 py-2 text-left transition"
            :class="[
              getAttemptStatus(sentence.sentenceIndex) === 'current'
                ? 'bg-primary/10 border-primary/40'
                : getAttemptStatus(sentence.sentenceIndex) === 'done'
                  ? 'bg-success/10 border-success/30'
                  : 'bg-background/60',
            ]"
            @click="emit('moveToSentence', sentence.sentenceIndex)"
          >
            <div class="flex items-center gap-2">
              <span
                class="size-2 rounded-full"
                :class="[
                  getAttemptStatus(sentence.sentenceIndex) === 'current'
                    ? 'bg-primary'
                    : getAttemptStatus(sentence.sentenceIndex) === 'done'
                      ? 'bg-success'
                      : 'bg-muted',
                ]"
              />
              <span class="text-sm">Segment {{ sentence.sentenceIndex + 1 }}</span>
            </div>
            <span class="text-xs text-muted">
              {{ formatMs(sentence.startTime) }}
            </span>
          </button>
        </div>
      </UCard>
    </div>
  </div>

  <UModal
    :open="props.resumeModalOpen"
    title="Tiếp tục luyện tập?"
    @update:open="emit('update:resumeModalOpen', $event)"
  >
    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-muted">
          Bạn đang có phiên luyện tập chưa hoàn tất. Bạn muốn tiếp tục hay bắt đầu mới?
        </p>
        <div class="rounded-lg border border-muted/40 bg-muted/40 p-3 text-sm">
          <div class="flex items-center justify-between">
            <span>Segment gần nhất</span>
            <span class="font-semibold">{{ props.pendingResumeIndex + 1 }}</span>
          </div>
          <div v-if="props.pendingResumeDate" class="mt-2 text-xs text-muted">
            Lần cuối: {{ new Date(props.pendingResumeDate).toLocaleString() }}
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton color="primary" variant="solid" @click="emit('resumeSession')">Tiếp tục</UButton>
          <UButton variant="ghost" @click="emit('startNewSession')">Bắt đầu mới</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
