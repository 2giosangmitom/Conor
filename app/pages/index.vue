<template>
  <UMain class="relative overflow-hidden">
    <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
      <UPageHero
        description="Làm chủ kỹ năng nghe và chính tả với nội dung YouTube yêu thích của bạn. Luyện tập tiếng Anh đời thực với độ chính xác cao."
      >
        <template #title>
          <span class="flex flex-col items-center gap-4">
            <UBadge class="tracking-normal" variant="soft" icon="lucide:badge-check">
              Hoàn toàn miễn phí
            </UBadge>
            <ClientOnly>
              <UiAuroraText :colors="auroraColors">
                Luyện nghe chép chính tả Tiếng Anh với video bạn yêu thích
              </UiAuroraText>
              <template #fallback>
                <span class="text-4xl font-bold sm:text-5xl lg:text-6xl">
                  Luyện nghe chép chính tả Tiếng Anh với video bạn yêu thích
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

    <div class="bg-elevated">
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

    <UiBlurReveal :duration="0.5" :stagger-delay="0.3" blur="5px">
      <UiStarsBg class="min-h-150" star-color="var(--color-secondary)">
        <UPageSection
          id="features"
          headline="Tính năng"
          title="Mọi thứ bạn cần để luyện nghe hiệu quả"
          description="Công cụ luyện nghe chép chính tả tiếng Anh mạnh mẽ, giúp bạn cải thiện kỹ năng nghe một cách hiệu quả nhất"
          :features="features"
        />
      </UiStarsBg>
    </UiBlurReveal>

    <div class="bg-elevated">
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
  </UMain>
</template>

<script setup lang="ts">
import type { PageFeatureProps } from "@nuxt/ui";

const videoUrl = ref("");
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

interface Stat {
  icon: string;
  value: number;
  label: string;
  color: string;
  bgColor: string;
}

interface HowToUseStep {
  icon: string;
  title: string;
  description: string;
  points: string[];
  color: string;
  bgColor: string;
}

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

function handleStart() {
  if (!videoUrl.value) return;

  const youtubeId = new URL(videoUrl.value).searchParams.get("v");

  navigateTo({
    path: `/practice/${youtubeId}`,
  });
}
</script>
