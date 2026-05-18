<script setup lang="ts">
import { ref } from 'vue';
import type { ProjectItem } from '@/interfaces/profile-data.interfaces';

defineProps<{
  projectItems: ProjectItem[];
}>();

const expandedProject = ref<string | null>(null);
const carouselIndexes = ref<Record<string, number>>({});
const activeCarouselImage = ref<string | null>(null);

function toggleProject(num: string) {
  expandedProject.value = expandedProject.value === num ? null : num;
  if (expandedProject.value && carouselIndexes.value[num] === undefined) {
    carouselIndexes.value[num] = 0;
  }
}

function nextImage(num: string, total: number, e: Event) {
  e.stopPropagation();
  carouselIndexes.value[num] = ((carouselIndexes.value[num] || 0) + 1) % total;
}

function prevImage(num: string, total: number, e: Event) {
  e.stopPropagation();
  carouselIndexes.value[num] = ((carouselIndexes.value[num] || 0) - 1 + total) % total;
}

function setCarouselIndex(num: string, index: number, e: Event) {
  e.stopPropagation();
  carouselIndexes.value[num] = index;
}

function openCarouselImage(image: string, e: Event) {
  e.stopPropagation();
  activeCarouselImage.value = image;
}

function closeCarouselImage() {
  activeCarouselImage.value = null;
}
</script>

<template>
  <section class="px-10 py-[100px] border-t border-[var(--line)]" id="work">
    <div class="flex items-center gap-4 mb-[60px]">
      <span class="text-[11px] text-[var(--dim)] tracking-[2px]">02</span>
      <div class="flex-1 h-px bg-[var(--line)]"></div>
      <span class="font-[var(--display)] text-[11px] font-bold text-[var(--muted)] tracking-[4px] uppercase">Selected work</span>
    </div>
    <div class="flex flex-col">
      <div v-for="project in projectItems" :key="project.num"
        class="project-row reveal flex flex-col py-8 border-b border-[var(--line)] cursor-pointer relative overflow-hidden transition-[padding-left,background-color] duration-300 first:border-t first:border-[var(--line)] hover:pl-4 hover:bg-[var(--line)] group"
        @click="toggleProject(project.num)">
        <div class="grid gap-8 items-start w-full" style="grid-template-columns:80px 1fr auto">
          <div class="text-[11px] text-[var(--dim)] pt-1 font-[var(--mono)]">{{ project.num }}</div>
          <div>
            <div class="font-[var(--display)] text-[28px] font-bold text-[var(--white)] tracking-[-1px] mb-2 leading-[1.1] transition-colors duration-200 group-hover:text-[var(--accent)]">{{ project.title }}</div>
            <div class="text-[13px] text-[var(--muted)] leading-[1.7] max-w-[560px]">{{ project.desc }}</div>
            <div class="flex gap-1.5 flex-wrap mt-3.5">
              <span v-for="tag in project.tags" :key="`${project.num}-${tag}`"
                class="text-[10px] px-2.5 py-0.5 border border-[var(--line2)] rounded-sm text-[var(--dim)] tracking-[1px] uppercase">{{ tag }}</span>
            </div>
            <div class="proj-expanded-content" :class="{ 'is-expanded': expandedProject === project.num }" @click.stop>
              <div class="min-h-0 flex flex-col gap-6">
                <div v-if="project.images && project.images.length"
                  class="relative w-full max-w-[760px] border border-[var(--line2)] rounded overflow-hidden bg-[var(--bg2)] glass-panel" style="aspect-ratio:16/8.5">
                  <div class="flex h-full transition-transform duration-500" :style="{ transform: `translateX(-${(carouselIndexes[project.num] || 0) * 100}%)` }">
                    <button v-for="(img, idx) in project.images" :key="idx"
                      class="w-full h-full p-0 border-0 bg-transparent cursor-zoom-in shrink-0"
                      type="button" @click="openCarouselImage(img, $event)">
                      <img :src="img" class="w-full h-full object-contain block bg-[var(--bg2)]" :alt="`Project image ${idx + 1}`" />
                    </button>
                  </div>
                  <button v-if="project.images.length > 1"
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/60 border border-[var(--line2)] text-white rounded-full backdrop-blur-sm transition-all z-[2] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)]"
                    @click="prevImage(project.num, project.images.length, $event)">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button v-if="project.images.length > 1"
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-black/60 border border-[var(--line2)] text-white rounded-full backdrop-blur-sm transition-all z-[2] hover:bg-[var(--accent)] hover:text-[var(--bg)] hover:border-[var(--accent)]"
                    @click="nextImage(project.num, project.images.length, $event)">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <div v-if="project.images.length > 1"
                    class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[2] bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                    <button v-for="(_, idx) in project.images" :key="idx"
                      class="w-1.5 h-1.5 rounded-full border-0 p-0 cursor-pointer transition-all"
                      :class="(carouselIndexes[project.num] || 0) === idx ? 'bg-[var(--accent)] scale-125' : 'bg-white/30 hover:bg-white/60'"
                      @click="setCarouselIndex(project.num, idx, $event)"></button>
                  </div>
                </div>
                <div v-if="project.fullDesc || project.repoUrl || project.demoUrl"
                  class="w-[min(100%,760px)] flex flex-col gap-4">
                  <div v-if="project.fullDesc" class="text-sm text-[var(--muted)] leading-[1.8]">{{ project.fullDesc }}</div>
                  <div v-if="project.repoUrl || project.demoUrl" class="flex gap-4 flex-wrap">
                    <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-[var(--bg)] border border-[var(--accent)] rounded font-[var(--mono)] text-[11px] font-semibold tracking-[1px] uppercase cursor-pointer transition-all hover:bg-transparent hover:text-[var(--accent)]"
                      @click.stop>
                      Live Demo
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                    <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-[var(--white)] border border-[var(--line2)] rounded font-[var(--mono)] text-[11px] font-medium tracking-[1px] uppercase cursor-pointer transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      @click.stop>
                      Repository
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-1 text-right">
            <div class="text-[11px] text-[var(--dim)] mb-2">{{ project.year }}</div>
            <a class="proj-link inline-flex items-center gap-1.5 text-[11px] text-[var(--muted)] no-underline tracking-[1px] uppercase transition-all duration-300 border border-transparent px-3 py-1.5 rounded-sm group-hover:text-[var(--white)] group-hover:translate-x-1"
              href="#" @click.prevent.stop="toggleProject(project.num)">
              <template v-if="expandedProject === project.num">
                Close
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </template>
              <template v-else>
                {{ project.linkLabel }}
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </template>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div v-if="activeCarouselImage" class="fixed inset-0 z-[3000] bg-black/92 flex items-center justify-center p-6" @click.self="closeCarouselImage">
    <button class="fixed top-5 right-5 w-[42px] h-[42px] flex items-center justify-center rounded-full border border-white/20 bg-black/35 text-white cursor-pointer hover:bg-white/10 transition-colors" type="button" @click="closeCarouselImage">
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
    <img :src="activeCarouselImage" alt="Project image full screen" class="max-h-[92vh] object-contain rounded-lg shadow-2xl" style="width:min(96vw,1600px)" />
  </div>
</template>
