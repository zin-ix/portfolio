<script setup lang="ts">
import type { ContactLink } from '@/interfaces/profile-data.interfaces';
import { ref } from 'vue';
import cvFile from '@/assets/files/meljun_cv.pdf';

defineProps<{
  contactLinks: ContactLink[];
}>();

const showCVMenu = ref(false);

function readCV() {
  window.open(cvFile, '_blank');
  showCVMenu.value = false;
}

function downloadCV() {
  const link = document.createElement('a');
  link.href = cvFile;
  link.download = 'meljun_cv.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showCVMenu.value = false;
}
</script>

<template>
  <section class="px-10 py-[100px] border-t border-[var(--line)]" id="contact">
    <div class="flex items-center gap-4 mb-[60px]">
      <span class="text-[11px] text-[var(--dim)] tracking-[2px]">05</span>
      <div class="flex-1 h-px bg-[var(--line)]"></div>
      <span class="font-[var(--display)] text-[11px] font-bold text-[var(--muted)] tracking-[4px] uppercase">Contact</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
      <div class="reveal">
        <div class="font-[var(--display)] font-extrabold tracking-[-2px] leading-[1.05] text-[var(--white)] mb-8" style="font-size:clamp(40px,5vw,64px)">
          Let's build<br>something<br><span class="text-[var(--accent)]">great.</span>
        </div>
        <div class="mb-6">
          <div class="text-[10px] text-[var(--dim)] tracking-[3px] uppercase mb-2">Email</div>
          <a class="text-base text-[var(--white)] no-underline border-b border-[var(--line2)] pb-2 block transition-all hover:text-[var(--accent)] hover:border-[var(--accent)]"
            href="mailto:mariquit.meljun26@gmail.com">mariquit.meljun26@gmail.com</a>
        </div>
        <div class="mb-6">
          <div class="text-[10px] text-[var(--dim)] tracking-[3px] uppercase mb-2">Location</div>
          <div class="text-base text-[var(--white)] border-b border-[var(--line2)] pb-2">San Francisco, CA · Remote OK</div>
        </div>
      </div>
      <div class="reveal flex flex-col gap-4 mt-10">
        <!-- CV Button with Menu -->
        <div class="relative">
          <button @click="showCVMenu = !showCVMenu"
            class="w-full flex items-center justify-between py-4 border-b border-[var(--line)] bg-transparent cursor-pointer transition-[padding-left] duration-250 hover:pl-3">
            <div>
              <div class="font-[var(--display)] text-xl font-bold text-[var(--white)] transition-colors hover:text-[var(--accent)]">My CV</div>
              <div class="text-xs text-[var(--dim)]">Read or Download</div>
            </div>
            <div class="text-xl text-[var(--dim)] transition-all hover:text-[var(--accent)] hover:translate-x-1 hover:-translate-y-1"></div>
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="showCVMenu" class="absolute top-full right-0 mt-2 bg-[var(--bg2)] border border-[var(--line)] rounded z-50 shadow-lg">
            <button @click="readCV"
              class="w-full px-4 py-2 flex items-center gap-2 text-[var(--white)] hover:text-[var(--accent)] hover:bg-[var(--bg3)] transition-colors text-sm border-b border-[var(--line)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Read CV
            </button>
            <button @click="downloadCV"
              class="w-full px-4 py-2 flex items-center gap-2 text-[var(--white)] hover:text-[var(--accent)] hover:bg-[var(--bg3)] transition-colors text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download CV
            </button>
          </div>
        </div>

        <!-- Contact Links -->
        <a v-for="link in contactLinks" :key="link.name" :href="link.url" target="_blank" rel="noopener noreferrer"
          class="flex items-center justify-between py-4 border-b border-[var(--line)] no-underline transition-[padding-left] duration-250 hover:pl-3">
          <div>
            <div class="font-[var(--display)] text-xl font-bold text-[var(--white)] transition-colors hover:text-[var(--accent)]">{{ link.name }}</div>
            <div class="text-xs text-[var(--dim)]">{{ link.handle }}</div>
          </div>
          <div class="text-xl text-[var(--dim)] transition-all hover:text-[var(--accent)] hover:translate-x-1 hover:-translate-y-1"></div>
        </a>
      </div>
    </div>
  </section>
</template>
