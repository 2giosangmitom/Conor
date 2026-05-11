<template>
  <div>
    <h1 class="text-2xl font-semibold">Trang chủ</h1>
    <p v-if="session.data">
      Chào mừng, {{ session.data.user.name }}! Bạn đã đăng nhập thành công.
      <UButton
        class="ml-4"
        color="error"
        variant="outline"
        size="sm"
        @click="authClient.signOut()"
        >Đăng xuất</UButton
      >
    </p>
    <UButton to="/signin">Sign in</UButton>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Trang chủ",
});

const session = authClient.useSession();
</script>
