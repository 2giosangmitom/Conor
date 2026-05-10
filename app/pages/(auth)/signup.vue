<template>
  <UCard class="w-full max-w-md">
    <UAuthForm
      title="Đăng ký"
      description="Tạo tài khoản để bắt đầu."
      icon="i-lucide-user-plus"
      :fields="fields"
      :providers="providers"
      :submit="{ label: 'Đăng ký', block: true }"
      @submit="handleSignUp"
    />
    <template #footer>
      <p class="text-sm text-center text-muted">
        Đã có tài khoản?
        <NuxtLink to="/signin" class="text-primary hover:underline"> Đăng nhập </NuxtLink>
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

const fields = [
  {
    name: "name",
    type: "text",
    label: "Họ và tên",
    placeholder: "Nhập họ và tên",
    required: true,
  },
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
  {
    name: "confirmPassword",
    type: "password",
    label: "Xác nhận mật khẩu",
    placeholder: "Nhập lại mật khẩu",
    required: true,
  },
];

const handleSignUp = async (event: {
  data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}) => {
  const { name, email, password, confirmPassword } = event.data;

  if (password !== confirmPassword) {
    // Handle error
    console.error("Mật khẩu không khớp");
    return;
  }

  try {
    const result = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    // Better Auth tự động đăng nhập sau khi đăng ký thành công, nên chuyển đến trang đã đăng nhập.
    await navigateTo("/");
  } catch (error: unknown) {
    console.error("Lỗi đăng ký:", error instanceof Error ? error.message : String(error));
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
