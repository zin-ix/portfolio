<template>
  <nav class="flex justify-between items-center px-10 py-5 border-b border-[var(--line)] sticky top-0 z-[100] bg-[rgba(var(--bg-rgb),0.85)] backdrop-blur-md">
    <!-- Logo -->
    <div class="flex items-center gap-2 font-[var(--display)] text-base font-extrabold tracking-tight text-[var(--white)]">
      <div class="tb-logo-dot"></div>
      Meljun
    </div>

    <!-- Center info -->
    <div class="hidden md:flex items-center gap-5 text-[10px] text-[var(--dim)] tracking-[2px] uppercase">
      <span>Developer</span>
      <span class="text-[var(--line2)]">/</span>
      <span>San Francisco</span>
      <span class="text-[var(--line2)]">/</span>
      <span ref="timeEl">--:--:--</span>
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-6">
      <a v-for="link in navLinks" :key="link.label"
        class="hidden md:block text-[11px] no-underline tracking-[1px] uppercase transition-colors"
        :class="activeSection === link.href ? 'text-[var(--accent)] font-semibold' : 'text-[var(--muted)] hover:text-[var(--accent)]'"
        :href="link.href">{{ link.label }}</a>

      <!-- Theme toggle -->
      <button
        class="w-8 h-8 border border-[var(--line2)] rounded flex items-center justify-center bg-transparent cursor-pointer transition-all hover:bg-[var(--bg3)] hover:border-[var(--accent)]"
        @click="$emit('toggleTheme')" :title="isDarkMode ? 'Light mode' : 'Dark mode'">
        <svg v-if="isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--accent)]">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--accent)]">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <button
        class="px-[18px] py-2 border border-[var(--line2)] rounded-sm text-[11px] font-[var(--mono)] text-[var(--accent)] bg-transparent cursor-pointer tracking-[1px] uppercase transition-all hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)]"
        onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">
        hire_me();
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{ isDarkMode: boolean }>();
defineEmits(['toggleTheme']);

const timeEl = ref<HTMLElement | null>(null);
const activeSection = ref<string | null>(null);
const navLinks = [
  { label: 'Work',  href: '#work'  },
  { label: 'About', href: '#about' },
  { label: 'Exp',   href: '#exp'   },
];

let clockInterval: number | null = null;
let observer: IntersectionObserver | null = null;

function updateTime() {
  if (timeEl.value) {
    timeEl.value.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
  }
}

onMounted(() => {
  updateTime();
  clockInterval = window.setInterval(updateTime, 1000);

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = `#${entry.target.id}`;
      }
    });
  }, { rootMargin: '-20% 0px -75% 0px' });

  navLinks.forEach(link => {
    const el = document.querySelector(link.href);
    if (el) observer?.observe(el);
  });
});

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
  if (observer) observer.disconnect();
});
</script>

<style>
.tb-logo-dot {
  width: 7px; height: 7px;
  background: var(--accent); border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100%{ transform:scale(1); opacity:1 }
  50%    { transform:scale(1.4); opacity:0.7 }
}
</style>