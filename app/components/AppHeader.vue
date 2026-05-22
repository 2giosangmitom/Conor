<script setup lang="ts">
import type { ButtonProps, DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { useSession, signOut, authClient } from "~/utils/auth";

const route = useRoute();
const isAuthModalOpen = ref(false);
const { data: session } = await useSession(useFetch);
const user = computed(() => session.value?.user);

const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    to: "/explore",
    active: route.path === "/explore",
    label: "Khám phá",
  },
  {
    label: "Tính năng",
    to: "/#features",
    active: route.path === "/" && route.hash === "#features",
  },
  {
    label: "Cách sử dụng",
    to: "/#how-to-use",
    active: route.path === "/" && route.hash === "#how-to-use",
  },
  {
    label: "Câu hỏi thường gặp",
    to: "/#faq",
    active: route.path === "/" && route.hash === "#faq",
  },
]);

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

const dropdownItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      type: "label",
      label: user.value?.name,
      avatar: {
        src: user.value?.image ?? undefined,
        alt: user.value?.name ?? "User Avatar",
      },
    },
  ],
  [
    {
      label: "Trang cá nhân",
      icon: "i-lucide-user",
      to: "/profile",
    },
    {
      label: "Cài đặt",
      icon: "i-lucide-settings",
      to: "/settings",
    },
  ],
  [
    {
      label: "Đăng xuất",
      icon: "i-lucide-log-out",
      color: "error",
      onSelect: async () => {
        await signOut();
      },
    },
  ],
]);

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
      <AppLogo with-text />
    </template>

    <UNavigationMenu :items="navigationItems" aria-label="Main navigation" />

    <template #right>
      <template v-if="user">
        <LazyUDropdownMenu :items="dropdownItems" :content="{ align: 'end' }">
          <UButton variant="ghost" class="gap-2" :aria-label="user.name">
            <LazyUAvatar :src="user.image ?? undefined" :alt="user.name" size="sm" />
          </UButton>
        </LazyUDropdownMenu>
      </template>
      <template v-else>
        <UButton color="primary" variant="solid" @click="openAuthModal">Đăng nhập</UButton>
      </template>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu
        :items="navigationItems"
        orientation="vertical"
        class="-mx-2.5"
        aria-label="Mobile navigation"
      />
    </template>
  </UHeader>

  <UModal
    v-model:open="isAuthModalOpen"
    title="Đăng nhập"
    description="Đăng nhập bằng tài khoản Google."
  >
    <template #body>
      <LazyUAuthForm
        title="Đăng nhập"
        description="Đăng nhập bằng tài khoản Google."
        :fields="[]"
        :providers="authProviders"
      />
    </template>
  </UModal>
</template>
