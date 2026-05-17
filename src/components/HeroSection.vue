<template>
  <section class="min-h-screen grid grid-rows-[1fr_auto] px-10 relative overflow-hidden">
    <div class="hero-grid-lines absolute inset-0 pointer-events-none"></div>

    <div class="flex flex-col md:flex-row justify-between items-start pt-20 pb-10 max-w-[1400px] relative gap-15">
      <!-- Left -->
      <div class="flex-1 flex flex-col justify-center">
        <div class="hero-overline flex items-center gap-3 text-[11px] text-[var(--muted)] tracking-[3px] uppercase mb-8">
          <div class="w-8 h-px bg-[var(--muted)]"></div>
          Full-stack engineer · open to work
        </div>

        <h1 class="hero-name font-[var(--display)] font-extrabold leading-none text-[var(--white)]"
          style="font-size:clamp(48px,7vw,96px);letter-spacing:-3px">
          Meljun<br>
          <span class="block line2">Mariquit</span>
        </h1>

        <p class="text-base text-[var(--muted)] leading-[1.7] max-w-[520px] mt-6"
          style="opacity:0;animation:fadeUp 0.8s ease 2s forwards">
          I engineer high-performance, scalable web applications with a focus on modern aesthetics, seamless user experiences, and robust backend architecture.
        </p>

        <div class="flex gap-4 mt-10" style="opacity:0;animation:fadeUp 0.8s ease 2.2s forwards">
          <button
            class="group inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] border border-[var(--accent)] rounded font-[var(--mono)] text-xs font-semibold tracking-[1px] uppercase cursor-pointer transition-all hover:bg-transparent hover:text-[var(--accent)]"
            onclick="document.getElementById('work').scrollIntoView({behavior:'smooth'})">
            View Projects
            <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          <button
            class="group inline-flex items-center gap-2 px-6 py-3 bg-transparent text-[var(--white)] border border-[var(--line2)] rounded font-[var(--mono)] text-xs font-medium tracking-[1px] uppercase cursor-pointer transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">
            Contact Me
            <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Right: Terminal -->
      <div class="flex-1 flex items-center justify-end">
        <div class="border border-[var(--line2)] rounded overflow-hidden w-full max-w-[560px] glass-panel"
          style="opacity:0;animation:fadeUp 0.7s ease 2.2s forwards">
          <div class="flex items-center gap-1.5 bg-[var(--bg3)] px-3.5 py-2.5 border-b border-[var(--line)]">
            <div class="w-2.5 h-2.5 rounded-full" style="background:#ff5f57"></div>
            <div class="w-2.5 h-2.5 rounded-full" style="background:#febc2e"></div>
            <div class="w-2.5 h-2.5 rounded-full" style="background:#28c840"></div>
            <span class="text-[11px] text-[var(--muted)] ml-2.5">~/portfolio — zsh</span>
          </div>
          <div class="p-4 text-xs leading-[2] bg-white/[0.02] term-container">
            <span class="text-[var(--accent)]">❯ </span>
            <span ref="typedCmdEl" class="term-text text-[var(--white)]"></span><br>
            <span class="text-[var(--accent2)]">name:</span><span class="term-text text-[var(--white)]">     "Meljun Mariquit"</span><br>
            <span class="text-[var(--accent2)]">role:</span><span class="term-text text-[var(--white)]">     "Full-stack Developer"</span><br>
            <span class="text-[var(--accent2)]">stack:</span><span class="term-text text-[var(--white)]">    ["TypeScript","Vue","Asp.NET","Laravel","SQL Server"]</span><br>
            <span class="text-[var(--accent2)]">status:</span><span class="term-text text-[var(--white)]">   <span class="text-[var(--accent)]">OPEN_TO_WORK</span></span><br>
            <span class="text-[var(--accent2)]">yoe:</span><span class="term-text text-[var(--white)]">      null</span><br>
            <span class="text-[var(--accent)]">❯ </span>
            <span class="inline-block w-2 h-3.5 bg-[var(--accent)] align-middle" style="animation:blink 1s step-end infinite"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="flex justify-between items-end py-7 border-t border-[var(--line)]"
      style="opacity:0;animation:fadeUp 0.6s ease 2.5s forwards">
      <div class="flex items-center gap-2.5 text-[10px] text-[var(--dim)] tracking-[2px] uppercase">
        <div class="scroll-line w-px h-10 bg-[var(--line2)] relative overflow-hidden"></div>
        Scroll
      </div>
      <div class="flex gap-10">
        <div v-for="stat in stats" :key="stat.lbl" class="text-right">
          <div class="font-[var(--display)] text-3xl font-extrabold text-[var(--white)] leading-none tracking-[-1px]">{{ stat.num }}</div>
          <div class="text-[10px] text-[var(--dim)] tracking-[2px] uppercase mt-1">{{ stat.lbl }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const typedCmdEl = ref<HTMLElement | null>(null);
let typingTimeout: number | null = null;

const stats = [
  { num: '14+', lbl: 'Projects'   },
  { num: '1yr', lbl: 'Experience' },
  { num: '100%', lbl: 'Commitment' },
];

function typeCmd(cmds: string[], ci: number, cc: number, typing: boolean) {
  const cmd = cmds[ci % cmds.length];
  if (!typedCmdEl.value || !cmd) return;
  if (typing) {
    cc++;
    typedCmdEl.value.textContent = cmd.slice(0, cc);
    if (cc >= cmd.length) {
      typingTimeout = window.setTimeout(() => typeCmd(cmds, ci, cc, false), 1800);
      return;
    }
    typingTimeout = window.setTimeout(() => typeCmd(cmds, ci, cc, true), 80 + Math.random() * 40);
  } else {
    cc--;
    typedCmdEl.value.textContent = cmd.slice(0, cc);
    if (cc <= 0) {
      typingTimeout = window.setTimeout(() => typeCmd(cmds, ci + 1, 0, true), 400);
      return;
    }
    typingTimeout = window.setTimeout(() => typeCmd(cmds, ci, cc, false), 40);
  }
}

onMounted(() => {
  typingTimeout = window.setTimeout(
    () => typeCmd(['cat developer.json', 'git log --oneline', 'npm run ship'], 0, 0, true),
    2400
  );
});

onUnmounted(() => {
  if (typingTimeout) clearTimeout(typingTimeout);
});
</script>

<style>
.hero-grid-lines {
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 60px 60px;
}
.hero-overline { opacity: 0; animation: fadeUp 0.6s ease 1.6s forwards; }
.hero-name     { opacity: 0; animation: heroReveal 1s cubic-bezier(0.16,1,0.3,1) 1.8s forwards; }

@keyframes heroReveal {
  from { opacity: 0; transform: translateY(40px) skewY(2deg); }
  to   { opacity: 1; transform: translateY(0) skewY(0deg); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.line2 {
  color: transparent;
  -webkit-text-stroke: 1px rgba(240,237,232,0.25);
}
body.light-mode .line2 {
  -webkit-text-stroke: 1px var(--accent);
}

.scroll-line::after {
  content: '';
  position: absolute; top: -100%;
  width: 100%; height: 100%;
  background: var(--accent);
  animation: scrollDrop 2s ease-in-out infinite;
}
@keyframes scrollDrop { 0%{top:-100%} 100%{top:200%} }

:global(body.light-mode) .term-text {
  color: var(--accent) !important;
}
</style>