<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { motion, type Transition, type VariantLabels, type VariantType } from "motion-v";

interface WordRotateMotionProps {
  initial?: VariantType | VariantLabels;
  animate?: VariantType | VariantLabels;
  exit?: VariantType | VariantLabels;
  transition?: Transition;
}

interface Props {
  words: string[];
  duration?: number;
  motionProps?: WordRotateMotionProps;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2500,
  motionProps: () => ({
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  }),
});

const index = ref(0);
let intervalId: number | undefined;

function clearRotation() {
  if (intervalId !== undefined) {
    window.clearInterval(intervalId);
    intervalId = undefined;
  }
}

function startRotation() {
  clearRotation();

  if (props.words.length < 2) {
    return;
  }

  intervalId = window.setInterval(() => {
    index.value = (index.value + 1) % props.words.length;
  }, props.duration);
}

onMounted(() => {
  startRotation();
});

onBeforeUnmount(() => {
  clearRotation();
});
</script>

<template>
  <div class="overflow-hidden py-2">
    <motion.h1
      :key="props.words[index] ?? ''"
      :initial="props.motionProps?.initial"
      :animate="props.motionProps?.animate"
      :exit="props.motionProps?.exit"
      :transition="props.motionProps?.transition"
    >
      {{ props.words[index] ?? "" }}
    </motion.h1>
  </div>
</template>
