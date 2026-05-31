<template>
  <div>
    <Motion
      :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
      :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
      :transition="{ duration: 0.5, ease: 'easeInOut' }"
      :in-view-options="{ once: true }"
    >
      <UPageHero
        ref="heroRef"
        description="Làm chủ kỹ năng nghe và chính tả với nội dung YouTube yêu thích của bạn. Luyện tập tiếng Anh với độ chính xác cao."
      >
        <template #title>
          <span class="flex flex-col items-center gap-4">
            <UBadge class="tracking-normal" variant="soft" icon="lucide:badge-check">
              Hoàn toàn miễn phí
            </UBadge>
            <UiAuroraText :colors="auroraColors">
              Luyện nghe gõ chính tả Tiếng Anh với video bạn yêu thích
            </UiAuroraText>
          </span>
        </template>

        <template #links>
          <div class="flex flex-col items-center gap-2 sm:flex-row">
            <UInput
              v-model="videoUrl"
              placeholder="https://www.youtube.com/watch?v=example"
              aria-label="Dán link YouTube vào đây"
              leading-icon="openmoji:youtube"
              class="lg:min-w-md"
              size="xl"
              @keyup.enter="handleStart"
            />
            <UButton
              label="Bắt đầu"
              trailing-icon="lucide:play"
              size="xl"
              color="primary"
              variant="solid"
              :disabled="!videoUrl"
              @click="handleStart"
            />
          </div>
        </template>
      </UPageHero>
    </Motion>

    <section class="relative py-20">
      <div
        class="pointer-events-none absolute left-1/2 top-16 -z-10 h-72 w-lg -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <Motion
        :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
        :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
        :transition="{ duration: 0.5, ease: 'easeInOut' }"
        :in-view-options="{ once: true }"
      >
        <UPageSection
          id="stats"
          headline="Video phổ biến"
          title="Những video được cộng đồng học nhiều nhất"
          description="Khám phá các video đang được người học chọn nhiều nhất, rồi mở rộng sang toàn bộ kho bài học trong trang Explore"
          :ui="{
            wrapper: 'mx-auto max-w-7xl px-6 sm:px-8 text-left',
            headline: 'justify-start',
            title: 'text-left',
            description: 'text-left',
          }"
        >
          <template #body>
            <UButton
              to="/explore"
              label="Khám phá thêm"
              trailing-icon="lucide:arrow-right"
              size="md"
              variant="soft"
              color="primary"
            />

            <div class="mt-6">
              <template v-if="popularVideosPending">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <UPageCard
                    v-for="i in 3"
                    :key="i"
                    variant="ghost"
                    :ui="{
                      root: 'h-full',
                      wrapper: 'flex h-full flex-col',
                      body: 'flex flex-1 flex-col gap-4',
                      title: 'min-h-14 overflow-hidden',
                      description: 'mt-auto',
                    }"
                    class="flex h-full min-h-88 flex-col overflow-hidden rounded-2xl bg-background/70 transition-all duration-300 hover:-translate-y-1 hover:bg-muted/20"
                  >
                    <template #leading>
                      <div class="rounded-2xl bg-muted/30 p-3">
                        <USkeleton class="aspect-video w-full rounded-xl" />
                      </div>
                    </template>
                    <template #title>
                      <USkeleton class="h-5 w-4/5" />
                    </template>
                    <template #description>
                      <div class="flex min-h-16 flex-wrap items-center gap-2">
                        <USkeleton class="h-5 w-14" />
                        <USkeleton class="h-5 w-20" />
                      </div>
                    </template>
                  </UPageCard>
                </div>
              </template>

              <template v-else-if="popularVideos.length">
                <UCarousel
                  :items="popularVideos"
                  arrows
                  dots
                  align="start"
                  :slides-to-scroll="1"
                  contain-scroll="trimSnaps"
                  :ui="{
                    root: 'px-10 sm:px-12',
                    container: 'items-stretch gap-4',
                    item: 'flex basis-full items-stretch sm:basis-1/2 lg:basis-1/3',
                  }"
                >
                  <template #default="{ item: video }">
                    <UPageCard
                      :to="`/practice/${video.youtubeId}`"
                      variant="ghost"
                      :ui="{
                        root: 'h-full',
                        wrapper: 'flex h-full flex-col',
                        body: 'flex flex-1 flex-col gap-4',
                        title: 'min-h-14 overflow-hidden',
                        description: 'mt-auto',
                      }"
                      class="group flex h-full min-h-88 cursor-pointer flex-col overflow-hidden rounded-2xl bg-background/70 transition-all duration-300 hover:-translate-y-1 hover:bg-elevated/90"
                    >
                      <template #leading>
                        <div class="rounded-2xl bg-muted/30 p-3">
                          <div class="relative overflow-hidden rounded-xl bg-muted">
                            <NuxtImg
                              :src="video.thumbnailUrl"
                              :alt="video.title"
                              class="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                              placeholder
                              placeholder-class="blur-md"
                            />
                            <div
                              class="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20"
                            >
                              <UIcon
                                name="lucide:play"
                                class="size-12 text-white opacity-0 transition duration-300 group-hover:opacity-100"
                              />
                            </div>
                          </div>
                        </div>
                      </template>

                      <template #title>
                        <span class="block min-h-14 line-clamp-2 leading-6 text-pretty">
                          {{ video.title }}
                        </span>
                      </template>

                      <template #description>
                        <div class="flex min-h-16 flex-wrap items-center gap-2">
                          <UBadge variant="soft">{{ video.level }}</UBadge>
                          <UBadge variant="soft">{{ video.topic }}</UBadge>
                          <UBadge variant="outline" color="neutral" icon="lucide:clock-3">
                            {{ formatDuration(video.duration) }}
                          </UBadge>
                          <UBadge variant="outline" color="neutral" icon="lucide:users">
                            {{ formatLearnedCount(video.learnedCount) }}
                          </UBadge>
                        </div>
                      </template>
                    </UPageCard>
                  </template>
                </UCarousel>
              </template>

              <div
                v-else
                class="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-muted px-6 py-10 text-left"
              >
                <UIcon name="lucide:video-off" class="size-6 text-muted" aria-hidden="true" />
                <div>
                  <p class="text-sm font-semibold">Chưa có video phổ biến</p>
                  <p class="text-sm text-muted">
                    Mở trang Explore để xem toàn bộ video đang có trong hệ thống.
                  </p>
                </div>
                <UButton to="/explore" label="Đi tới Explore" trailing-icon="lucide:arrow-right" />
              </div>
            </div>
          </template>
        </UPageSection>
      </Motion>
    </section>

    <Motion
      :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
      :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
      :transition="{ duration: 0.5, ease: 'easeInOut' }"
      :in-view-options="{ once: true }"
    >
      <UPageSection
        id="features"
        headline="Tính năng"
        title="Mọi thứ bạn cần để luyện nghe hiệu quả"
        description="Công cụ luyện nghe chép chính tả tiếng Anh mạnh mẽ, giúp bạn cải thiện kỹ năng nghe một cách hiệu quả nhất"
        :features="features"
      />
    </Motion>

    <div class="relative overflow-hidden py-8">
      <!-- Decorative glow -->
      <div
        class="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/4 blur-3xl"
        aria-hidden="true"
      />

      <Motion
        :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
        :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
        :transition="{ duration: 0.5, ease: 'easeInOut' }"
        :in-view-options="{ once: true }"
      >
        <UPageSection
          id="how-to-use"
          headline="Cách sử dụng"
          title="Bắt đầu luyện nghe chỉ trong 6 bước"
          description="Quy trình luyện nghe chép chính tả đơn giản, hiệu quả"
        >
          <template #body>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <UPageCard
                v-for="(step, index) in howToUseSteps"
                :key="step.title"
                variant="outline"
                class="group"
                spotlight
              >
                <template #leading>
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-8 items-center justify-center rounded-full border border-dashed border-primary/60 text-sm font-bold text-primary"
                    >
                      {{ String(index + 1).padStart(2, "0") }}
                    </div>
                    <div class="flex size-10 items-center justify-center rounded-lg bg-primary/15">
                      <UIcon :name="step.icon" class="size-5 text-primary" />
                    </div>
                  </div>
                </template>
                <template #title>{{ step.title }}</template>
                <template #description>
                  <p class="mb-3">{{ step.description }}</p>
                  <ul class="space-y-1.5">
                    <li
                      v-for="point in step.points"
                      :key="point"
                      class="flex items-start gap-2 text-sm text-muted"
                    >
                      <UIcon name="lucide:check" class="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{{ point }}</span>
                    </li>
                  </ul>
                </template>
              </UPageCard>
            </div>
          </template>
        </UPageSection>
      </Motion>
    </div>

    <Motion
      :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
      :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
      :transition="{ duration: 0.5, ease: 'easeInOut' }"
      :in-view-options="{ once: true }"
    >
      <UPageSection
        id="faq"
        headline="FAQ"
        title="Câu hỏi thường gặp"
        description="Giải đáp các thắc mắc thường gặp về NgheGo"
      >
        <template #body>
          <UAccordion :items="faqItems" class="mx-auto max-w-3xl" />
        </template>
      </UPageSection>
    </Motion>

    <div class="light:bg-primary-200/20 dark:bg-primary-950/50">
      <Motion
        :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
        :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
        :transition="{ duration: 0.5, ease: 'easeInOut' }"
        :in-view-options="{ once: true }"
      >
        <div class="relative overflow-hidden">
          <UPageCTA
            title="Sẵn sàng luyện nghe ngay?"
            description="Dán link YouTube yêu thích và bắt đầu cải thiện kỹ năng nghe tiếng Anh của bạn ngay hôm nay"
            variant="naked"
            :links="ctaLinks"
            class="relative z-10"
          />
        </div>
      </Motion>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem, PageFeatureProps } from "@nuxt/ui";
