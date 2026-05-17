<script setup lang="ts">
import { cn } from "@inspira-ui/plugins";

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  maxOpacity?: number;
  class?: string;
}

const props = withDefaults(defineProps<FlickeringGridProps>(), {
  squareSize: 4,
  gridGap: 6,
  flickerChance: 0.3,
  color: "rgb(0, 0, 0)",
  maxOpacity: 0.3,
  class: "",
});

const canvasRef = useTemplateRef<HTMLCanvasElement>("canvasRef");
const containerRef = useTemplateRef<HTMLDivElement>("containerRef");

const isInView = ref(false);
const canvasSize = ref({ width: 0, height: 0 });

const resolvedColor = ref("rgba(0, 0, 0,");

function resolveColor(color: string) {
  if (typeof window === "undefined") {
    return "rgba(0, 0, 0,";
  }

  let resolved = color;
  if (color.startsWith("var(")) {
    const cssVarName = color.match(/var\((--[^)]+)\)/)?.[1];
    if (cssVarName) {
      resolved = getComputedStyle(document.body).getPropertyValue(cssVarName).trim();
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "rgba(255, 0, 0,";
  ctx.fillStyle = resolved;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
  return `rgba(${r}, ${g}, ${b},`;
}

onMounted(() => {
  resolvedColor.value = resolveColor(props.color);
});

watch(
  () => props.color,
  (newColor) => {
    resolvedColor.value = resolveColor(newColor);
  },
);

function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const cols = Math.ceil(width / (props.squareSize + props.gridGap));
  const rows = Math.ceil(height / (props.squareSize + props.gridGap));

  const squares = new Float32Array(cols * rows);
  for (let i = 0; i < squares.length; i++) {
    squares[i] = Math.random() * props.maxOpacity;
  }

  return { cols, rows, squares, dpr };
}

function updateSquares(squares: Float32Array, deltaTime: number) {
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < props.flickerChance * deltaTime) {
      squares[i] = Math.random() * props.maxOpacity;
    }
  }
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cols: number,
  rows: number,
  squares: Float32Array,
  dpr: number,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const opacity = squares[i * rows + j];
      ctx.fillStyle = `${resolvedColor.value}${opacity})`;
      ctx.fillRect(
        i * (props.squareSize + props.gridGap) * dpr,
        j * (props.squareSize + props.gridGap) * dpr,
        props.squareSize * dpr,
        props.squareSize * dpr,
      );
    }
  }
}

let animationFrameId: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let gridParams: ReturnType<typeof setupCanvas> | null = null;
let lastTime = 0;

const animate = (time: number) => {
  if (!isInView.value || !gridParams) return;

  const canvas = canvasRef.value;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;

  updateSquares(gridParams.squares, deltaTime);
  drawGrid(
    ctx,
    canvas.width,
    canvas.height,
    gridParams.cols,
    gridParams.rows,
    gridParams.squares,
    gridParams.dpr,
  );
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  const ctx = canvas?.getContext("2d");

  if (!canvas || !container || !ctx) return;

  const updateCanvasSize = () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    canvasSize.value = { width: newWidth, height: newHeight };
    if (canvas) {
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    }
  };

  updateCanvasSize();

  resizeObserver = new ResizeObserver(() => {
    updateCanvasSize();
  });
  resizeObserver.observe(container);

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      isInView.value = entry.isIntersecting;
      if (entry.isIntersecting && !animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    },
    { threshold: 0 },
  );
  intersectionObserver.observe(canvas);

  if (isInView.value) {
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);
  }
});

onBeforeUnmount(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }
});
</script>

<template>
  <div ref="containerRef" :class="cn(`h-full w-full`, props.class)">
    <canvas
      ref="canvasRef"
      class="pointer-events-none"
      :style="{
        width: canvasSize.width + 'px',
        height: canvasSize.height + 'px',
      }"
    />
  </div>
</template>
