<script lang="ts" setup>
import { cn } from "@inspira-ui/plugins";

const props = withDefaults(
  defineProps<{
    duration?: number;
    radiantWidth?: number;
    color?: string;
    textColor?: string;
    class?: string;
  }>(),
  {
    duration: 10,
    radiantWidth: 100,
    color: undefined,
    textColor: undefined,
    class: "",
  },
);

const styleVar = computed(() => {
  return {
    "--radiant-anim-duration": `${props.duration}s`,
    "--radiant-width": `${props.radiantWidth}px`,
    ...(props.color ? { "--radiant-color": props.color } : {}),
    ...(props.textColor ? { "--radiant-text-color": props.textColor } : {}),
  };
});
</script>

<template>
  <p
    :style="styleVar"
    :class="
      cn(
        `radiant-animation max-w-md bg-linear-to-r from-transparent via-(--radiant-color,var(--color-primary)) via-50% to-transparent bg-size-[var(--radiant-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat text-(--radiant-text-color,var(--color-neutral-600))/70 [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite] dark:via-(--radiant-color,white) dark:text-(--radiant-text-color,var(--color-neutral-400))/70`,
        props.class,
      )
    "
  >
    <slot />
  </p>
</template>

<style scoped>
@keyframes radiant {
  0%,
  90%,
  100% {
    background-position: calc(-100% - var(--radiant-width)) 0;
  }
  30%,
  60% {
    background-position: calc(100% + var(--radiant-width)) 0;
  }
}

.radiant-animation {
  animation: radiant var(--radiant-anim-duration) infinite;
}
</style>
