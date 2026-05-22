<template>
  <UMain>
    <div ref="allVideosSectionRef">
      <UiBlurReveal :duration="0.5" :stagger-delay="0.2" blur="5px">
        <UPageSection
          id="all-videos"
          headline=""
          title="Tất cả Video"
          description="Khám phá kho bài học tiếng Anh đa dạng. Luyện nghe chép chính tả với hàng ngàn video YouTube được tuyển chọn theo trình độ, chủ đề và thời lượng."
          :ui="{
            wrapper: 'text-left',
            headline: 'justify-start',
            title: 'text-left',
            description: 'text-left',
          }"
        >
          <template #body>
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <UDropdownMenu :items="levelMenuItems" :content="{ align: 'start' }">
                  <UButton
                    variant="outline"
                    size="sm"
                    trailing-icon="lucide:chevron-down"
                    :label="selectedLevel ? `Level: ${selectedLevel}` : 'Level'"
                  />
                </UDropdownMenu>
                <UDropdownMenu :items="durationMenuItems" :content="{ align: 'start' }">
                  <UButton
                    variant="outline"
                    size="sm"
                    trailing-icon="lucide:chevron-down"
                    :label="durationFilterLabel"
                  />
                </UDropdownMenu>
              </div>
              <UInput
                v-model="searchQuery"
                placeholder="Tìm kiếm video"
                aria-label="Tìm kiếm video"
                leading-icon="lucide:search"
                class="w-full lg:w-72"
                size="lg"
              />
            </div>

            <div class="mt-6">
              <UiBlurReveal
                :key="currentPage"
                :duration="0.5"
                :stagger-delay="0.12"
                blur="6px"
                :y-offset="14"
              >
                <div v-if="displayedVideos.length" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <UPageCard
                    v-for="video in displayedVideos"
                    :key="video.youtubeId"
                    variant="outline"
                    class="group h-full"
                  >
                    <template #leading>
                      <div class="overflow-hidden rounded-lg bg-muted">
                        <NuxtImg
                          :src="video.thumbnailUrl"
                          :alt="video.title"
                          class="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      </div>
                    </template>
                    <template #title>
                      <span class="line-clamp-2">{{ video.title }}</span>
                    </template>
                    <template #description>
                      <div class="flex min-h-16 flex-wrap items-center gap-2">
                        <UBadge variant="soft">{{ video.level }}</UBadge>
                        <UBadge variant="soft">{{ video.topic }}</UBadge>
                        <UBadge variant="outline" color="neutral" icon="lucide:clock-3">
                          {{ formatDuration(video.duration) }}
                        </UBadge>
                      </div>
                    </template>
                    <template #footer>
                      <UButton
                        :to="`/practice/${video.youtubeId}`"
                        label="Bắt đầu"
                        trailing-icon="lucide:arrow-right"
                        size="sm"
                        color="primary"
                        variant="solid"
                      />
                    </template>
                  </UPageCard>
                </div>
                <div
                  v-else
                  class="flex flex-col items-start justify-center gap-3 rounded-2xl border border-dashed border-muted px-6 py-10 text-left"
                >
                  <UIcon name="lucide:search-x" class="size-6 text-muted" />
                  <div>
                    <p class="text-sm font-semibold">Không tìm thấy Video</p>
                    <p class="text-sm text-muted">Thử đổi bộ lọc hoặc từ khóa khác</p>
                  </div>
                  <UButton label="Xóa bộ lọc" size="sm" variant="outline" @click="clearFilters" />
                </div>
              </UiBlurReveal>
            </div>

            <div class="mt-6 flex flex-col items-center gap-3">
              <div class="text-sm text-muted">Trang {{ currentPage }} / {{ pageCount }}</div>
              <UPagination
                v-model:page="currentPage"
                :total="totalVideos"
                :items-per-page="pageSize"
                size="lg"
                class="scale-110"
              />
            </div>
          </template>
        </UPageSection>
      </UiBlurReveal>
    </div>
  </UMain>
</template>

<script setup lang="ts">
const { origin } = useRequestURL();

useSeoMeta({
  title: "Khám phá bài học",
  description:
    "Khám phá kho bài học tiếng Anh đa dạng. Luyện nghe chép chính tả với hàng ngàn video YouTube được tuyển chọn theo trình độ, chủ đề và thời lượng.",
  ogTitle: "Khám phá bài học - NgheGo",
  ogDescription:
    "Khám phá kho bài học tiếng Anh đa dạng. Luyện nghe chép chính tả với hàng ngàn video YouTube được tuyển chọn.",
  ogUrl: `${origin}/explore`,
  ogImage: `${origin}/images/logo.svg`,
  twitterTitle: "Khám phá bài học - NgheGo",
  twitterDescription:
    "Khám phá kho bài học tiếng Anh đa dạng. Luyện nghe chép chính tả với hàng ngàn video YouTube được tuyển chọn.",
  twitterImage: `${origin}/images/logo.svg`,
});

