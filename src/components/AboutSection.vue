<script setup lang="ts">
import type { AboutTag } from '@/interfaces/profile-data.interfaces';

defineProps<{
  aboutTags: AboutTag[];
}>();
</script>

<template>
  <section class="px-10 py-[100px] border-t border-[var(--line)]" id="about">
    <div class="flex items-center gap-4 mb-[60px]">
      <span class="text-[11px] text-[var(--dim)] tracking-[2px]">03</span>
      <div class="flex-1 h-px bg-[var(--line)]"></div>
      <span class="font-[var(--display)] text-[11px] font-bold text-[var(--muted)] tracking-[4px] uppercase">About</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[60px] items-start">
      <div class="reveal">
        <div class="font-[var(--display)] text-5xl font-extrabold tracking-[-2px] leading-[1.05] text-[var(--white)] mb-6">
          I build <em class="not-italic" style="color:transparent;-webkit-text-stroke:1px rgba(240,237,232,0.3)">fast,</em><br>ship clean.
        </div>
        <div class="text-base text-[var(--muted)] leading-[1.8] max-w-[560px] mb-8">Systems thinker and full-stack engineer obsessed with performance, developer experience, and building things that outlast the sprint. I've shipped infrastructure that handles millions of daily events and UIs used by hundreds of thousands of people.</div>
        <div class="flex flex-col">
          <div v-for="tag in aboutTags" :key="tag.label"
            class="flex justify-between py-3 border-b border-[var(--line)] text-xs">
            <span class="text-[var(--dim)] tracking-[1px]">{{ tag.label }}</span>
            <span class="text-[var(--white)] font-medium" :style="tag.accent ? 'color:var(--accent)' : undefined">{{ tag.value }}</span>
          </div>
        </div>
      </div>
      <div class="reveal bg-[var(--bg2)] border border-[var(--line2)] rounded overflow-hidden text-xs leading-[1.8] glass-panel">
        <div class="flex items-center gap-2 bg-[var(--bg3)] px-4 py-2.5 border-b border-[var(--line)]">
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full" style="background:#ff5f57"></div>
            <div class="w-2.5 h-2.5 rounded-full" style="background:#febc2e"></div>
            <div class="w-2.5 h-2.5 rounded-full" style="background:#28c840"></div>
          </div>
          <div class="text-[11px] text-[var(--muted)] ml-2 tracking-[1px]">developer.ts</div>
        </div>
        <div class="p-5">
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">1</span><span class="token-keyword">interface</span> <span class="token-type">Developer</span> <span class="text-[var(--muted)]">{</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">2</span>  name<span class="text-[var(--muted)]">:</span> <span class="token-type">string</span><span class="text-[var(--muted)]">;</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">3</span>  stack<span class="text-[var(--muted)]">:</span> <span class="token-type">string[]</span><span class="text-[var(--muted)]">;</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">4</span>  available<span class="text-[var(--muted)]">:</span> <span class="token-type">boolean</span><span class="text-[var(--muted)]">;</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">5</span><span class="text-[var(--muted)]">}</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">6</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">7</span><span class="token-keyword">const</span> <span class="token-func">me</span><span class="text-[var(--muted)]">:</span> <span class="token-type">Developer</span> <span class="text-[var(--muted)]">= {</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">8</span>  name<span class="text-[var(--muted)]">:</span> <span class="token-string">"Meljun Mariquit"</span><span class="text-[var(--muted)]">,</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">9</span>  stack<span class="text-[var(--muted)]">: [</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">10</span>    <span class="token-string">"TypeScript"</span><span class="text-[var(--muted)]">,</span> <span class="token-string">"PHP"</span><span class="text-[var(--muted)]">,</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">11</span>    <span class="token-string">"Vue.js"</span><span class="text-[var(--muted)]">,</span> <span class="token-string">"ASP.NET"</span><span class="text-[var(--muted)]">,</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">12</span>    <span class="token-string">"SQL Server"</span><span class="text-[var(--muted)]">,</span> <span class="token-string">"PostgreSQL"</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">13</span>  <span class="text-[var(--muted)]">],</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">14</span>  available<span class="text-[var(--muted)]">:</span> <span class="token-keyword">true</span><span class="text-[var(--muted)]">,</span> <span class="text-[var(--dim)] italic">// ← hire me</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">15</span><span class="text-[var(--muted)]">};</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">16</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">17</span><span class="token-keyword">async function</span> <span class="token-func">collaborate</span><span class="text-[var(--muted)]">(</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">18</span>  idea<span class="text-[var(--muted)]">:</span> <span class="token-type">string</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">19</span><span class="text-[var(--muted)]">) {</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">20</span>  <span class="token-keyword">return await</span> <span class="token-func">ship</span><span class="text-[var(--muted)]">(</span>idea<span class="text-[var(--muted)]">);</span></span>
<span class="block py-px"><span class="text-[var(--dim)] select-none mr-5 inline-block w-5 text-right">21</span><span class="text-[var(--muted)]">}</span></span>
        </div>
      </div>
    </div>
  </section>
</template>
