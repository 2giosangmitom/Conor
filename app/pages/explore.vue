<template>
  <UMain>
    <ClientOnly>
      <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
        <UPageHero
          description="Khám phá kho bài học đa dạng, luyện nghe và chép chính tả với hàng ngàn video YouTube được tuyển chọn."
        >
          <template #title>
            <span class="flex flex-col items-center gap-4">
              <UBadge class="tracking-normal" variant="soft" icon="lucide:compass">
                Khám phá bài học
              </UBadge>
              <ClientOnly>
                <UiAuroraText :colors="auroraColors">
                  Học tiếng Anh, Chép chính tả qua YouTube
                </UiAuroraText>
                <template #fallback>
                  <span class="text-4xl font-bold sm:text-5xl lg:text-6xl">
                    Học tiếng Anh, Chép chính tả qua YouTube
                  </span>
                </template>
              </ClientOnly>
            </span>
          </template>
        </UPageHero>
      </UiBlurReveal>
    </ClientOnly>

    <ClientOnly>
      <div class="bg-muted">
        <UiBlurReveal :duration="0.5" :stagger-delay="0.2" blur="5px">
          <UPageSection
            id="recently-watched"
            headline=""
            title="Video đã xem gần đây nhất"
            description="Tiếp tục bài tập từ nơi bạn đã dừng lại"
            :ui="{
              wrapper: 'text-left',
              headline: 'justify-start',
              title: 'text-left',
              description: 'text-left',
            }"
          >
            <template #body>
              <UiBlurReveal :duration="0.45" :stagger-delay="0.08" blur="6px">
                <div v-if="hasRecent" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <UPageCard
                    v-for="video in recentlyWatched"
                    :key="video.youtubeId"
                    variant="outline"
                    class="group h-full"
                  >
                    <template #leading>
                      <div class="overflow-hidden rounded-lg bg-muted">
                        <img
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
                      <div class="flex min-h-24 flex-col gap-4">
                        <div class="flex flex-wrap items-center gap-2">
                          <UBadge variant="soft">{{ video.topic }}</UBadge>
                          <UBadge variant="soft">{{ video.level }}</UBadge>
                          <UBadge variant="soft">{{ video.duration }}</UBadge>
                          <span class="text-xs text-muted">{{ video.lastWatchedAt }}</span>
                        </div>
                        <div>
                          <div class="flex items-center justify-between text-xs text-muted">
                            <span>Tien do</span>
                            <span>{{ video.progress }}%</span>
                          </div>
                          <div class="mt-2 h-2 rounded-full bg-muted">
                            <div
                              class="h-2 rounded-full bg-primary transition-all"
                              :style="{ width: `${video.progress}%` }"
                            />
                          </div>
                        </div>
                      </div>
                    </template>
                    <template #footer>
                      <UButton
                        :to="`/practice/${video.youtubeId}`"
                        label="Tiep tuc"
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
                  <UIcon name="lucide:history" class="size-6 text-muted" />
                  <div>
                    <p class="text-sm font-semibold">Chua co video nao gan day</p>
                    <p class="text-sm text-muted">Bat dau luyen tap de xem lai lich su o day</p>
                  </div>
                  <UButton to="/" label="Dan link YouTube" size="sm" variant="outline" />
                </div>
              </UiBlurReveal>
            </template>
          </UPageSection>
        </UiBlurReveal>
      </div>
    </ClientOnly>

    <ClientOnly>
      <div ref="allVideosSectionRef">
        <UiBlurReveal :duration="0.5" :stagger-delay="0.2" blur="5px">
          <UPageSection
            id="all-videos"
            headline=""
            title="Tất cả Video"
            description="Lọc theo mức độ, thời lượng, chủ đề và tìm kiếm nhanh"
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
                  <!-- <UDropdownMenu :items="topicMenuItems" :content="{ align: 'start' }">
                    <UButton
                      variant="outline"
                      size="sm"
                      trailing-icon="lucide:chevron-down"
                      :label="selectedTopic ? `Chủ đề: ${selectedTopic}` : 'Chủ đề'"
                    />
                  </UDropdownMenu> -->
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
                          <img
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
                          <UBadge variant="soft">{{ formatDuration(video.duration) }}</UBadge>
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
    </ClientOnly>
  </UMain>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const auroraColors = computed(() => {
  return colorMode.value === "dark"
    ? [
        "var(--color-primary-100)",
        "var(--color-primary-200)",
        "var(--color-primary-300)",
        "var(--color-primary-400)",
      ]
    : [
        "var(--color-primary-300)",
        "var(--color-primary-500)",
        "var(--color-primary-700)",
        "var(--color-primary-900)",
      ];
});

interface RecentVideo {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  topic: string;
  level: string;
  duration: string;
  lastWatchedAt: string;
  progress: number;
}

const recentlyWatched = ref<RecentVideo[]>([
  {
    youtubeId: "9bZkp7q19f0",
    title: "British Accent Listening Practice | Everyday Conversations",
    thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    topic: "Conversation",
    level: "B1",
    duration: "12:45",
    lastWatchedAt: "2 gio truoc",
    progress: 64,
  },
  {
    youtubeId: "kXYiU_JCYtU",
    title: "IELTS Listening Tips: Note-Taking That Works",
    thumbnailUrl: "https://i.ytimg.com/vi/kXYiU_JCYtU/hqdefault.jpg",
    topic: "IELTS",
    level: "B2",
    duration: "18:10",
    lastWatchedAt: "Hom qua",
    progress: 42,
  },
  {
    youtubeId: "hTWKbfoikeg",
    title: "American News Listening | Short Headlines",
    thumbnailUrl: "https://i.ytimg.com/vi/hTWKbfoikeg/hqdefault.jpg",
    topic: "News",
    level: "A2",
    duration: "09:32",
    lastWatchedAt: "3 ngay truoc",
    progress: 78,
  },
]);

const hasRecent = computed(() => recentlyWatched.value.length > 0);

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
const selectedTopic = ref<string | null>(null);
const pageIndex = ref(0);
const pageSize = 8;
const allVideosSectionRef = ref<HTMLElement | null>(null);

async function scrollToSection() {
  if (!allVideosSectionRef.value) return;

  await nextTick();
  const top = allVideosSectionRef.value.offsetTop;
  window.scrollTo({ top, behavior: "smooth" });
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

// const topicMenuItems = computed(() => [
//   {
//     label: "Tất cả",
//     onSelect: () => {
//       selectedTopic.value = null;
//       scrollToSection();
//     },
//   },
//   {
//     label: "Conversation",
//     onSelect: () => {
//       selectedTopic.value = "Conversation";
//       scrollToSection();
//     },
//   },
//   {
//     label: "Business",
//     onSelect: () => {
//       selectedTopic.value = "Business";
//       scrollToSection();
//     },
//   },
//   {
//     label: "Travel",
//     onSelect: () => {
//       selectedTopic.value = "Travel";
//       scrollToSection();
//     },
//   },
//   {
//     label: "Entertainment",
//     onSelect: () => {
//       selectedTopic.value = "Entertainment";
//       scrollToSection();
//     },
//   },
//   {
//     label: "Technology",
//     onSelect: () => {
//       selectedTopic.value = "Technology";
//       scrollToSection();
//     },
//   },
// ]);

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
      topic: selectedTopic.value ?? undefined,
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
  selectedTopic.value = null;
  searchQuery.value = "";
  pageIndex.value = 0;
}

watch([selectedLevel, selectedDuration, selectedTopic, searchQuery], () => {
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
