<template>
  <section id="features" class="py-20" style="background: #f8f2fa">
    <UContainer :ui="{ base: 'max-w-7xl' }">
      <!-- Section header -->
      <div class="text-center mb-14 max-w-2xl mx-auto">
        <h2
          class="text-3xl font-semibold mb-3"
          style="font-family: &quot;Plus Jakarta Sans&quot;, sans-serif; color: #1d1b20"
        >
          Mọi thứ bạn cần để bứt phá kỹ năng Nghe
        </h2>
        <p
          class="text-base"
          style="color: #7a7582; font-family: &quot;Inter&quot;, sans-serif; line-height: 1.6"
        >
          Học bằng nội dung thực tế thay vì audio nhàm chán.
        </p>
      </div>

      <!-- Features grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <UCard
          v-for="feature in features"
          :key="feature.title"
          :ui="{
            root: 'rounded-3xl border border-slate-100 hover:-translate-y-1 transition-transform',
            body: 'p-6',
          }"
          style="
            background: white;
            box-shadow:
              0 10px 25px -5px rgba(0, 0, 0, 0.04),
              0 8px 10px -6px rgba(0, 0, 0, 0.04);
          "
        >
          <!-- Icon -->
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            :style="{ background: feature.iconBg }"
          >
            <UIcon :name="feature.icon" class="w-6 h-6" :style="{ color: feature.iconColor }" />
          </div>
          <!-- Title -->
          <h3
            class="font-semibold text-base mb-2"
            style="font-family: &quot;Plus Jakarta Sans&quot;, sans-serif; color: #1d1b20"
          >
            {{ feature.title }}
          </h3>
          <!-- Description -->
          <p
            class="text-sm leading-relaxed"
            style="color: #7a7582; font-family: &quot;Inter&quot;, sans-serif; line-height: 1.6"
          >
            {{ feature.description }}
          </p>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    icon: "i-lucide-youtube",
    iconBg: "rgba(239, 68, 68, 0.1)",
    iconColor: "#ef4444",
    title: "Practice with YouTube",
    description:
      "Luyện tập trực tiếp với hàng triệu video từ YouTube thuộc mọi chủ đề bạn yêu thích.",
  },
  {
    icon: "i-lucide-keyboard",
    iconBg: "rgba(16, 185, 129, 0.1)",
    iconColor: "#10B981",
    title: "Real-time typing",
    description:
      "Vừa nghe vừa gõ giúp não bộ ghi nhớ âm thanh và cách viết từ vựng sâu hơn gấp 10 lần.",
  },
  {
    icon: "i-lucide-check-circle-2",
    iconBg: "rgba(16, 185, 129, 0.1)",
    iconColor: "#10B981",
    title: "Accuracy scoring",
    description:
      "Hệ thống tính điểm chính xác ngay lập tức cho từng từ bạn gõ, giúp sửa lỗi sai tức thì.",
  },
  {
    icon: "i-lucide-flame",
    iconBg: "rgba(249, 115, 22, 0.1)",
    iconColor: "#f97316",
    title: "Save streaks",
    description: "Duy trì thói quen học tập hàng ngày với hệ thống Streak đầy cảm hứng.",
  },
  {
    icon: "i-lucide-trending-up",
    iconBg: "rgba(103, 80, 164, 0.1)",
    iconColor: "#6750a4",
    title: "Track improvement",
    description: "Biểu đồ chi tiết theo dõi sự tiến bộ của bạn qua từng tuần, từng tháng.",
  },
  {
    icon: "i-lucide-brain",
    iconBg: "rgba(103, 80, 164, 0.1)",
    iconColor: "#6750a4",
    title: "Personalized levels",
    description: "Tự động đề xuất các video phù hợp với trình độ hiện tại của bạn.",
  },
  {
    icon: "i-lucide-mic-2",
    iconBg: "rgba(16, 185, 129, 0.1)",
    iconColor: "#10B981",
    title: "Accent-focused",
    description: "Dễ dàng lựa chọn luyện nghe theo giọng Anh-Anh, Anh-Mỹ hoặc Úc.",
  },
  {
    icon: "i-lucide-captions",
    iconBg: "rgba(118, 91, 0, 0.1)",
    iconColor: "#765b00",
    title: "Smart subtitles",
    description: "Hệ thống phụ đề thông minh giúp tra từ ngay trong khi luyện tập.",
  },
];
</script>
