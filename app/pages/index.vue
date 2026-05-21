<template>
  <UMain>
    <ClientOnly>
      <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
        <UPageHero
          ref="heroRef"
          description="Làm chủ kỹ năng nghe và chính tả với nội dung YouTube yêu thích của bạn. Luyện tập tiếng Anh với độ chính xác cao."
        >
          <template #title>
            <span class="flex flex-col items-center gap-4">
              <UBadge class="tracking-normal" variant="soft" icon="lucide:badge-check">
                Hoàn toàn miễn phí
              </UBadge>
              <ClientOnly>
                <UiAuroraText :colors="auroraColors">
                  Luyện nghe gõ chính tả Tiếng Anh với video bạn yêu thích
                </UiAuroraText>
                <template #fallback>
                  <span class="text-4xl font-bold sm:text-5xl lg:text-6xl">
                    Luyện nghe gõ chính tả Tiếng Anh với video bạn yêu thích
                  </span>
                </template>
              </ClientOnly>
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
      </UiBlurReveal>
    </ClientOnly>

    <ClientOnly>
      <div class="bg-muted">
        <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
          <UPageSection
            id="stats"
            title="Được tin tưởng bởi cộng đồng người học"
            description="Tham gia cùng hàng trăm người học đang cải thiện kỹ năng nghe tiếng Anh mỗi ngày"
          >
            <template #body>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <UPageCard
                  v-for="stat in stats"
                  :key="stat.label"
                  variant="outline"
                  spotlight
                  spotlight-color="primary"
                  class="group"
                  :ui="{ wrapper: 'items-center text-center', leading: 'mb-3' }"
                >
                  <template #leading>
                    <div
                      class="size-10 rounded-lg flex items-center justify-center"
                      :class="stat.bgColor"
                    >
                      <UIcon :name="stat.icon" :class="stat.color" class="size-5" />
                    </div>
                  </template>
                  <template #title>
                    <div class="flex items-center justify-center gap-1">
                      <ClientOnly>
                        <UiNumberTicker
                          :value="stat.value"
                          :decimal-places="0"
                          class="text-2xl font-bold"
                        />
                        <template #fallback>
                          <span class="text-2xl font-bold">{{ stat.value }}</span>
                        </template>
                      </ClientOnly>
                      <span class="text-2xl font-bold">+</span>
                    </div>
                  </template>
                  <template #description>
                    {{ stat.label }}
                  </template>
                </UPageCard>
              </div>
            </template>
          </UPageSection>
        </UiBlurReveal>
      </div>
    </ClientOnly>

    <ClientOnly v-if="trendingVideos.length">
      <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
        <UPageSection
          id="trending"
          headline="Thịnh hành"
          title="Video được luyện tập nhiều nhất"
          description="Khám phá những video YouTube đang được cộng đồng luyện nghe nhiều nhất trong 30 ngày qua"
        >
          <template #body>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <UPageCard
                v-for="video in trendingVideos"
                :key="video.id"
                :to="`/practice/${video.youtubeId}`"
                variant="outline"
                spotlight
                spotlight-color="primary"
                class="group cursor-pointer"
              >
                <template #header>
                  <div class="relative overflow-hidden rounded-t-lg">
                    <NuxtImg
                      :src="video.thumbnailUrl"
                      :alt="video.title"
                      class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded"
                    >
                      {{ formatDuration(video.duration) }}
                    </div>
                  </div>
                </template>
                <template #title>
                  <span class="line-clamp-2">{{ video.title }}</span>
                </template>
                <template #description>
                  <div class="flex items-center gap-2 flex-wrap">
                    <UBadge variant="soft" size="sm">{{ video.topic }}</UBadge>
                    <UBadge variant="outline" size="sm">{{ video.level }}</UBadge>
                    <span class="flex items-center gap-1 text-xs text-muted ml-auto">
                      <UIcon name="lucide:headphones" class="size-3.5" />
                      {{ video.practiceCount }} lượt luyện
                    </span>
                  </div>
                </template>
              </UPageCard>
            </div>
          </template>
        </UPageSection>
      </UiBlurReveal>
    </ClientOnly>

    <ClientOnly>
      <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
        <UiStarsBg>
          <UPageSection
            id="features"
            headline="Tính năng"
            title="Mọi thứ bạn cần để luyện nghe hiệu quả"
            description="Công cụ luyện nghe chép chính tả tiếng Anh mạnh mẽ, giúp bạn cải thiện kỹ năng nghe một cách hiệu quả nhất"
            :features="features"
          />
        </UiStarsBg>
      </UiBlurReveal>
    </ClientOnly>

    <ClientOnly>
      <div class="bg-muted">
        <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
          <UPageSection
            id="how-to-use"
            headline="Cách sử dụng"
            title="Bắt đầu luyện nghe chỉ trong 5 bước"
            description="Quy trình luyện nghe chép chính tả đơn giản, hiệu quả"
          >
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        class="flex items-center justify-center size-8 rounded-full border border-dashed border-primary text-primary text-sm font-bold"
                      >
                        {{ String(index + 1).padStart(2, "0") }}
                      </div>
                      <div
                        class="size-10 rounded-lg flex items-center justify-center"
                        :class="step.bgColor"
                      >
                        <UIcon :name="step.icon" :class="step.color" class="size-5" />
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
                        <UIcon name="lucide:check" class="size-4 text-primary shrink-0 mt-0.5" />
                        <span>{{ point }}</span>
                      </li>
                    </ul>
                  </template>
                </UPageCard>
              </div>
            </template>
          </UPageSection>
        </UiBlurReveal>
      </div>
    </ClientOnly>

    <ClientOnly>
      <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
        <UPageSection
          id="faq"
          headline="FAQ"
          title="Câu hỏi thường gặp"
          description="Giải đáp các thắc mắc thường gặp về NgheGo"
        >
          <template #body>
            <UAccordion :items="faqItems" class="max-w-3xl mx-auto" />
          </template>
        </UPageSection>
      </UiBlurReveal>
    </ClientOnly>

    <ClientOnly>
      <UiStarsBg>
        <div class="light:bg-primary-200/20 dark:bg-primary-950/50">
          <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
            <div class="relative overflow-hidden">
              <UPageCTA
                title="Sẵn sàng luyện nghe ngay?"
                description="Dán link YouTube yêu thích và bắt đầu cải thiện kỹ năng nghe tiếng Anh của bạn ngay hôm nay"
                variant="naked"
                :links="ctaLinks"
                class="relative z-10"
              />
            </div>
          </UiBlurReveal>
        </div>
      </UiStarsBg>
    </ClientOnly>
  </UMain>
