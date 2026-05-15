<template>
  <div>
    <UPageHero
      headline="Miễn phí 100% · Không cần đăng nhập"
      title="Luyện nghe chép chính tả tiếng Anh từ video YouTube"
      description="Web luyện nghe chép chính tả tiếng Anh theo cấp độ, phụ đề song ngữ và phản hồi tức thì."
    >
      <template #footer>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <UInput
              v-model="youtubeUrl"
              icon="i-lucide-youtube"
              placeholder="Dán link YouTube vào đây..."
              aria-label="Dán link YouTube"
              size="lg"
              class="w-full"
            />
            <UButton label="Bắt đầu" size="lg" trailing-icon="i-lucide-arrow-right" />
          </div>
          <div class="flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-lucide-info" class="h-4 w-4" />
            <span>Không cần tài khoản để bắt đầu học.</span>
          </div>
        </div>
      </template>

      <template #bottom>
        <UPageLogos title="Được tin dùng bởi cộng đồng học tiếng Anh" :items="logoItems" />
      </template>
    </UPageHero>

    <UPageSection
      id="explore"
      headline="Video nổi bật"
      title="Video YouTube dictation được học nhiều nhất"
      description="Chọn nhanh video phổ biến và bắt đầu luyện ngay."
      :links="exploreLinks"
    >
      <UPageGrid>
        <UPageCard
          v-for="video in videos"
          :key="video.title"
          :title="video.title"
          :description="video.description"
          :to="video.to"
          variant="outline"
          highlight
          :spotlight="spotlightEnabled"
        >
          <NuxtImg
            :src="video.thumbnail"
            :alt="video.title"
            class="w-full rounded-lg"
            loading="lazy"
          />
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="features"
      headline="Tính năng"
      title="Tính năng web nghe chép chính tả tiếng Anh"
      description="Luyện nghe đúng trọng tâm với các công cụ được tối ưu cho dictation."
    >
      <UPageGrid>
        <UPageCard
          v-for="feature in featureCards"
          :key="feature.title"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
          variant="outline"
          highlight
          :spotlight="spotlightEnabled"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection
      id="how-it-works"
      headline="Cách dùng"
      title="Cách dùng YouTube dictation để luyện nghe"
      description="Làm theo từng bước để luyện nghe chép chính tả hiệu quả."
    >
      <UPageList as="ul" divide class="list-none">
        <li v-for="step in steps" :key="step.title">
          <UCard>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
              <NuxtImg
                :src="step.image"
                :alt="step.title"
                class="w-full sm:w-40 rounded-lg"
                loading="lazy"
              />
              <div class="flex flex-col gap-2">
                <p class="text-sm text-muted">{{ step.label }}</p>
                <h3 class="text-lg font-semibold">{{ step.title }}</h3>
                <p class="text-sm text-muted">{{ step.description }}</p>
                <ul class="text-sm text-muted list-disc pl-5">
                  <li v-for="item in step.points" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </UCard>
        </li>
      </UPageList>
    </UPageSection>

    <UPageSection
      id="research"
      headline="Nghiên cứu"
      title="Vì sao luyện chép chính tả hiệu quả"
      description="Các nghiên cứu và chuyên gia cho thấy dictation cải thiện kỹ năng nghe và viết rõ rệt."
    >
      <UPageGrid>
        <UPageCard
          v-for="research in researchCards"
          :key="research.title"
          :title="research.title"
          :description="research.description"
          :to="research.to"
          :target="research.target"
          variant="outline"
          highlight
          :spotlight="spotlightEnabled"
        />
      </UPageGrid>
    </UPageSection>

    <UPageSection id="faq" headline="FAQ" title="Hỏi đáp về YouTube dictation">
      <UAccordion :items="faqItems" />
    </UPageSection>

    <UPageSection>
      <div class="relative overflow-hidden">
        <UPageCTA
          title="Bắt đầu nghe chép chính tả tiếng Anh trên YouTube ngay"
          description="Không cần cài đặt, chỉ cần dán link video và bắt đầu luyện tập."
          :links="ctaLinks"
          variant="soft"
        />
        <ClientOnly>
          <UiParticlesBg
            class="pointer-events-none absolute inset-0 -z-10 opacity-70"
            :quantity="120"
          />
        </ClientOnly>
      </div>
    </UPageSection>
  </div>
