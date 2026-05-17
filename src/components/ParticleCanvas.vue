<template>
  <canvas ref="canvasEl" class="fixed inset-0 pointer-events-none z-0"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ isDarkMode: boolean }>();

const canvasEl = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let particles: any[] = [];
let W = 0, H = 0;
let mouseX = -999, mouseY = -999;
let frameId: number | null = null;

function initParticles() {
  particles = [];
  const cols = Math.floor(W / 50);
  const rows = Math.floor(H / 50);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i / cols) * W + 40;
      const y = (j / rows) * H + 40;
      particles.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, size: Math.random() * 1.2 + 0.3 });
    }
  }
}

function draw() {
  if (!ctx) return;
  const dark = props.isDarkMode;
  const glowColor = dark ? [200, 255, 0] : [37, 99, 235];
  const baseColor = dark ? [255, 255, 255] : [100, 100, 100];
  const lineColor = dark ? [255, 255, 255] : [37, 99, 235];

  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    const dx = mouseX - p.x, dy = mouseY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.max(0, 120 - dist) / 120;
    p.vx += (-dx / dist || 0) * force * 2.5;
    p.vy += (-dy / dist || 0) * force * 2.5;
    p.vx += (p.ox - p.x) * 0.06;
    p.vy += (p.oy - p.y) * 0.06;
    p.vx *= 0.82; p.vy *= 0.82;
    p.x += p.vx; p.y += p.vy;
    const glow = Math.min(1, force * 3);
    ctx!.beginPath();
    ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx!.fillStyle = glow > 0.1
      ? `rgba(${glowColor[0]},${glowColor[1]},${glowColor[2]},${0.2 + glow * 0.7})`
      : `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${dark ? 0.12 : 0.25})`;
    ctx!.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        ctx!.beginPath();
        ctx!.moveTo(particles[i].x, particles[i].y);
        ctx!.lineTo(particles[j].x, particles[j].y);
        ctx!.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${(1 - d / 90) * (dark ? 0.05 : 0.12)})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }
    }
  }
  frameId = requestAnimationFrame(draw);
}

function resize() {
  if (!canvasEl.value) return;
  W = canvasEl.value.width = window.innerWidth;
  H = canvasEl.value.height = window.innerHeight;
  initParticles();
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

onMounted(() => {
  if (canvasEl.value) {
    ctx = canvasEl.value.getContext('2d');
    resize();
    draw();
  }
  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', onMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  document.removeEventListener('mousemove', onMouseMove);
  if (frameId) cancelAnimationFrame(frameId);
});
</script>