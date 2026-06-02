<script setup lang="ts">
import type { PracticeMainProps as Props, PracticeMainEmits as Emits } from "~/types/practice";

interface WordDisplay {
  text: string;
  isCorrect: boolean;
  isPlaceholder: boolean;
  charHint: number;
  isCurrent: boolean;
  isWrongLength: boolean;
  isHinted: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { polite } = useAnnouncer();

const playerRef = useTemplateRef("scriptYouTubePlayer");
const answerTextareaRef = useTemplateRef("answerTextarea");

function triggerPlayer() {
  const el = (playerRef.value as unknown as { $el: HTMLElement })?.$el;
  if (el) {
    el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  }
}

function focusInput() {
  nextTick(() => {
    answerTextareaRef.value?.textareaRef?.focus();
  });
}

defineExpose({
  player: computed(() => playerRef.value?.player),
  triggerPlayer,
  focusInput,
});

function getAttemptStatus(index: number) {
  const status = props.sentenceAttempts[index];
  if (!status || status === "none") {
    if (index === props.activeSentenceIndex) return "current";
    return "pending";
  }
  return status;
}

function formatMs(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const errorIndicesSet = computed(() => new Set(props.errorWordIndices));
const revealedIndicesSet = computed(() => new Set(props.revealedWordIndices));

watch(
  () => [props.answerStatus, props.activeSentenceIndex, props.matchedWordCount, props.wordCount],
  ([status, index, matched, total]) => {
    const sentenceNumber = Number(index) + 1;
    if (status === "checking") {
      polite(`Đang kiểm tra câu ${sentenceNumber}.`);
      return;
    }
    if (status === "correct") {
      polite(`Câu ${sentenceNumber} đã đúng. ${matched}/${total} từ khớp.`);
      return;
    }
    if (status === "incorrect") {
      polite(
        `Câu ${sentenceNumber} chưa đúng. ${matched}/${total} từ khớp. Các từ sai đã được gạch chân.`,
      );
      return;
    }
    polite(`Đang ở câu ${sentenceNumber}. ${matched}/${total} từ khớp.`);
  },
  { immediate: true },
);

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
          isHinted: false,
        });
      } else if (i === completedCount && !endsWithSpace) {
        const cleanWord = expectedWords[i]!.replace(/[.,!?;:]/g, "");
        const typedChars = props.currentWordTypedChars;
        const typedLen = typedChars.length;
        const isHinted = revealedIndicesSet.value.has(i);
        let displayText: string;
        if (isHinted && typedLen === 0) {
          displayText = cleanWord[0] + "*".repeat(Math.max(0, cleanWord.length - 1));
        } else {
          displayText =
            typedLen > 0
              ? typedChars + "*".repeat(Math.max(0, cleanWord.length - typedLen))
              : "*".repeat(cleanWord.length);
        }
        result.push({
          text: displayText,
          isCorrect: true,
          isPlaceholder: true,
          charHint: cleanWord.length,
          isCurrent: true,
          isWrongLength: false,
          isHinted: isHinted && typedLen === 0,
        });
      } else {
        const cleanWord = expectedWords[i]!.replace(/[.,!?;:]/g, "");
        const isHinted = revealedIndicesSet.value.has(i);
        const displayText = isHinted
          ? cleanWord[0] + "*".repeat(Math.max(0, cleanWord.length - 1))
          : "*".repeat(cleanWord.length);
        result.push({
          text: displayText,
          isCorrect: true,
          isPlaceholder: true,
          charHint: 0,
          isCurrent: false,
          isWrongLength: false,
          isHinted,
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
    isHinted: false,
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

        <div
          class="relative aspect-video overflow-hidden rounded-lg border border-muted/40"
          aria-label="Video YouTube"
        >
          <ScriptYouTubePlayer
            ref="scriptYouTubePlayer"
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
          <UProgress
            :model-value="props.progressValue"
            :max="100"
            animation="swing"
            size="sm"
            aria-label="Tiến độ luyện tập"
          />
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
            <p class="text-xs text-muted">Gợi ý</p>
            <p class="text-lg font-semibold">{{ props.hintCount }}</p>
          </div>
        </div>
      </UCard>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="text-sm text-muted" role="status">Lượt {{ props.replayCount + 1 }}/3</div>
        <div class="flex flex-wrap items-center gap-3">
          <UTooltip text="Câu trước" :kbds="['meta', 'J']">
            <UButton
              variant="soft"
              color="neutral"
              icon="i-lucide-chevron-left"
              :disabled="props.activeSentenceIndex === 0"
              aria-label="Câu trước"
              @click="emit('prevSentence')"
            >
              Trước
            </UButton>
          </UTooltip>
          <UTooltip text="Phát lại" :kbds="['meta', 'R']">
            <UButton
              variant="soft"
              color="primary"
              icon="i-lucide-repeat"
              aria-label="Phát lại câu này"
              @click="emit('replaySentence')"
            >
              Phát lại
            </UButton>
          </UTooltip>
          <UTooltip text="Câu sau" :kbds="['meta', 'K']">
            <UButton
              variant="soft"
              color="neutral"
              trailing-icon="i-lucide-chevron-right"
              :disabled="props.activeSentenceIndex >= props.totalSentences - 1"
              aria-label="Câu sau"
              @click="emit('nextSentence')"
            >
              Sau
            </UButton>
          </UTooltip>
        </div>
      </div>

      <!-- Practice Again button when session is completed -->
      <div
        v-if="props.isCompleted"
        class="rounded-lg border border-success/30 bg-success/10 p-4 text-center"
      >
        <UIcon name="i-lucide-circle-check" class="mx-auto mb-2 size-8 text-success" />
        <p class="mb-1 text-lg font-semibold text-success">Hoàn thành!</p>
        <p class="mb-3 text-sm text-muted">Bạn đã hoàn tất luyện tập video này.</p>
        <UButton
          color="primary"
          variant="solid"
          size="lg"
          icon="i-lucide-refresh-cw"
          @click="emit('startNewSession')"
        >
          Luyện tập lại
        </UButton>
      </div>
    </div>

    <!-- Center column: Input + Word chips -->
    <div class="space-y-4">
      <UCard class="border-muted/40 bg-background/80">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold">Nhập câu bạn nghe được</h2>
              <UTooltip text="Tập trung vào ô nhập">
                <UKbd size="sm">Ctrl+I</UKbd>
              </UTooltip>
            </div>
            <UBadge
              variant="soft"
              :color="
                props.answerStatus === 'correct'
                  ? 'success'
                  : props.answerStatus === 'incorrect'
                    ? 'warning'
                    : 'primary'
              "
              role="status"
              aria-live="polite"
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
              ref="answerTextarea"
              :model-value="props.answerInput"
              name="answerInput"
              aria-label="Nhập câu bạn nghe được"
              placeholder="Nghe và gõ lại câu bạn nghe được..."
              :rows="4"
              autoresize
              :maxrows="8"
              size="lg"
              variant="subtle"
              class="text-base leading-relaxed w-full"
              :disabled="props.isCompleted"
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
                <span>
                  {{ props.answerInput.trim() ? props.answerInput.trim().split(/\s+/).length : 0 }}
                  từ
                </span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <UTooltip text="Gợi ý chữ cái đầu" :kbds="['meta', 'H']">
              <UButton
                variant="ghost"
                color="neutral"
                size="sm"
                :disabled="props.isCompleted"
                icon="i-lucide-lightbulb"
                aria-label="Gợi ý chữ cái đầu"
                @click="emit('hint', 0)"
              >
                Gợi ý
              </UButton>
            </UTooltip>
            <UTooltip text="Bỏ qua câu này" :kbds="['meta', 'S']">
              <UButton
                variant="ghost"
                color="neutral"
                size="sm"
                :disabled="props.isCompleted"
                icon="i-lucide-skip-forward"
                aria-label="Bỏ qua câu này"
                @click="emit('skip')"
              >
                Bỏ qua
              </UButton>
            </UTooltip>
            <UTooltip text="Kiểm tra đáp án" :kbds="['meta', 'Enter']">
              <UButton
                color="primary"
                size="sm"
                :disabled="props.isCompleted"
                :loading="props.answerStatus === 'checking'"
                @click="emit('checkAnswer')"
              >
                Kiểm tra
              </UButton>
            </UTooltip>
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
                : word.isHinted
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
              'text-dimmed': word.isPlaceholder && !word.isCurrent && !word.isHinted,
              'text-warning': word.isHinted,
              'underline decoration-2 underline-offset-4': !word.isPlaceholder && !word.isCorrect,
            }"
            :aria-label="
              word.isPlaceholder
                ? word.isCurrent
                  ? 'Từ hiện tại'
                  : 'Chưa nhập'
                : word.isCorrect
                  ? 'Đúng'
                  : 'Sai, được gạch chân'
            "
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
            <h3 class="text-lg font-semibold">Danh sách câu</h3>
            <UBadge variant="soft" color="primary">{{ props.totalSentences }} câu</UBadge>
          </div>
        </template>
        <nav aria-label="Danh sách câu">
          <div class="space-y-2 max-h-[calc(100vh-12rem)] overflow-auto">
            <button
              v-for="sentence in props.sentences"
              :key="sentence.id"
              type="button"
              class="flex w-full items-center justify-between gap-3 rounded-lg border border-muted/40 px-3 py-2 text-left transition"
              :aria-current="
                sentence.sentenceIndex === props.activeSentenceIndex ? 'true' : undefined
              "
              :class="[
                getAttemptStatus(sentence.sentenceIndex) === 'current'
                  ? 'bg-secondary/10 border-secondary/40'
                  : getAttemptStatus(sentence.sentenceIndex) === 'correct'
                    ? 'bg-success/10 border-success/30'
                    : getAttemptStatus(sentence.sentenceIndex) === 'incorrect'
                      ? 'bg-warning/10 border-warning/30'
                      : 'bg-background/60',
              ]"
              @click="emit('moveToSentence', sentence.sentenceIndex)"
            >
              <div class="flex items-center gap-2">
                <span
                  class="size-2 rounded-full"
                  :class="[
                    getAttemptStatus(sentence.sentenceIndex) === 'current'
                      ? 'bg-secondary'
                      : getAttemptStatus(sentence.sentenceIndex) === 'correct'
                        ? 'bg-success'
                        : getAttemptStatus(sentence.sentenceIndex) === 'incorrect'
                          ? 'bg-warning'
                          : 'bg-muted',
                  ]"
                  :aria-label="
                    getAttemptStatus(sentence.sentenceIndex) === 'current'
                      ? 'Câu hiện tại'
                      : getAttemptStatus(sentence.sentenceIndex) === 'correct'
                        ? 'Đã hoàn thành chính xác'
                        : getAttemptStatus(sentence.sentenceIndex) === 'incorrect'
                          ? 'Chưa chính xác'
                          : 'Chưa luyện tập'
                  "
                />
                <span class="text-sm">Câu {{ sentence.sentenceIndex + 1 }}</span>
                <UIcon
                  v-if="getAttemptStatus(sentence.sentenceIndex) === 'correct'"
                  name="i-lucide-circle-check"
                  class="size-4 text-success"
                  aria-label="Đã hoàn thành chính xác"
                />
                <UIcon
                  v-else-if="getAttemptStatus(sentence.sentenceIndex) === 'incorrect'"
                  name="i-lucide-alert-circle"
                  class="size-4 text-warning"
                  aria-label="Chưa chính xác"
                />
              </div>
              <span class="text-xs text-muted">
                {{ formatMs(sentence.startTime) }}
              </span>
            </button>
          </div>
        </nav>
      </UCard>
    </div>

    <div class="sr-only" role="region" aria-label="Phím tắt">
      <h2>Phím tắt</h2>
      <dl>
        <dt>Cmd+Enter</dt>
        <dd>Kiểm tra đáp án</dd>
        <dt>Cmd+J</dt>
        <dd>Câu tiếp theo</dd>
        <dt>Cmd+K</dt>
        <dd>Câu trước</dd>
        <dt>Cmd+R</dt>
        <dd>Phát lại câu hiện tại</dd>
        <dt>Cmd+H</dt>
        <dd>Hiển thị gợi ý</dd>
        <dt>Cmd+S</dt>
        <dd>Bỏ qua câu hiện tại</dd>
        <dt>Ctrl+I</dt>
        <dd>Di chuyển tới ô nhập liệu</dd>
      </dl>
    </div>
  </div>
</template>
