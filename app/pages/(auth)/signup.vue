<template>
  <UCard class="w-full max-w-md">
    <h1 class="sr-only">Đăng ký</h1>
    <UAlert
      v-if="errorMessage"
      class="mb-4"
      color="error"
      variant="soft"
      icon="i-lucide-alert-circle"
      :title="errorMessage"
    />
    <UAuthForm
      title="Đăng ký"
      description="Tạo tài khoản mới để bắt đầu sử dụng."
      icon="i-lucide-user-plus"
      :fields="fields"
      :providers="providers"
      :submit="{
        label: 'Đăng ký',
        block: true,
        loading: isSubmitting,
        disabled: isSubmitting,
      }"
      @submit="handleSignUp"
    />
    <template #footer>
      <p class="text-sm text-center text-muted">
        Đã có tài khoản?
        <ULink
          to="/signin"
          class="font-medium text-primary underline underline-offset-4 hover:decoration-2"
        >
          Đăng nhập
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
  title: "Đăng ký",
});

const errorMessage = ref<string | null>(null);
const isSubmitting = ref(false);
const FALLBACK_SIGNUP_ERROR = "Đăng ký thất bại. Vui lòng thử lại.";
const FALLBACK_GOOGLE_ERROR = "Đăng nhập với Google thất bại. Vui lòng thử lại.";
const AUTH_ERROR_CODES = authClient.$ERROR_CODES;
const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "Vui lòng nhập họ và tên."),
    email: z.email("Email không hợp lệ."),
    password: z.string().min(1, "Vui lòng nhập mật khẩu."),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu."),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp.",
        path: ["confirmPassword"],
      });
    }
  });

const fields = [
  {
    name: "name",
    type: "text",
    label: "Họ và tên",
    placeholder: "Nhập họ và tên",
    required: true,
    autocomplete: "name",
  },
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
    autocomplete: "new-password",
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Xác nhận mật khẩu",
    placeholder: "Nhập lại mật khẩu",
    required: true,
    autocomplete: "new-password",
  },
];

const resolveErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const mapSignUpErrorMessage = (code?: string | null) => {
  switch (code) {
    case AUTH_ERROR_CODES.USER_ALREADY_EXISTS.code:
      return "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.";
    case AUTH_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD.code:
      return "Email hoặc mật khẩu không đúng.";
    default:
      return null;
  }
};

const handleSignUp = async (event: {
  data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}) => {
  errorMessage.value = null;

  const parsed = signUpSchema.safeParse(event.data);
  if (!parsed.success) {
    errorMessage.value = parsed.error.issues[0]?.message ?? "Thông tin không hợp lệ.";
    return;
  }

  const { name, email, password } = parsed.data;

  isSubmitting.value = true;
  try {
    const result = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (result.error) {
      errorMessage.value =
        mapSignUpErrorMessage(result.error.code) || result.error.message || FALLBACK_SIGNUP_ERROR;
      return;
    }

    await navigateTo("/");
  } catch (error: unknown) {
    const rawMessage = resolveErrorMessage(error, FALLBACK_SIGNUP_ERROR);
    errorMessage.value = mapSignUpErrorMessage(undefined) || rawMessage;
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
        mapSignUpErrorMessage(result.error.code) || result.error.message || FALLBACK_GOOGLE_ERROR;
      return;
    }
  } catch (error: unknown) {
    const rawMessage = resolveErrorMessage(error, FALLBACK_GOOGLE_ERROR);
    errorMessage.value = mapSignUpErrorMessage(undefined) || rawMessage;
  } finally {
    isSubmitting.value = false;
  }
};

const providers: ButtonProps[] = [
  {
    label: "Tiếp tục với Google",
    icon: "i-simple-icons-google",
    variant: "subtle",
    color: "primary",
    block: true,
    loading: isSubmitting.value,
    disabled: isSubmitting.value,
    onClick: handleGoogleSignIn,
  },
];
</script>
