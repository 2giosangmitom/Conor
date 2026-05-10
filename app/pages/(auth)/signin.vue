<template>
  <UCard class="w-full max-w-md">
    <h1 class="sr-only">Đăng nhập</h1>
    <UAuthForm
      ref="authForm"
      title="Đăng nhập"
      description="Nhập thông tin để truy cập tài khoản."
      icon="i-lucide-log-in"
      :fields="fields"
      :providers="providers"
      :submit="{ label: 'Đăng nhập', block: true }"
      @submit="handleSignIn"
    />
    <template #footer>
      <p class="text-sm text-center text-muted">
        Chưa có tài khoản?
        <NuxtLink to="/signup" class="text-primary underline underline-offset-4 hover:decoration-2">
          Đăng ký
        </NuxtLink>
      </p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import { authClient } from "~/utils/auth";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Đăng nhập",
});

const fields = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Nhập email",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    required: true,
  },
];

const handleSignIn = async (event: { data: { email: string; password: string } }) => {
  const { email, password } = event.data;

  try {
    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    // Chuyển đến trang chủ hoặc dashboard
    await navigateTo("/");
  } catch (error: unknown) {
    // Handle error, maybe show toast
    console.error("Lỗi đăng nhập:", error instanceof Error ? error.message : String(error));
    // You can use UToast or similar to show error
  }
};

const handleGoogleSignIn = async () => {
  try {
    const result = await authClient.signIn.social({ provider: "google" });

    if (result?.error) {
      throw new Error(result.error.message);
    }
  } catch (error: unknown) {
    console.error("Lỗi đăng nhập Google:", error instanceof Error ? error.message : String(error));
  }
};

const providers: ButtonProps[] = [
  {
    label: "Tiếp tục với Google",
    icon: "i-simple-icons-google",
    variant: "outline",
    block: true,
    onClick: handleGoogleSignIn,
  },
];
</script>
