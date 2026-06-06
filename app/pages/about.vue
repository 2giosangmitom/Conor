<template>
  <div>
    <!-- Mission -->
    <div class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/3 blur-3xl"
        aria-hidden="true"
      />
      <Motion
        :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
        :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
        :transition="{ duration: 0.5, ease: 'easeInOut' }"
        :in-view-options="{ once: true }"
      >
        <UPageSection
          headline=""
          title="Tại sao Conor tồn tại?"
          description="Kỹ năng nghe là rào cản lớn nhất với người học tiếng Anh tại Việt Nam. Chúng tôi tin rằng cách học hiệu quả nhất là luyện tập với nội dung thực tế, không phải bài tập giả tạo."
        >
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <UPageCard
                v-for="value in coreValues"
                :key="value.title"
                variant="outline"
                spotlight
                spotlight-color="primary"
                :ui="{ wrapper: 'items-center text-center', leading: 'mb-3' }"
              >
                <template #leading>
                  <div
                    class="size-12 rounded-xl flex items-center justify-center mx-auto"
                    :class="value.bgColor"
                  >
                    <UIcon :name="value.icon" :class="value.color" class="size-6" />
                  </div>
                </template>
                <template #title>{{ value.title }}</template>
                <template #description>{{ value.description }}</template>
              </UPageCard>
            </div>
          </template>
        </UPageSection>
      </Motion>
    </div>

    <!-- Story -->
    <Motion
      :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
      :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
      :transition="{ duration: 0.5, ease: 'easeInOut' }"
      :in-view-options="{ once: true }"
    >
      <UPageSection headline="" title="Conor bắt đầu như thế nào?">
        <template #body>
          <div class="max-w-3xl mx-auto space-y-6 text-base leading-relaxed">
            <p>
              Conor bắt đầu từ một vấn đề quen thuộc: Dù học tiếng Anh nhiều năm, nhiều người vẫn
              không thể nghe hiểu khi xem phim, nghe podcast hay nói chuyện với người bản ngữ. Lý do
              không phải thiếu từ vựng hay ngữ pháp mà là thiếu luyện tập nghe thực tế.
            </p>
            <p>
              Các ứng dụng học tiếng Anh truyền thống thường dùng nội dung nhân tạo, không phản ánh
              cách người thật nói chuyện. Trong khi đó, YouTube có hàng tỷ video với tiếng Anh tự
              nhiên, đa dạng accent nhưng không có công cụ nào giúp bạn luyện nghe chép chính tả với
              chúng một cách có hệ thống.
            </p>
            <p>
              Conor lấp đầy khoảng trống đó. Chúng tôi kết hợp AI transcription với giao diện luyện
              tập từng câu, giúp bạn nghe đi nghe lại, gõ lại những gì nghe được và nhận phản hồi
              tức thì với video YouTube bạn tự chọn.
            </p>
          </div>
        </template>
      </UPageSection>
    </Motion>

    <!-- How it works recap -->
    <div class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/3 blur-3xl"
        aria-hidden="true"
      />
      <Motion
        :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
        :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
        :transition="{ duration: 0.5, ease: 'easeInOut' }"
        :in-view-options="{ once: true }"
      >
        <UPageSection
          headline=""
          title="Học bằng cách làm — không phải ghi nhớ"
          description="Phương pháp dictation được chứng minh là cách hiệu quả nhất để cải thiện kỹ năng nghe và phát âm."
        >
          <template #body>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <UPageCard
                v-for="method in methodology"
                :key="method.title"
                variant="outline"
                spotlight
              >
                <template #leading>
                  <div
                    class="size-10 rounded-lg flex items-center justify-center"
                    :class="method.bgColor"
                  >
                    <UIcon :name="method.icon" :class="method.color" class="size-5" />
                  </div>
                </template>
                <template #title>{{ method.title }}</template>
                <template #description>{{ method.description }}</template>
              </UPageCard>
            </div>
          </template>
        </UPageSection>
      </Motion>
    </div>

    <!-- Team -->
    <Motion
      :initial="{ opacity: 0, filter: 'blur(5px)', y: 10 }"
      :while-in-view="{ opacity: 1, filter: 'blur(0px)', y: 0 }"
      :transition="{ duration: 0.5, ease: 'easeInOut' }"
      :in-view-options="{ once: true }"
    >
      <UPageSection
        headline=""
        title="Những người xây dựng Conor"
        description="Nhóm nhỏ đam mê giáo dục và công nghệ, cùng nhau tạo ra công cụ học tiếng Anh tốt hơn cho người Việt."
      >
        <template #body>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <UPageCard
              v-for="member in teamMembers"
              :key="member.name"
              variant="outline"
              spotlight
              spotlight-color="primary"
              class="py-8"
              :ui="{ wrapper: 'items-center text-center', leading: 'mb-5' }"
            >
              <template #leading>
                <NuxtImg
                  :src="member.avatar"
                  :alt="member.name"
                  class="size-40 rounded-full object-cover object-center ring-4 ring-primary/20"
                />
              </template>
              <template #title>
                <span class="text-xl">{{ member.name }}</span>
              </template>
              <template #description>
                <div class="space-y-3">
                  <UBadge variant="soft" color="primary">{{ member.role }}</UBadge>
                  <p class="text-sm text-muted leading-relaxed">{{ member.bio }}</p>
                </div>
              </template>
            </UPageCard>
          </div>
        </template>
      </UPageSection>
    </Motion>
  </div>
