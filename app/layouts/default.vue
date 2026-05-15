<template>
  <div>
    <UHeader title="NgheGo" to="/">
      <UNavigationMenu :items="navItems" aria-label="Điều hướng chính" />

      <template #right>
        <UButton to="/signin" variant="ghost" color="neutral" label="Đăng nhập" />
        <UButton to="/signup" color="primary" label="Đăng ký" />
      </template>

      <template #body>
        <div class="flex flex-col gap-4">
          <UNavigationMenu
            :items="navItems"
            orientation="vertical"
            class="-mx-2.5"
            aria-label="Điều hướng chính"
          />
          <USeparator />
          <div class="flex flex-col gap-2">
            <UButton to="/signin" variant="ghost" color="neutral" label="Đăng nhập" />
            <UButton to="/signup" color="primary" label="Đăng ký" />
          </div>
        </div>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator />

    <UFooter>
      <template #top>
        <UContainer>
          <UFooterColumns :columns="footerColumns" />
        </UContainer>
      </template>

      <template #left>
        <p class="text-sm text-muted">© {{ currentYear }} NgheGo. All rights reserved.</p>
      </template>

      <UNavigationMenu :items="footerNav" variant="link" aria-label="Điều hướng chân trang" />

      <template #right>
        <UButton
          icon="i-simple-icons-facebook"
          color="neutral"
          variant="ghost"
          aria-label="Facebook"
        />
        <UButton
          icon="i-simple-icons-youtube"
          color="neutral"
          variant="ghost"
          aria-label="YouTube"
        />
        <UButton
          icon="i-simple-icons-instagram"
          color="neutral"
          variant="ghost"
          aria-label="Instagram"
        />
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
import type { FooterColumn, NavigationMenuItem } from "@nuxt/ui";

const currentYear = ref("");

onMounted(() => {
  currentYear.value = String(new Date().getFullYear());
});

const navItems: NavigationMenuItem[] = [
  { label: "Khám phá", to: "/#explore" },
  { label: "Tính năng", to: "/#features" },
  { label: "Cách hoạt động", to: "/#how-it-works" },
  { label: "FAQ", to: "/#faq" },
];

const footerColumns: FooterColumn[] = [
  {
    label: "Về NgheGo",
    children: [
      { label: "Điều khoản", to: "#" },
      { label: "Bảo mật", to: "#" },
    ],
  },
  {
    label: "Cộng đồng",
    children: [
      { label: "Liên hệ", to: "#" },
      { label: "Tuyển dụng", to: "#" },
    ],
  },
];

const footerNav: NavigationMenuItem[] = [
  { label: "Điều khoản", to: "#" },
  { label: "Bảo mật", to: "#" },
];
</script>
