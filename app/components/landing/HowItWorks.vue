<template>
  <section id="how-it-works" class="py-20" style="background: #fdf7ff;">
    <UContainer :ui="{ base: 'max-w-7xl' }">

      <!-- Section header -->
      <div class="text-center mb-14 max-w-2xl mx-auto">
        <h2 class="text-3xl font-semibold mb-3" style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1d1b20;">
          NgheGo hoạt động như thế nào?
        </h2>
      </div>

      <!-- Steps -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">

        <!-- Connector line (desktop only) -->
        <div class="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5" style="background: linear-gradient(90deg, #10B981, #059669); opacity: 0.3;"></div>

        <div
          v-for="(step, index) in steps"
          :key="step.title"
          class="flex flex-col items-center text-center gap-4"
        >
          <!-- Step number circle -->
          <div
            class="relative w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10"
            style="font-family: 'Plus Jakarta Sans', sans-serif; background: white; box-shadow: 0 10px 25px -5px rgba(16,185,129,0.2), 0 8px 10px -6px rgba(16,185,129,0.1);"
          >
            <span style="color: #10B981;">{{ index + 1 }}</span>
          </div>

          <!-- Content card -->
          <UCard
            :ui="{
              root: 'w-full rounded-3xl border border-slate-100',
              body: 'p-6',
            }"
            style="background: white; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.04), 0 8px 10px -6px rgba(0,0,0,0.04);"
          >
            <!-- Icon -->
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3" style="background: rgba(16,185,129,0.1);">
              <UIcon :name="step.icon" class="w-5 h-5" style="color: #10B981;" />
            </div>
            <h3 class="font-semibold text-base mb-2" style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1d1b20;">
              {{ step.title }}
            </h3>
            <p class="text-sm leading-relaxed" style="color: #7a7582; font-family: 'Inter', sans-serif; line-height: 1.6;">
              {{ step.description }}
            </p>
          </UCard>
        </div>

      </div>

    </UContainer>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    icon: 'i-lucide-search',
    title: 'Chọn video',
    description: 'Dán link YouTube bất kỳ hoặc chọn từ danh sách đề xuất.',
  },
  {
    icon: 'i-lucide-headphones',
    title: 'Nghe từng câu',
    description: 'Video sẽ tự động dừng lại ở cuối mỗi câu thoại.',
  },
  {
    icon: 'i-lucide-keyboard',
    title: 'Gõ lại',
    description: 'Nghe kỹ và gõ lại chính xác những gì bạn nghe được.',
  },
  {
    icon: 'i-lucide-bar-chart-2',
    title: 'Xem kết quả',
    description: 'Hệ thống so sánh và phản hồi kết quả tức thì cho bạn.',
  },
]
</script>
