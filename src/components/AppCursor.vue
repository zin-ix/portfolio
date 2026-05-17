<template>
  <div id="cursor" ref="cursorEl"></div>
  <div id="cursor-ring" ref="cursorRingEl"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const cursorEl = ref<HTMLElement | null>(null);
const cursorRingEl = ref<HTMLElement | null>(null);

const cursorPos = { x: 0, y: 0 };
const cursorRingPos = { x: 0, y: 0 };
let frameId: number | null = null;

function animateRing() {
  if (!cursorRingEl.value) return;
  cursorRingPos.x += (cursorPos.x - cursorRingPos.x) * 0.12;
  cursorRingPos.y += (cursorPos.y - cursorRingPos.y) * 0.12;
  cursorRingEl.value.style.left = cursorRingPos.x + 'px';
  cursorRingEl.value.style.top = cursorRingPos.y + 'px';
  frameId = requestAnimationFrame(animateRing);
}

function onMouseMove(e: MouseEvent) {
  cursorPos.x = e.clientX;
  cursorPos.y = e.clientY;
  if (cursorEl.value) {
    cursorEl.value.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
  }
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove);
  animateRing();
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
  if (frameId) cancelAnimationFrame(frameId);
});
</script>

<style>
#cursor {
  width: 10px; height: 10px;
  background: var(--accent);
  border-radius: 50%;
  position: fixed; top: 0; left: 0;
  pointer-events: none; z-index: 9999;
  mix-blend-mode: difference;
  transition: transform 0.05s;
}
#cursor-ring {
  width: 36px; height: 36px;
  border: 1px solid rgba(200,255,0,0.4);
  border-radius: 50%;
  position: fixed; top: 0; left: 0;
  pointer-events: none; z-index: 9998;
  transform: translate(-50%, -50%);
}
</style>