</template>

<script setup lang="ts">
import type { AccordionItem, ButtonProps } from "@nuxt/ui";

useHead({
  title: "Luyện nghe tiếng Anh miễn phí qua YouTube",
  meta: [
    {
      name: "description",
      content:
        "NgheGo - Luyện nghe chép chính tả tiếng Anh từ video YouTube miễn phí. Cải thiện listening, vocabulary và phản xạ tiếng Anh bằng video thực tế.",
    },
  ],
});

const youtubeUrl = ref("");
const spotlightEnabled = ref(false);

onMounted(() => {
  spotlightEnabled.value = true;
});

const exploreLinks: ButtonProps[] = [
  {
    label: "Xem video khác",
    variant: "ghost",
    trailingIcon: "i-lucide-chevron-right",
  },
];

const ctaLinks: ButtonProps[] = [
  {
    label: "Bắt đầu ngay",
    to: "/signup",
  },
  {
    label: "Xem hướng dẫn",
    to: "#how-it-works",
    variant: "outline",
    color: "neutral",
  },
];

const logoItems = [
  "i-lucide-youtube",
  "i-lucide-headphones",
  "i-lucide-play",
  "i-lucide-book-open",
  "i-lucide-sparkles",
  "i-lucide-globe",
];

const videos = [
  {
    title: "Chapter 2 Damn My Worldview Is Cracking",
    description: "Luyện nghe chép chính tả tiếng Anh trên YouTube với video nổi bật này.",
    thumbnail: "https://i.ytimg.com/vi/o63qeyJQKjU/hqdefault.jpg",
    to: "#",
  },
  {
    title: "Learn Blockchain, Solidity, and Full Stack Web3 Development",
    description: "Bài luyện dictation theo cấp độ B1 dành cho người học trung cấp.",
    thumbnail: "https://i.ytimg.com/vi/gyMwXuJrbJQ/hqdefault.jpg",
    to: "#",
  },
  {
    title: "Hayley Williams on the State of Paramore",
    description: "Luyện dictation giải trí với giọng US tự nhiên.",
    thumbnail: "https://i.ytimg.com/vi/fN5rvIvjpnc/hqdefault.jpg",
    to: "#",
  },
  {
    title: "Meet the heart! | Circulatory system physiology",
    description: "Video giáo dục ngắn phù hợp cho luyện nghe mỗi ngày.",
    thumbnail: "https://i.ytimg.com/vi/Vi1JK6IYVt8/hqdefault.jpg",
    to: "#",
  },
  {
    title: "Alec Benjamin - Let Me Down Slowly",
    description: "Dictation với âm nhạc để luyện nghe theo nhịp.",
    thumbnail: "https://i.ytimg.com/vi/50VNCymT-Cs/hqdefault.jpg",
    to: "#",
  },
  {
    title: "I learned to code from scratch in 1 year",
    description: "Bài luyện kỹ năng nghe chuyên đề công nghệ.",
    thumbnail: "https://i.ytimg.com/vi/NpUuuT_EzSs/hqdefault.jpg",
    to: "#",
  },
];

const featureCards = [
  {
    icon: "i-lucide-gauge",
    title: "Cấp độ chép chính tả linh hoạt",
    description:
      "Từ A1 cho người mới bắt đầu đến luyện nghe IELTS, mỗi bài tập luôn vừa sức nhưng đủ thử thách.",
  },
  {
    icon: "i-lucide-link",
    title: "Tự do chọn video luyện nghe",
    description:
      "Dán bất kỳ link YouTube nào để biến thành bài nghe chép chính tả bạn thật sự hứng thú.",
  },
  {
    icon: "i-lucide-captions",
    title: "Phụ đề song ngữ & bản chép lời",
    description: "Phụ đề đặt cạnh nhau giúp bạn đối chiếu nhanh với transcript gốc.",
  },
  {
    icon: "i-lucide-repeat-2",
    title: "Luyện từng câu, từng dòng",
    description: "Trình phát tách video thành đoạn ngắn để bạn lặp lại những câu khó.",
  },
  {
    icon: "i-lucide-badge-check",
    title: "Chấm điểm độ chính xác tức thì",
    description: "Phản hồi theo thời gian thực chỉ ra lỗi sai để bạn sửa ngay.",
  },
  {
    icon: "i-lucide-globe",
    title: "Thư viện accent đa dạng",
    description: "Khám phá giọng Anh–Anh, Anh–Mỹ, Úc và nhiều accent khác.",
  },
];

