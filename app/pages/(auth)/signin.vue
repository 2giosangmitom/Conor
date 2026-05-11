<template>
  <UCard class="w-full max-w-md">
    <h1 class="sr-only">Đăng nhập</h1>
    <UAlert
      v-if="errorMessage"
      class="mb-4"
      color="error"
      variant="soft"
      icon="i-lucide-alert-circle"
      :title="errorMessage"
    />
    <UAuthForm
      title="Đăng nhập"
      description="Nhập thông tin để truy cập tài khoản của bạn."
      icon="i-lucide-log-in"
      :fields="fields"
      :providers="providers"
      :submit="{
        label: 'Đăng nhập',
        block: true,
        loading: isSubmitting,
        disabled: isSubmitting,
      }"
      @submit="handleSignIn"
    />
    <template #footer>
      <p class="text-sm text-center text-muted">
        Chưa có tài khoản?
        <ULink
          to="/signup"
          class="font-medium text-primary underline underline-offset-4 hover:decoration-2"
        >
          Đăng ký
        </ULink>
      </p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";
import { z } from "zod";

definePageMeta({
  layout: "auth",
});

useSeoMeta({
  title: "Đăng nhập",
});

const errorMessage = ref<string | null>(null);
const isSubmitting = ref(false);
const FALLBACK_ERROR_MESSAGE = "Đăng nhập thất bại. Vui lòng thử lại.";
const AUTH_ERROR_CODES = authClient.$ERROR_CODES;
const signInSchema = z.object({
  email: z.email("Email không hợp lệ.").trim().min(1, "Vui lòng nhập email."),
  password: z.string().min(1, "Vui lòng nhập mật khẩu."),
});

const fields = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Nhập email",
    required: true,
    autocomplete: "email",
  },
  {
    name: "password",
    type: "password",
    label: "Mật khẩu",
    placeholder: "Nhập mật khẩu",
    required: true,
    autocomplete: "current-password",
  },
];

const resolveErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const mapSignInErrorMessage = (code?: string | null) => {
  switch (code) {
    case AUTH_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD.code:
      return "Email hoặc mật khẩu không đúng.";
    case AUTH_ERROR_CODES.USER_NOT_FOUND.code:
      return "Tài khoản chưa tồn tại. Vui lòng kiểm tra lại email.";
    case AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED.code:
      return "Email chưa được xác minh. Vui lòng kiểm tra hộp thư của bạn.";
    default:
      return null;
  }
};

const handleSignIn = async (event: { data: { email: string; password: string } }) => {
  errorMessage.value = null;

  const parsed = signInSchema.safeParse(event.data);
  if (!parsed.success) {
    errorMessage.value = parsed.error.issues[0]?.message ?? "Thông tin không hợp lệ.";
    return;
  }

  const { email, password } = parsed.data;

  isSubmitting.value = true;
  try {
    const result = await authClient.signIn.email({
      email,
      password,
    });

    if (result.error) {
      errorMessage.value =
        mapSignInErrorMessage(result.error.code) || result.error.message || FALLBACK_ERROR_MESSAGE;
      return;
    }

    await navigateTo("/");
  } catch (error: unknown) {
    const rawMessage = resolveErrorMessage(error, FALLBACK_ERROR_MESSAGE);
    errorMessage.value = mapSignInErrorMessage(undefined) || rawMessage;
  } finally {
    isSubmitting.value = false;
  }
};

const handleGoogleSignIn = async () => {
  errorMessage.value = null;
  isSubmitting.value = true;
  try {
    const result = await authClient.signIn.social({ provider: "google" });

    if (result?.error) {
      errorMessage.value =
        mapSignInErrorMessage(result.error.code) ||
        result.error.message ||
        "Đăng nhập với Google thất bại. Vui lòng thử lại.";
      return;
    }
  } catch (error: unknown) {
    const fallback = "Đăng nhập với Google thất bại. Vui lòng thử lại.";
    const rawMessage = resolveErrorMessage(error, fallback);
    errorMessage.value = mapSignInErrorMessage(undefined) || rawMessage;
  } finally {
    isSubmitting.value = false;
  }
};

const providers = computed<ButtonProps[]>(() => [
  {
    label: "Tiếp tục với Google",
    icon: "i-simple-icons-google",
    variant: "outline",
    block: true,
    loading: isSubmitting.value,
    disabled: isSubmitting.value,
    onClick: handleGoogleSignIn,
  },
]);
</script>
