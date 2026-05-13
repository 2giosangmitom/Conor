<template>
  <section class="py-20" style="background: #fdf7ff;">
    <UContainer :ui="{ base: 'max-w-4xl' }">
      <div
        class="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
        style="background: linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%);"
      >
        <!-- Background decoration -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div class="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20" style="background: rgba(255,255,255,0.3);"></div>
          <div class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-15" style="background: rgba(255,255,255,0.2);"></div>
        </div>

        <div class="relative z-10 flex flex-col items-center gap-6">
          <!-- Heading -->
          <h2 class="text-3xl md:text-4xl font-bold text-white leading-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">
            Bắt đầu luyện Listening ngay hôm nay
          </h2>

          <!-- CTA Button -->
          <UButton
            size="xl"
            label="Bắt đầu ngay"
            trailing-icon="i-lucide-arrow-right"
            :ui="{ base: 'rounded-full font-semibold px-8 shadow-lg' }"
            style="background: white; color: #059669;"
          />

          <!-- Social proof text -->
          <p class="text-sm text-white/80" style="font-family: 'Inter', sans-serif;">
            Hơn 10,000 người đã thay đổi cách họ học tiếng Anh. Đến lượt bạn!
          </p>
        </div>
      </div>
    </UContainer>
  </section>
</template>
