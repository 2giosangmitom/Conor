<script setup lang="ts">
import { Motion, type Transition } from "motion-v";

interface Props {
  duration?: number;
  staggerDelay?: number;
  blur?: string;
  yOffset?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1,
  staggerDelay: 0.2,
  blur: "10px",
  yOffset: 10,
  class: "",
});

const slots = useSlots();

const children = computed<VNode[]>(() => slots.default?.() ?? []);

const initial = computed(() => ({
  opacity: 0,
  filter: `blur(${props.blur})`,
  y: props.yOffset,
}));

const animate = computed(() => ({
  opacity: 1,
  filter: "blur(0px)",
  y: 0,
}));

function getTransition(index: number): Transition {
  return {
    duration: props.duration,
    ease: "easeInOut",
    delay: props.staggerDelay * index,
  };
}
</script>

<template>
  <div :class="props.class">
    <Motion
      v-for="(child, index) in children"
      :key="index"
      :initial="initial"
      :while-in-view="animate"
      :transition="getTransition(index)"
    >
      <component :is="child" />
    </Motion>
  </div>
</template>
