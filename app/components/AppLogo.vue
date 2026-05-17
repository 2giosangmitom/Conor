<script setup lang="ts">
withDefaults(
  defineProps<{
    withText?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    withText: false,
    size: "md",
  },
);
</script>

<template>
  <div class="flex items-center">
    <span
      aria-hidden="true"
      class="inline-block shrink-0 bg-current"
      :class="{
        'size-6': size === 'sm',
        'size-10': size === 'md',
        'size-12': size === 'lg',
      }"
      :style="{
        WebkitMask: 'url(/images/logo.svg) no-repeat center / contain',
        mask: 'url(/images/logo.svg) no-repeat center / contain',
      }"
    />
    <span v-if="withText" class="ml-2 font-bold">NgheGo</span>
  </div>
</template>
