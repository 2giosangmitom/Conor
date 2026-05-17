<script setup lang="ts">
import type { ButtonProps, NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const isAuthModalOpen = ref(false);

const navigationItems: NavigationMenuItem[] = [
  {
    label: "Cách dùng",
    to: "/#how-to-use",
    active: route.path === "/" && route.hash === "#how-to-use",
  },
  {
    label: "Tính năng",
    to: "/#features",
    active: route.path === "/" && route.hash === "#features",
  },
  {
    label: "Câu hỏi thường gặp",
    to: "/#faq",
    active: route.path === "/" && route.hash === "#faq",
  },
];

const authProviders: ButtonProps[] = [
  {
    label: "Tiếp tục với Google",
    icon: "logos:google-icon",
    color: "primary",
    variant: "subtle",
    block: true,
    onClick: signInWithGoogle,
  },
];

function openAuthModal() {
  isAuthModalOpen.value = true;
}

async function signInWithGoogle() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
}
</script>

<template>
  <UHeader title="NgheGo" to="/">
    <template #title>
      <span class="font-semibold text-highlighted">NgheGo</span>
    </template>

    <UNavigationMenu :items="navigationItems" />

    <template #right>
      <UButton color="primary" variant="solid" @click="openAuthModal">Đăng nhập</UButton>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu :items="navigationItems" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>

  <UModal
    v-model:open="isAuthModalOpen"
    title="Đăng nhập"
    description="Đăng nhập bằng tài khoản Google để tiếp tục."
  >
    <template #body>
      <UAuthForm
        title="Đăng nhập"
        description="Đăng nhập bằng tài khoản Google để tiếp tục."
        :fields="[]"
        :providers="authProviders"
      />
    </template>
  </UModal>
</template>