import type { HowToUseStep } from "~/types/home";

const { origin } = useRequestURL();

useSeoMeta({
  title: "Luyện nghe tiếng Anh",
  description:
    "NgheGo - Công cụ luyện nghe chép chính tả tiếng Anh miễn phí với video YouTube. Cải thiện kỹ năng nghe tiếng Anh qua AI transcription chính xác, phản hồi tức thì.",
  ogTitle: "Luyện nghe tiếng Anh - NgheGo",
  ogDescription:
    "NgheGo - Công cụ luyện nghe chép chính tả tiếng Anh miễn phí với video YouTube. Cải thiện kỹ năng nghe tiếng Anh qua AI transcription chính xác, phản hồi tức thì.",
  ogUrl: origin,
  ogImage: `${origin}/images/logo.svg`,
  twitterTitle: "Luyện nghe tiếng Anh - NgheGo",
  twitterDescription:
    "NgheGo - Công cụ luyện nghe chép chính tả tiếng Anh miễn phí với video YouTube.",
  twitterImage: `${origin}/images/logo.svg`,
});

const videoUrl = ref("");
const heroRef = useTemplateRef("heroRef");
const colorMode = useColorMode();

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
  learnedCount: number;
}

interface VideoIndexResponse {
  videos: ApiVideo[];
  total: number;
}

