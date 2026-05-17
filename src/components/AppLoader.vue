<template>
  <div id="loader" ref="loaderEl"
    class="fixed inset-0 bg-[var(--bg)] z-[1000] flex flex-col items-center justify-center gap-4">
    <div style="font-family:'JetBrains Mono';font-size:11px;color:var(--accent);opacity:0.8;letter-spacing:3px">
      INITIALIZING
    </div>
    <div class="loader-line"></div>
    <div class="loader-text">loading portfolio.exe</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const loaderEl = ref<HTMLElement | null>(null);

onMounted(() => {
  setTimeout(() => {
    loaderEl.value?.classList.add('hide');
  }, 1600);
});
</script>

<style>
#loader { transition: opacity 0.6s ease, visibility 0.6s; }
#loader.hide { opacity: 0; visibility: hidden; }
.loader-line {
  width: 200px; height: 1px;
  background: var(--line2);
  position: relative; overflow: hidden;
}
.loader-line::after {
  content: '';
  position: absolute; left: -100%; top: 0;
  width: 100%; height: 100%;
  background: var(--accent);
  animation: loadBar 1.4s cubic-bezier(0.4,0,0.2,1) forwards;
}
@keyframes loadBar { to { left: 100%; } }
.loader-text {
  font-size: 11px; color: var(--muted);
  letter-spacing: 3px; text-transform: uppercase;
  animation: blink 0.8s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }
</style>