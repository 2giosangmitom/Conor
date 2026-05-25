<template>
  <ClientOnly>
    <h1 class="relative inline-block" :class="className">
      <span class="animate-aurora relative bg-clip-text text-transparent" :style="gradientStyle">
        <slot />
      </span>
    </h1>

    <template #fallback>
      <h1 :class="className">
        <slot />
      </h1>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
interface AuroraTextProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

const props = withDefaults(defineProps<AuroraTextProps>(), {
  className: "",
  colors: () => ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
  speed: 1,
});

const gradientStyle = computed(() => ({
  backgroundImage: `linear-gradient(135deg, ${props.colors.join(", ")}, ${props.colors[0]})`,
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  animationDuration: `${10 / props.speed}s`,
}));
</script>
