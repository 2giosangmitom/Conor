<script setup lang="ts">
import type { PracticeMainProps as Props, PracticeMainEmits as Emits } from "~/types/practice";

interface WordDisplay {
  text: string;
  isCorrect: boolean;
  isPlaceholder: boolean;
  charHint: number;
  isCurrent: boolean;
  isWrongLength: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

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

const errorIndicesSet = computed(() => new Set(props.errorWordIndices));

const wordDisplay = computed<WordDisplay[]>(() => {
  const sentence = props.sentences[props.activeSentenceIndex];
  if (!sentence) return [];

  const isAfterCheck = props.answerStatus === "correct" || props.answerStatus === "incorrect";

  if (!isAfterCheck) {
    const endsWithSpace = props.answerInput.endsWith(" ");
    const nonEmptyWords = props.answerInput.split(" ").filter((w) => w.length > 0);
    const completedCount = endsWithSpace
      ? nonEmptyWords.length
      : Math.max(0, nonEmptyWords.length - 1);
    const expectedWords = sentence.text.split(" ");
    const result: WordDisplay[] = [];

    for (let i = 0; i < expectedWords.length; i += 1) {
      if (i < completedCount) {
        const typedWord = nonEmptyWords[i] ?? "";
        const expectedClean = expectedWords[i]!.replace(/[.,!?;:]/g, "");
        result.push({
          text: typedWord,
          isCorrect: true,
          isPlaceholder: false,
          charHint: 0,
          isCurrent: false,
          isWrongLength: typedWord.length !== expectedClean.length,
        });
      } else if (i === completedCount && !endsWithSpace) {
        const cleanWord = expectedWords[i]!.replace(/[.,!?;:]/g, "");
        const typedChars = props.currentWordTypedChars;
        const typedLen = typedChars.length;
        const displayText =
          typedLen > 0
            ? typedChars + "*".repeat(Math.max(0, cleanWord.length - typedLen))
            : "*".repeat(cleanWord.length);
        result.push({
          text: displayText,
          isCorrect: true,
          isPlaceholder: true,
          charHint: cleanWord.length,
          isCurrent: true,
          isWrongLength: false,
        });
      } else {
        const cleanWord = expectedWords[i]!.replace(/[.,!?;:]/g, "");
        result.push({
          text: "*".repeat(cleanWord.length),
          isCorrect: true,
          isPlaceholder: true,
          charHint: 0,
          isCurrent: false,
          isWrongLength: false,
        });
      }
    }

    return result;
  }

  const expectedWords = sentence.text.split(" ");
  return expectedWords.map((word, index) => ({
    text: word,
    isCorrect: !errorIndicesSet.value.has(index),
    isPlaceholder: false,
    charHint: 0,
    isCurrent: false,
    isWrongLength: false,
  }));
});
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[1fr_1.5fr_1fr]">
    <!-- Left column: Video + Stats + Controls -->
    <div class="space-y-4">
      <UCard class="border-muted/40 bg-background/80">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-wide text-muted">Video</p>
              <h1 class="text-xl font-semibold">{{ props.video?.title }}</h1>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                <UBadge variant="soft" color="primary">{{ props.video?.topic }}</UBadge>
                <UBadge variant="soft" color="secondary">{{ props.video?.level }}</UBadge>
                <span>
                  Segment {{ props.activeSentenceIndex + 1 }} / {{ props.totalSentences }}
                </span>
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

        <div class="mt-4">
          <div class="mb-2 flex items-center justify-between text-xs text-muted">
            <span>Tiến độ</span>
            <span>{{ props.progressPercent }}%</span>
          </div>
          <UProgress :model-value="props.progressValue" :max="100" animation="swing" size="sm" />
        </div>

        <div class="mt-4 grid grid-cols-3 gap-3">
          <div class="rounded-lg border border-muted/40 p-3 text-center">
            <p class="text-xs text-muted">Chính xác</p>
            <p class="text-lg font-semibold">{{ props.accuracy }}%</p>
          </div>
          <div class="rounded-lg border border-muted/40 p-3 text-center">
            <p class="text-xs text-muted">Đã xong</p>
            <p class="text-lg font-semibold">{{ props.completedCount }}</p>
          </div>
          <div class="rounded-lg border border-muted/40 p-3 text-center">
            <p class="text-xs text-muted">Tổng cộng</p>
            <p class="text-lg font-semibold">{{ props.totalSentences }}</p>
          </div>
        </div>
      </UCard>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="text-sm text-muted">Lặp lại {{ props.replayCount + 1 }}/3</div>
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
    </div>

    <!-- Center column: Input + Word chips -->
    <div class="space-y-4">
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

        <div class="space-y-3">
          <div class="relative">
            <UTextarea
              :model-value="props.answerInput"
              placeholder="Nghe và gõ lại câu bạn nghe được..."
              :rows="4"
              autoresize
              :maxrows="8"
              size="lg"
              variant="subtle"
              class="text-base leading-relaxed w-full"
              @update:model-value="emit('update:answerInput', $event)"
            />
            <div class="mt-2 flex items-center justify-between text-xs text-muted">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-headphones" class="size-3.5" />
                <span>Segment {{ props.activeSentenceIndex + 1 }}</span>
                <span>•</span>
                <span>{{ props.matchedWordCount }}/{{ props.wordCount }} từ đúng</span>
              </div>
              <div class="flex items-center gap-3">
                <span>{{ props.answerInput.length }} ký tự</span>
                <span>•</span>
                <span
                  >{{
                    props.answerInput.trim() ? props.answerInput.trim().split(/\s+/).length : 0
                  }}
                  từ</span
                >
              </div>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-lightbulb"
              @click="emit('hint')"
            >
              Hint
            </UButton>
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-skip-forward"
              @click="emit('skip')"
            >
              Skip
            </UButton>
            <UButton
              color="primary"
              size="sm"
              :loading="props.answerStatus === 'checking'"
              @click="emit('checkAnswer')"
            >
              Check answer
            </UButton>
          </div>
        </div>
      </UCard>

      <UCard class="border-muted/40 bg-background/80">
        <template #header>
          <h3 class="text-lg font-semibold">Câu hiện tại</h3>
        </template>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="(word, index) in wordDisplay"
            :key="index"
            variant="subtle"
            size="lg"
            :color="
              word.isWrongLength
                ? 'warning'
                : word.isCurrent
                  ? 'secondary'
                  : word.isPlaceholder
                    ? 'neutral'
                    : word.isCorrect
                      ? 'primary'
                      : 'error'
            "
            class="tracking-wider"
            :class="{
              'text-dimmed': word.isPlaceholder && !word.isCurrent,
            }"
          >
            {{ word.text }}
          </UBadge>
        </div>
      </UCard>
    </div>

    <!-- Right column: Segments -->
    <div class="space-y-4">
      <UCard class="border-muted/40 bg-background/80">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Segments</h3>
            <UBadge variant="soft" color="primary">{{ props.totalSentences }} total</UBadge>
          </div>
        </template>
        <div class="space-y-2 max-h-[calc(100vh-12rem)] overflow-auto">
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