const steps = [
  {
    label: "01",
    title: "Chọn video YouTube",
    description: "Dán link video hoặc chọn từ thư viện có sẵn.",
    points: ["Dán URL hoặc chọn video luyện nghe tiếng Anh", "Chuẩn bị phụ đề tự động"],
    image: "https://cdn.fluentdictation.com/images/howto-step1.webp",
  },
  {
    label: "02",
    title: "Nghe tiếng Anh thật",
    description: "Luyện nghe với giọng nói thật và nhiều accent.",
    points: ["Nghe các đoạn audio YouTube ngắn", "Bắt nhịp điệu và ngữ điệu tự nhiên"],
    image: "https://cdn.fluentdictation.com/images/howto-step2.webp",
  },
  {
    label: "03",
    title: "Gõ những gì bạn nghe",
    description: "Gõ lại để luyện chép chính tả chính xác.",
    points: ["Gõ lại từng từ ngay trên trình duyệt", "Chú ý mạo từ và đuôi động từ"],
    image: "https://cdn.fluentdictation.com/images/howto-step3.webp",
  },
  {
    label: "04",
    title: "Kiểm tra & sửa lỗi",
    description: "So sánh với transcript và sửa lỗi ngay.",
    points: ["Tìm chỗ bỏ sót", "Sửa lỗi từng dòng"],
    image: "https://cdn.fluentdictation.com/images/howto-step4.webp",
  },
];

const researchCards = [
  {
    title: "“Noticing” giúp tăng độ chính xác",
    description: "So sánh bài chép chính tả với bản gốc giúp bạn nhận ra lỗi thường gặp.",
    to: "https://www.teachingenglish.org.uk/professional-development/teachers/knowing-subject/articles/using-dictation",
    target: "_blank",
  },
  {
    title: "Dictogloss giúp cải thiện kỹ năng viết",
    description: "Tái dựng văn bản giúp tăng cường kỹ năng nghe và độ chính xác khi viết.",
    to: "https://files.eric.ed.gov/fulltext/EJ1081435.pdf",
    target: "_blank",
  },
  {
    title: "Micro-dictation giúp giải mã âm thanh",
    description: "Luyện nghe từ dưới lên với các đoạn dictation ngắn.",
    to: "https://www.cambridge.org/elt/blog/2023/06/11/using-micro-dictations-to-help-students-notice-connected-speech/",
    target: "_blank",
  },
  {
    title: "Running dictation tăng động lực",
    description: "Kích hoạt nghe, nói, viết và ghi nhớ trong một bài tập.",
    to: "https://www.teachingenglish.org.uk/teaching-resources/teaching-secondary/activities/pre-intermediate-a2/running-dictation",
    target: "_blank",
  },
];

const faqItems: AccordionItem[] = [
  {
    label: "Làm sao bắt đầu nghe chép chính tả YouTube miễn phí?",
    content:
      "Chỉ cần dán URL, bấm bắt đầu và video sẽ trở thành bài tập YouTube dictation tương tác.",
  },
  {
    label: "Công cụ có hỗ trợ phụ đề song ngữ không?",
    content: "Có. Phụ đề song ngữ hiển thị dưới trình phát để đối chiếu nhanh.",
  },
  {
    label: "Chép chính tả có hữu ích cho luyện IELTS không?",
    content: "Có! Luyện dictation theo chủ đề authentic giúp cải thiện band IELTS listening.",
  },
  {
    label: "Làm sao luyện nhiều accent khác nhau?",
    content: "Lọc video theo accent hoặc khu vực, sau đó luyện theo hướng dẫn trên màn hình.",
  },
];
</script>