</template>

<script setup lang="ts">
import type { PageFeatureProps, AccordionItem } from "@nuxt/ui";
import type { TrendingVideo, Stat, HowToUseStep } from "~/types/home";

const videoUrl = ref("");
const heroRef = useTemplateRef("heroRef");
const colorMode = useColorMode();

const { data: trendingData } = await useFetch<{ videos: TrendingVideo[] }>("/api/video", {
  query: {
    sort: "trending",
    period: "30d",
    limit: 6,
  },
});

const trendingVideos = computed(() => trendingData.value?.videos ?? []);

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const auroraColors = computed(() => {
  return colorMode.value === "dark"
    ? [
        "var(--color-primary-100)",
        "var(--color-primary-200)",
        "var(--color-primary-300)",
        "var(--color-primary-400)",
      ]
    : [
        "var(--color-primary-800)",
        "var(--color-primary-700)",
        "var(--color-primary-600)",
        "var(--color-primary-500)",
      ];
});

const stats: Stat[] = [
  {
    icon: "lucide:users",
    value: 500,
    label: "Người dùng",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:video",
    value: 100,
    label: "Video",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:clock-check",
    value: 200,
    label: "Thành viên hoạt động mỗi ngày",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

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
    icon: "lucide:link",
    title: "Dán link YouTube",
    description: "Chọn video YouTube bạn muốn luyện nghe",
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
    title: "Kiểm tra & sửa lỗi",
    description: "So sánh với transcript và sửa lỗi ngay",
    points: ["Tìm những chỗ bỏ sót trong bài nghe", "Sửa lỗi từng dòng trước khi chuyển câu tiếp"],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:trending-up",
    title: "Theo dõi tiến trình",
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
      "Chỉ cần dán link YouTube vào ô nhập liệu trên trang chủ và nhấn 'Bắt đầu'. Hệ thống sẽ tự động xử lý và chuẩn bị bài luyện tập cho bạn.",
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
  }
}

function handleStart() {
  if (!videoUrl.value) return;

  const youtubeId = new URL(videoUrl.value).searchParams.get("v");

  navigateTo({
    path: `/practice/${youtubeId}`,
  });
}
</script>
