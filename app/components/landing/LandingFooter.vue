<template>
  <footer class="py-12 border-t" style="background: #fdf7ff; border-color: #e6e0e9">
    <UContainer :ui="{ base: 'max-w-7xl' }">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <!-- Brand column -->
        <div class="md:col-span-2 flex flex-col gap-4">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 font-bold text-xl w-fit"
            style="color: #10b981; font-family: &quot;Plus Jakarta Sans&quot;, sans-serif"
          >
            <div
              class="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style="background: linear-gradient(135deg, #10b981, #059669)"
            >
              N
            </div>
            NgheGo
          </NuxtLink>
          <p
            class="text-sm leading-relaxed max-w-xs"
            style="color: #7a7582; font-family: &quot;Inter&quot;, sans-serif; line-height: 1.6"
          >
            © 2024 NgheGo. Nền tảng luyện nghe tiếng Anh qua YouTube số 1 Việt Nam. Biến thời gian
            giải trí thành thời gian học tập hiệu quả.
          </p>
          <!-- Social icons -->
          <div class="flex items-center gap-3 mt-1">
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-bar-chart-2"
              size="xs"
              :ui="{ base: 'rounded-xl' }"
            />
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-at-sign"
              size="xs"
              :ui="{ base: 'rounded-xl' }"
            />
          </div>
        </div>

        <!-- Links columns -->
        <div v-for="col in footerLinks" :key="col.title" class="flex flex-col gap-3">
          <h4
            class="font-semibold text-sm"
            style="font-family: &quot;Plus Jakarta Sans&quot;, sans-serif; color: #1d1b20"
          >
            {{ col.title }}
          </h4>
          <nav class="flex flex-col gap-2">
            <NuxtLink
              v-for="link in col.links"
              :key="link.label"
              :to="link.to"
              class="text-sm transition-colors hover:text-emerald-600"
              style="color: #7a7582; font-family: &quot;Inter&quot;, sans-serif"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>
      </div>

      <USeparator />

      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
        <p class="text-xs" style="color: #7a7582; font-family: &quot;Inter&quot;, sans-serif">
          © 2024 NgheGo. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="#"
            class="text-xs hover:text-emerald-600 transition-colors"
            style="color: #7a7582; font-family: &quot;Inter&quot;, sans-serif"
            >Điều khoản</NuxtLink
          >
          <NuxtLink
            to="#"
            class="text-xs hover:text-emerald-600 transition-colors"
            style="color: #7a7582; font-family: &quot;Inter&quot;, sans-serif"
            >Bảo mật</NuxtLink
          >
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
const footerLinks = [
  {
    title: "Về chúng tôi",
    links: [
      { label: "Điều khoản", to: "#" },
      { label: "Bảo mật", to: "#" },
    ],
  },
  {
    title: "Cộng đồng",
    links: [
      { label: "Liên hệ", to: "#" },
      { label: "Tuyển dụng", to: "#" },
    ],
  },
];
</script>