const { data: popularVideosResponse, pending: popularVideosPending } =
  await useFetch<VideoIndexResponse>("/api/video", {
    query: {
      sort: "learned",
      limit: 6,
    },
  });

const popularVideos = computed(() => popularVideosResponse.value?.videos ?? []);

const auroraColors = computed(() => {
  return colorMode.value === "dark"
    ? [
        "var(--color-primary-100)",
        "var(--color-primary-200)",
        "var(--color-primary-300)",
        "var(--color-primary-400)",
      ]
    : [
        "var(--color-primary-900)",
        "var(--color-primary-800)",
        "var(--color-primary-700)",
        "var(--color-primary-600)",
      ];
});

const features: PageFeatureProps[] = [
  {
    icon: "lucide:youtube",
    title: "Video YouTube yêu thích",
    description: "Luyện nghe với bất kỳ video YouTube nào bạn thích",
  },
  {
    icon: "lucide:sparkles",
    title: "Transcription AI chính xác",
    description: "AI tạo bản chép lời chính xác cao cho mọi video",
  },
  {
    icon: "lucide:align-left",
    title: "Luyện từng câu",
    description: "Chia video thành từng câu để tập trung luyện nghe",
  },
  {
    icon: "lucide:circle-check",
    title: "Phản hồi tức thì",
    description: "So sánh kết quả với bản gốc, xem lỗi sai ngay lập tức",
  },
  {
    icon: "lucide:trending-up",
    title: "Theo dõi tiến trình",
    description: "Thống kê chi tiết giúp bạn cải thiện mỗi ngày",
  },
  {
    icon: "lucide:gift",
    title: "Hoàn toàn miễn phí",
    description: "Không giới hạn, không phí ẩn, dùng thoải mái",
  },
];