interface ApiVideo {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  topic: string;
  level: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface VideoIndexResponse {
  videos: ApiVideo[];
  total: number;
}

const searchQuery = ref("");
const selectedLevel = ref<string | null>(null);
const selectedDuration = ref<string | null>(null);
const pageIndex = ref(0);
const pageSize = 8;
const allVideosSectionRef = ref<HTMLElement | null>(null);

async function scrollToSection() {
  if (!allVideosSectionRef.value) return;

  await nextTick();
  const top = allVideosSectionRef.value.offsetTop;
  window.scrollTo({ top, behavior: "smooth" });
  const firstFocusable = allVideosSectionRef.value.querySelector(
    'input, button, [tabindex]:not([tabindex="-1"])',
  );
  if (firstFocusable instanceof HTMLElement) {
    firstFocusable.focus({ preventScroll: true });
  }
}

const levelMenuItems = computed(() => [
  {
    label: "Tất cả",
    onSelect: () => {
      selectedLevel.value = null;
      scrollToSection();
    },
  },
  {
    label: "A1",
    onSelect: () => {
      selectedLevel.value = "A1";
      scrollToSection();
    },
  },
  {
    label: "A2",
    onSelect: () => {
      selectedLevel.value = "A2";
      scrollToSection();
    },
  },
  {
    label: "B1",
    onSelect: () => {
      selectedLevel.value = "B1";
      scrollToSection();
    },
  },
  {
    label: "B2",
    onSelect: () => {
      selectedLevel.value = "B2";
      scrollToSection();
    },
  },
  {
    label: "C1",
    onSelect: () => {
      selectedLevel.value = "C1";
      scrollToSection();
    },
  },
  {
    label: "C2",
    onSelect: () => {
      selectedLevel.value = "C2";
      scrollToSection();
    },
  },
]);

const durationMenuItems = computed(() => [
  {
    label: "Tất cả",
    onSelect: () => {
      selectedDuration.value = null;
      scrollToSection();
    },
  },
  {
    label: "Ngắn (< 5 phút)",
    onSelect: () => {
      selectedDuration.value = "short";
      scrollToSection();
    },
  },
  {
    label: "Trung bình (5-10 phút)",
    onSelect: () => {
      selectedDuration.value = "medium";
      scrollToSection();
    },
  },
  {
    label: "Dài (> 10 phút)",
    onSelect: () => {
      selectedDuration.value = "long";
      scrollToSection();
    },
  },
]);

const durationFilterLabel = computed(() => {
  if (selectedDuration.value === "short") return "Thời lượng: Ngắn";
  if (selectedDuration.value === "medium") return "Thời lượng: Trung bình";
  if (selectedDuration.value === "long") return "Thời lượng: Dài";
  return "Thời lượng";
});

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase());

const durationFilterBounds = computed(() => {
  if (selectedDuration.value === "short") return { min: undefined, max: 299 };
  if (selectedDuration.value === "medium") return { min: 300, max: 600 };
  if (selectedDuration.value === "long") return { min: 601, max: undefined };
  return null;
});

const { data: videoResponse } = await useFetch<VideoIndexResponse>("/api/video", {
  query: computed(() => {
    const durationBounds = durationFilterBounds.value;

    return {
      sort: "newest",
      period: "all",
      level: selectedLevel.value ?? undefined,
      q: normalizedQuery.value || undefined,
      limit: pageSize,
      offset: pageIndex.value * pageSize,
      minDuration: durationBounds?.min,
      maxDuration: durationBounds?.max,
    };
  }),
});

const displayedVideos = computed(() => videoResponse.value?.videos ?? []);
const totalVideos = computed(() => videoResponse.value?.total ?? 0);
const pageCount = computed(() => Math.max(1, Math.ceil(totalVideos.value / pageSize)));
const currentPage = computed({
  get: () => Math.min(pageCount.value, pageIndex.value + 1),
  set: (value) => {
    const safePage = Math.min(Math.max(1, Math.floor(value)), pageCount.value);
    pageIndex.value = safePage - 1;
  },
});

function formatDuration(durationSeconds: number) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clearFilters() {
  selectedLevel.value = null;
  selectedDuration.value = null;
  searchQuery.value = "";
  pageIndex.value = 0;
}

watch([selectedLevel, selectedDuration, searchQuery], () => {
  pageIndex.value = 0;
});

watch(
  currentPage,
  async () => {
    await scrollToSection();
  },
  { flush: "post" },
);
</script>