</template>

<script setup lang="ts">
interface ValueItem {
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface MethodItem {
  icon: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

const { origin } = useRequestURL();

const colorMode = useColorMode();

useSeoMeta({
  title: "Về chúng tôi",
  description:
    "Conor giúp người Việt cải thiện kỹ năng nghe tiếng Anh thông qua luyện tập chép chính tả với video YouTube yêu thích, hoàn toàn miễn phí.",
  ogTitle: "Về chúng tôi - Conor",
  ogDescription:
    "Conor giúp người Việt cải thiện kỹ năng nghe tiếng Anh thông qua luyện tập chép chính tả với video YouTube yêu thích, hoàn toàn miễn phí.",
  ogUrl: `${origin}/about`,
  ogImage: `${origin}/images/logo.svg`,
  twitterTitle: "Về chúng tôi - Conor",
  twitterDescription:
    "Conor giúp người Việt cải thiện kỹ năng nghe tiếng Anh thông qua luyện tập chép chính tả với video YouTube yêu thích.",
  twitterImage: `${origin}/images/logo.svg`,
});

const coreValues: ValueItem[] = [
  {
    icon: "lucide:gift",
    title: "Hoàn toàn miễn phí",
    description:
      "Không giới hạn, không phí ẩn. Mọi tính năng đều mở cho tất cả người dùng mà không cần trả tiền.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:sparkles",
    title: "Công nghệ AI",
    description:
      "AI transcription chính xác cao giúp tạo bản chép lời cho bất kỳ video YouTube nào, hỗ trợ nhiều accent khác nhau.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:users",
    title: "Cộng đồng người học",
    description:
      "Cùng học với hàng trăm người dùng khác, khám phá video được cộng đồng luyện tập nhiều nhất.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const methodology: MethodItem[] = [
  {
    icon: "lucide:ear",
    title: "Nghe chủ động",
    description:
      "Thay vì nghe thụ động, bạn buộc phải tập trung vào từng âm tiết để gõ lại chính xác — não bộ ghi nhớ sâu hơn nhiều.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:repeat",
    title: "Lặp lại có chủ đích",
    description:
      "Nghe lại những câu khó nhiều lần cho đến khi hiểu rõ, thay vì bỏ qua và tiếp tục như khi xem video thông thường.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:circle-check",
    title: "Phản hồi tức thì",
    description:
      "So sánh kết quả với transcript gốc ngay lập tức, nhận biết lỗi sai và điều chỉnh cách nghe của mình.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: "lucide:trending-up",
    title: "Tiến bộ đo lường được",
    description:
      "Điểm Accuracy cho từng câu giúp bạn thấy rõ mình đang tiến bộ ở đâu và cần cải thiện điều gì.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const teamMembers = computed<TeamMember[]>(() => [
  {
    name: "Võ Văn Duy",
    role: "Vibe Designer/Vibe Coder",
    bio: "Thiết kế giao diện trực quan và thân thiện, giúp việc luyện nghe trở nên dễ dàng và thú vị hơn.",
    avatar: "/images/nstcrystal.jpg",
  },
  {
    name: "Võ Quang Chiến",
    role: "Founder/Vibe Coder",
    bio: "Đam mê về công nghệ. Xây dựng Conor để giải quyết vấn đề nghe tiếng Anh mà chính mình từng gặp phải.",
    avatar: "/images/2giosangmitom.png",
  },
  {
    name: "Nguyễn Gia Hưng",
    role: "Tester",
    bio: "Tìm hiểu và phân tích các thông tin, kiểm tra tính hoàn thiện và báo cáo các vấn đề của web.",
    avatar: "/images/Ghung862.png",
  },
  {
    name: "GitHub Copilot",
    role: "Senior Full-stack Developer",
    bio: "Trợ lý lập trình AI của GitHub, hỗ trợ gợi ý code, hoàn thiện hàm và giải thích logic trong suốt quá trình phát triển Conor.",
    avatar: colorMode.value === "dark" ? "/images/copilot-dark.png" : "/images/copilot.png",
  },
  {
    name: "Kiro AI",
    role: "Senior Full-stack Developer",
    bio: "IDE AI của AWS, hỗ trợ spec-driven development. Từ yêu cầu đến thiết kế đến triển khai giúp đội nhóm làm việc có cấu trúc hơn.",
    avatar: "/images/kiro.jpg",
  },
  {
    name: "OpenCode",
    role: "Senior Full-stack Developer",
    bio: "Coding agent mã nguồn mở chạy trên terminal, hỗ trợ nhiều model AI khác nhau, giúp tự động hóa các tác vụ lập trình lặp đi lặp lại.",
    avatar: colorMode.value === "dark" ? "/images/opencode-dark.png" : "/images/opencode.png",
  },
]);
</script>
