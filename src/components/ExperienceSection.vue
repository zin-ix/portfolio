<script setup lang="ts">
import type { ExperienceItem } from '@/interfaces/profile-data.interfaces';

defineProps<{
  experienceItems: ExperienceItem[];
}>();
</script>

<template>
  <section class="px-10 py-[100px] border-t border-[var(--line)]" id="exp">
    <div class="flex items-center gap-4 mb-[60px]">
      <span class="text-[11px] text-[var(--dim)] tracking-[2px]">04</span>
      <div class="flex-1 h-px bg-[var(--line)]"></div>
      <span class="font-[var(--display)] text-[11px] font-bold text-[var(--muted)] tracking-[4px] uppercase">Experience</span>
    </div>
    <div class="flex flex-col">
      <div v-for="item in experienceItems" :key="item.period"
        class="reveal grid gap-10 py-10 border-b border-[var(--line)]" style="grid-template-columns:200px 1fr">
        <div>
          <div class="text-[11px] text-[var(--dim)] tracking-[1px] mb-2">{{ item.period }}</div>
          <div class="font-[var(--display)] text-xl font-extrabold text-[var(--white)] tracking-[-0.5px]">{{ item.company }}</div>
        </div>
        <div>
          <div class="text-base font-medium text-[var(--white)] mb-2.5">{{ item.role }}</div>
          <div class="text-[13px] text-[var(--muted)] leading-[1.7] mb-3.5">{{ item.desc }}</div>
          <div class="flex gap-1.5 flex-wrap">
            <span v-for="tech in item.tech" :key="`${item.period}-${tech}`"
              class="text-[10px] px-2 py-0.5 exp-tag border rounded-sm text-[var(--accent)] tracking-[1px] uppercase">{{ tech }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
