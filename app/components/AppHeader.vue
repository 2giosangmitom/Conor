<script setup lang="ts">
import type { ButtonProps, DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { useSession, signOut, authClient } from "~/utils/auth";

const route = useRoute();
const isAuthModalOpen = ref(false);
const { data: session } = await useSession(useFetch);
const user = computed(() => session.value?.user);

const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Cách sử dụng",
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
      <span
        aria-hidden="true"
        class="inline-block size-7.5 shrink-0 bg-current"
        :style="{
          WebkitMask: 'url(/images/logo.svg) no-repeat center / contain',
          mask: 'url(/images/logo.svg) no-repeat center / contain',
        }"
      />
      <span>NgheGo</span>
    </template>

    <UNavigationMenu :items="navigationItems" />

    <template #right>
      <template v-if="user">
        <UDropdownMenu :items="dropdownItems" :content="{ align: 'end' }">
          <UButton variant="ghost" class="gap-2">
            <UAvatar :src="user.image ?? undefined" :alt="user.name" size="sm" />
          </UButton>
        </UDropdownMenu>
      </template>
      <template v-else>
        <UButton color="primary" variant="solid" @click="openAuthModal">Đăng nhập</UButton>
      </template>
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