const howToUseSteps: HowToUseStep[] = [
  {
    icon: "lucide:search",
    title: "Tìm video bạn thích",
    description: "Chọn nội dung yêu thích để việc học thú vị hơn",
    points: [
      "Tìm video YouTube phù hợp với sở thích của bạn",
      "Học từ podcast, TED Talk, vlog, phim hoặc tin tức",
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:link",
    title: "Dán link YouTube",
    description: "Thêm video vào NgheGo chỉ trong vài giây",
    points: [
      "Dán URL video YouTube vào ô nhập liệu",
      "Hệ thống tự động tải video và chuẩn bị audio",
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:sparkles",
    title: "AI tạo transcript",
    description: "Hệ thống tự động tạo bản chép lời chính xác",
    points: [
      "AI xử lý và tạo transcript chất lượng cao",
      "Hỗ trợ nhiều accent tiếng Anh khác nhau",
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:headphones",
    title: "Nghe & gõ lại",
    description: "Nghe từng câu và gõ lại những gì bạn nghe được",
    points: ["Nghe các đoạn audio ngắn, rõ ràng", "Gõ lại từng từ ngay trên trình duyệt"],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:circle-check",
    title: "Nhận phản hồi tức thì",
    description: "So sánh với transcript và sửa lỗi ngay",
    points: ["Tìm những chỗ bỏ sót trong bài nghe", "Sửa lỗi từng dòng trước khi chuyển câu tiếp"],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:trending-up",
    title: "Theo dõi tiến độ",
    description: "Xem thống kê chi tiết và cải thiện mỗi ngày",
    points: [
      "Xem điểm Accuracy cho từng câu luyện tập",
      "Thống kê giúp bạn cải thiện kỹ năng nghe",
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const ctaLinks = [
  {
    label: "Bắt đầu luyện nghe",
    trailingIcon: "lucide:play",
    size: "lg" as const,
    onClick: scrollToHero,
  },
];

const faqItems = ref<AccordionItem[]>([
  {
    label: "NgheGo là gì?",
    content:
      "NgheGo là công cụ luyện nghe chép chính tả tiếng Anh miễn phí, sử dụng video YouTube và AI để tạo bản transcript chính xác, giúp bạn cải thiện kỹ năng nghe hiệu quả.",
  },
  {
    label: "NgheGo có miễn phí không?",
    content:
      "Hoàn toàn miễn phí! Không giới hạn số lượng video luyện tập, không phí ẩn, bạn có thể sử dụng thoải mái mọi tính năng.",
  },
  {
    label: "Tôi có cần đăng ký tài khoản không?",
    content:
      "Bạn có thể luyện nghe ngay mà không cần đăng ký. Tuy nhiên, đăng nhập bằng Google giúp lưu tiến trình và theo dõi quá trình học của bạn.",
  },
  {
    label: "NgheGo hỗ trợ ngôn ngữ nào?",
    content:
      "Hiện tại NgheGo tập trung vào luyện nghe tiếng Anh với nhiều accent khác nhau. Chúng tôi sẽ hỗ trợ thêm ngôn ngữ trong tương lai.",
  },
  {
    label: "Làm sao để bắt đầu luyện nghe?",
    content:
      "Chỉ cần dán link YouTube vào ô nhập liệu trên trang chủ và nhấn 'Bắt đầu'. Hệ thống sẽ tự động xử lý và chuẩn bị bài luyện tập cho bạn. Bạn cũng có thể bấm vào mục 'Khám phá' để xem các video có sẵn và bắt đầu luyện tập ngay.",
  },
  {
    label: "Tôi có thể luyện nghe với video bất kỳ không?",
    content:
      "Bạn có thể luyện nghe với hầu hết video YouTube có phụ đề hoặc audio rõ ràng. Một số video có bản quyền đặc biệt có thể không hỗ trợ.",
  },
]);

function scrollToHero() {
  if (heroRef.value) {
    const el = heroRef.value.$el;
    el.scrollIntoView({ behavior: "smooth" });
    const firstFocusable = el.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus({ preventScroll: true });
    }
  }
}

function handleStart() {
  if (!videoUrl.value) return;

  const youtubeId = new URL(videoUrl.value).searchParams.get("v");

  navigateTo({
    path: `/practice/${youtubeId}`,
  });
}

function formatDuration(durationSeconds: number) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:
${String(seconds).padStart(2, "0")}`;
}

function formatLearnedCount(count: number) {
  return new Intl.NumberFormat("vi-VN").format(count);
}
</script>
