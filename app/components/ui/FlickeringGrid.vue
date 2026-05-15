<script lang="ts" setup>
import { cn } from "@inspira-ui/plugins";
import { onBeforeUnmount, onMounted } from "vue";

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  class?: string;
  maxOpacity?: number;
}

const props = withDefaults(defineProps<FlickeringGridProps>(), {
  squareSize: 4,
  gridGap: 6,
  flickerChance: 0.3,
  color: "rgb(0, 0, 0)",
  maxOpacity: 0.3,
  width: undefined,
  height: undefined,
  class: undefined,
});

let containerEl: HTMLDivElement | null = null;
let canvasEl: HTMLCanvasElement | null = null;

// ── Internal mutable state (not reactive — never drives the template) ───────
let ctx: CanvasRenderingContext2D | null = null;
let cols = 0;
let rows = 0;
let squares = new Float32Array(0);
let dpr = 1;

let animationFrameId: number | undefined;
let resizeObserver: ResizeObserver | undefined;
let intersectionObserver: IntersectionObserver | undefined;
let isInView = false;
let lastTime: number | undefined; // undefined = first frame sentinel

function parseColorPrefix(color: string): string {
  const offscreen = document.createElement("canvas");
  offscreen.width = offscreen.height = 1;
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) return "rgba(0, 0, 0,";

  offCtx.fillStyle = color;
  offCtx.fillRect(0, 0, 1, 1);
  const [r, g, b] = offCtx.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b},`;
}

function setupCanvas(width: number, height: number): void {
  if (!canvasEl) return;

  dpr = window.devicePixelRatio || 1;
  canvasEl.width = width * dpr;
  canvasEl.height = height * dpr;
  canvasEl.style.width = `${width}px`;
  canvasEl.style.height = `${height}px`;

  cols = Math.floor(width / (props.squareSize + props.gridGap));
  rows = Math.floor(height / (props.squareSize + props.gridGap));

  squares = new Float32Array(cols * rows);
  for (let i = 0; i < squares.length; i++) {
    squares[i] = Math.random() * props.maxOpacity;
  }
}

function updateCanvasSize(): void {
  if (!containerEl || !canvasEl) return;
  const w = props.width ?? containerEl.clientWidth;
  const h = props.height ?? containerEl.clientHeight;
  setupCanvas(w, h);
}

function updateSquares(deltaTime: number): void {
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < props.flickerChance * deltaTime) {
      squares[i] = Math.random() * props.maxOpacity;
    }
  }
}

function drawGrid(colorPrefix: string): void {
  if (!ctx || !canvasEl) return;

  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      ctx.fillStyle = `${colorPrefix}${squares[i * rows + j]})`;
      ctx.fillRect(
        i * (props.squareSize + props.gridGap) * dpr,
        j * (props.squareSize + props.gridGap) * dpr,
        props.squareSize * dpr,
        props.squareSize * dpr,
      );
    }
  }
}

function animate(time: number): void {
  if (!isInView) return;

  // Seed lastTime on the very first frame to avoid a huge initial deltaTime
  const deltaTime = lastTime !== undefined ? (time - lastTime) / 1000 : 0;
  lastTime = time;

  const colorPrefix = parseColorPrefix(props.color);
  updateSquares(deltaTime);
  drawGrid(colorPrefix);

  animationFrameId = requestAnimationFrame(animate);
}

function startAnimation(): void {
  // Guard against spawning multiple rAF loops
  if (animationFrameId !== undefined) return;
  lastTime = undefined;
  animationFrameId = requestAnimationFrame(animate);
}

function stopAnimation(): void {
  if (animationFrameId !== undefined) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = undefined;
  }
}

onMounted(() => {
  const container = document.querySelector<HTMLDivElement>("[data-flickering-container]");
  const canvas = document.querySelector<HTMLCanvasElement>("[data-flickering-canvas]");

  if (!canvas || !container) return;
  containerEl = container;
  canvasEl = canvas;

  ctx = canvas.getContext("2d");
  if (!ctx) return;

  updateCanvasSize();

  resizeObserver = new ResizeObserver(updateCanvasSize);
  resizeObserver.observe(container);

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isInView = entry!.isIntersecting;
      if (isInView) {
        startAnimation();
      } else {
        stopAnimation();
      }
    },
    { threshold: 0 },
  );
  intersectionObserver.observe(canvas);
});

onBeforeUnmount(() => {
  stopAnimation();
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
});
</script>

<template>
  <div data-flickering-container :class="cn('h-full w-full', props.class)">
    <canvas data-flickering-canvas class="pointer-events-none" />
  </div>
</template>
