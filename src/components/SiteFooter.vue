<script setup lang="ts">
defineProps<{
  timeText: string;
}>();
</script>

<template>
  <footer class="flex justify-between items-center px-10 py-6 border-t border-[var(--line)] text-[11px] text-[var(--dim)] tracking-[1px]">
    <div class="flex items-center gap-3">
      <span class="text-[var(--accent)]">Zin.</span>
      <span>© 2026 Meljun Mariquit. Built with TypeScript + CSS.</span>
    </div>
    <div>
      <span>{{ timeText }}</span>
    </div>
  </footer>
</template>
