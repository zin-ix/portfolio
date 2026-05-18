<template>
  <section class="px-10 py-[100px] border-t border-[var(--line)]" id="stack">

    <div class="flex items-center gap-4 mb-[60px]">
      <span class="text-[11px] text-[var(--dim)] tracking-[2px]">01</span>
      <div class="flex-1 h-px bg-[var(--line)]"></div>
      <span class="font-[var(--display)] text-[11px] font-bold text-[var(--muted)] tracking-[4px] uppercase">Tech stack</span>
    </div>

    <div class="orbital-shell reveal">

      <div class="orb-legend glass-panel">
        <div class="orb-legend-title">Mastery</div>

        <button
          v-for="(ring, i) in rings"
          :key="ring.label"
          class="orb-ring-btn"
          :class="{ active: activeRing === i }"
          @click="selectRing(i)"
        >
          <span class="orb-ring-pip" :style="{
            background: activeRing === i ? ring.color : 'transparent',
            borderColor: ring.color,
          }"></span>
          <span class="orb-ring-label">{{ ring.label }}</span>
          <span class="orb-ring-count">{{ ring.skills.length }}</span>
        </button>

        <div class="orb-stats">
          <div class="orb-stat">
            <div class="orb-stat-num">{{ allSkills.length }}</div>
            <div class="orb-stat-lbl">Skills</div>
          </div>
          <div class="orb-stat">
            <div class="orb-stat-num">1</div>
            <div class="orb-stat-lbl">Year</div>
          </div>
        </div>
      </div>

      <div class="orb-canvas">
        <svg
          viewBox="0 0 380 380"
          width="380"
          height="380"
          class="orb-svg"
          xmlns="http://www.w3.org/2000/svg"
          style="overflow:visible"
        >
          <defs>
            <path
              v-for="(ring, i) in rings"
              :key="`lp-${i}`"
              :id="`lp-${i}`"
              :d="`M ${CX - ring.r + 4} ${CY} a ${ring.r - 4} ${ring.r - 4} 0 0 1 ${(ring.r - 4) * 2} 0`"
            />
          </defs>

          <!-- Orbit rings -->
          <circle
            v-for="(ring, i) in rings"
            :key="`c-${i}`"
            :cx="CX" :cy="CY" :r="ring.r"
            fill="none"
            :stroke="activeRing === i ? ring.color : 'var(--line)'"
            :stroke-width="activeRing === i ? 1 : 0.5"
            :stroke-dasharray="activeRing === i ? 'none' : '3 7'"
            style="transition: stroke 0.3s, stroke-width 0.3s"
          />

          <!-- Ring arc labels -->
          <text
            v-for="(ring, i) in rings"
            :key="`lt-${i}`"
            font-size="8.5"
            letter-spacing="1.5"
            font-family="var(--mono)"
            :fill="activeRing === i ? ring.color : 'var(--dim)'"
            style="transition: fill 0.3s"
          >
            <textPath :href="`#lp-${i}`" startOffset="5%">{{ ring.label.toUpperCase() }}</textPath>
          </text>

          <!-- Skills on active ring -->
          <g v-if="activeRingObj">
            <g
              v-for="(skill, j) in (activeRingObj?.skills ?? [])"
              :key="`sk-${j}`"
              style="cursor:pointer"
              @mouseenter="hoveredSkill = skill.name"
              @mouseleave="hoveredSkill = null"
            >
              <!-- Static spoke base line -->
              <line
                :x1="CX" :y1="CY"
                :x2="dotX(j, activeRingObj.skills.length, activeRingObj.r)"
                :y2="dotY(j, activeRingObj.skills.length, activeRingObj.r)"
                stroke="var(--line)"
                stroke-width="0.5"
                :stroke-dasharray="hoveredSkill === skill.name ? 'none' : '2 5'"
                style="transition: stroke 0.2s"
              />

              <!--
                Signal pulse overlay — one animated line per spoke.
                stroke-dasharray = [pulse-length] [gap] so a single dash travels.
                stroke-dashoffset animates from full-length (off-canvas) to 0.
                Each spoke gets a unique animation-delay via inline style.
                The animation is keyed to activeRing so it restarts on ring switch.
              -->
              <line
                :key="`pulse-${activeRing}-${j}`"
                :x1="CX" :y1="CY"
                :x2="dotX(j, activeRingObj.skills.length, activeRingObj.r)"
                :y2="dotY(j, activeRingObj.skills.length, activeRingObj.r)"
                :stroke="activeRingObj.color"
                stroke-width="1.5"
                stroke-linecap="round"
                :stroke-dasharray="`10 ${activeRingObj.r + 20}`"
                :stroke-dashoffset="activeRingObj.r + 30"
                class="signal-pulse"
                :style="`
                  animation: signalTravel ${1.4 + j * 0.05}s linear ${j * pulseStagger}ms infinite;
                `"
              />

              <!-- Dot -->
              <circle
                :cx="dotX(j, activeRingObj.skills.length, activeRingObj.r)"
                :cy="dotY(j, activeRingObj.skills.length, activeRingObj.r)"
                :r="hoveredSkill === skill.name ? 7 : 4.5"
                :fill="hoveredSkill === skill.name ? activeRingObj.color : 'var(--bg)'"
                :stroke="activeRingObj.color"
                stroke-width="1.5"
                style="transition: r 0.2s ease, fill 0.2s ease"
              />

              <!-- Flash ring on dot when pulse arrives -->
              <circle
                :key="`flash-${activeRing}-${j}`"
                :cx="dotX(j, activeRingObj.skills.length, activeRingObj.r)"
                :cy="dotY(j, activeRingObj.skills.length, activeRingObj.r)"
                r="4.5"
                fill="none"
                :stroke="activeRingObj.color"
                stroke-width="1"
                class="dot-flash"
                :style="`
                  animation: dotFlash ${1.4 + j * 0.05}s linear ${j * pulseStagger}ms infinite;
                `"
              />

              <!-- Skill label -->
              <text
                :x="labelX(j, activeRingObj.skills.length, activeRingObj.r)"
                :y="labelY(j, activeRingObj.skills.length, activeRingObj.r)"
                :text-anchor="labelAnchor(j, activeRingObj.skills.length)"
                :dominant-baseline="labelBaseline(j, activeRingObj.skills.length)"
                font-size="9.5"
                font-family="var(--mono)"
                :fill="hoveredSkill === skill.name ? activeRingObj.color : 'var(--muted)'"
                style="transition: fill 0.2s; pointer-events:none; user-select:none"
              >{{ skill.name }}</text>
            </g>
          </g>

          <!-- Core -->
          <circle :cx="CX" :cy="CY" r="20" fill="var(--bg)" stroke="var(--line2)" stroke-width="0.5" />

          <!-- Core pulse ring — emits outward continuously -->
          <circle
            :cx="CX" :cy="CY" r="20"
            fill="none"
            :stroke="activeRingObj?.color ?? 'var(--accent)'"
            stroke-width="1"
            class="core-emit"
          />

          <circle :cx="CX" :cy="CY" r="5" fill="var(--accent)" />
          <text
            :x="CX" :y="CY + 30"
            text-anchor="middle"
            font-size="8"
            font-family="var(--mono)"
            fill="var(--dim)"
            letter-spacing="1.5"
          >CORE</text>
        </svg>
      </div>

      <div class="orb-detail glass-panel">
        <div class="orb-ring-meta">
          <div class="orb-detail-label" :style="{ color: activeRingObj?.color ?? 'var(--muted)' }">
            {{ activeRingObj?.label ?? '' }}
          </div>
          <div class="orb-detail-count">
            {{ activeRingObj?.skills?.length ?? 0 }}
            <span>skill{{ (activeRingObj?.skills?.length ?? 0) !== 1 ? 's' : '' }}</span>
          </div>
        </div>

        <div class="orb-chip-list">
          <button
            v-for="skill in (activeRingObj?.skills ?? [])"
            :key="skill.name"
            class="orb-chip"
            :class="{ hovered: hoveredSkill === skill.name }"
            @mouseenter="hoveredSkill = skill.name"
            @mouseleave="hoveredSkill = null"
          >
            <span class="chip-dot" :style="{ background: hoveredSkill === skill.name ? (activeRingObj?.color ?? 'var(--dim)') : 'var(--dim)' }"></span>
            <span class="chip-name">{{ skill.name }}</span>
            <span class="chip-cat">{{ skill.cat }}</span>
            <span class="chip-yrs">{{ skill.yrs }}</span>
          </button>
        </div>

        <div class="ohd" :class="{ visible: !!hoveredSkill }">
          <template v-if="hoveredSkillData">
            <div class="ohd-name">{{ hoveredSkillData.name }}</div>
            <div class="ohd-bar-row">
              <div class="ohd-bar">
                <div class="ohd-fill" :style="{ width: hoveredSkillData.pct + '%' }"></div>
              </div>
              <span class="ohd-pct">{{ hoveredSkillData.pct }}%</span>
            </div>
            <div class="ohd-sub">{{ hoveredSkillData.cat }} · {{ hoveredSkillData.yrs }}</div>
          </template>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Skill {
  name: string;
  cat: string;
  pct: number;
  yrs: string;
}

const CX = 190;
const CY = 190;
const LABEL_OFFSET = 16;

/*
  pulseStagger: ms between each spoke's pulse firing.
  Lower = faster cascade, higher = more spread out.
  180ms gives a nice sequential wave feel around the ring.
*/
const pulseStagger = 180;

const allSkills: Skill[] = [
  { name: 'Vue.js',       cat: 'Frontend',  pct: 92, yrs: '2yr' },
  { name: 'Tailwind',     cat: 'Frontend',  pct: 88, yrs: '2yr' },
  { name: 'HTML/CSS',     cat: 'Frontend',  pct: 90, yrs: '3yr' },
  { name: 'Laravel',      cat: 'Backend',   pct: 90, yrs: '2yr' },
  { name: 'PHP',          cat: 'Backend',   pct: 87, yrs: '2yr' },
  { name: 'JavaScript',   cat: 'Frontend',  pct: 86, yrs: '3yr' },
  { name: 'MySQL',        cat: 'Database',  pct: 86, yrs: '2yr' },
  { name: 'Git',          cat: 'Infra',     pct: 84, yrs: '3yr' },
  { name: 'ASP.NET',      cat: 'Backend',   pct: 82, yrs: '1yr' },
  { name: 'SQL Server',   cat: 'Database',  pct: 80, yrs: '1yr' },
  { name: 'C#',           cat: 'Backend',   pct: 80, yrs: '1yr' },
  { name: 'TypeScript',   cat: 'Frontend',  pct: 78, yrs: '2yr' },
  { name: 'WebSockets',   cat: 'Infra',     pct: 78, yrs: '1yr' },
  { name: 'Java',         cat: 'Languages', pct: 76, yrs: '2yr' },
  { name: 'Firebase',     cat: 'Database',  pct: 74, yrs: '1yr' },
  { name: 'Supabase',     cat: 'Database',  pct: 72, yrs: '1yr' },
  { name: 'Python',       cat: 'Languages', pct: 72, yrs: '2yr' },
  { name: 'Flutter',      cat: 'Mobile',    pct: 64, yrs: '6mo' },
  { name: 'ESP32',        cat: 'Infra',     pct: 60, yrs: '6mo' },
];

const rings = computed(() => [
  {
    label: 'Expert',
    color: 'var(--accent)',
    r: 52,
    skills: allSkills.filter(s => s.pct >= 88),
  },
  {
    label: 'Advanced',
    color: 'var(--white)',
    r: 95,
    skills: allSkills.filter(s => s.pct >= 78 && s.pct < 88),
  },
  {
    label: 'Mid-level',
    color: 'var(--muted)',
    r: 138,
    skills: allSkills.filter(s => s.pct >= 68 && s.pct < 78),
  },
  {
    label: 'Learning',
    color: 'var(--dim)',
    r: 172,
    skills: allSkills.filter(s => s.pct < 68),
  },
]);

const activeRing = ref(0);
const hoveredSkill = ref<string | null>(null);

const activeRingObj = computed(() => rings.value[activeRing.value] ?? null);

const hoveredSkillData = computed(() =>
  hoveredSkill.value ? allSkills.find(s => s.name === hoveredSkill.value) ?? null : null
);

function selectRing(i: number) {
  activeRing.value = i;
  hoveredSkill.value = null;
}

function angle(index: number, total: number): number {
  return (2 * Math.PI * index / total) - Math.PI / 2;
}
function dotX(index: number, total: number, r: number): number {
  return CX + r * Math.cos(angle(index, total));
}
function dotY(index: number, total: number, r: number): number {
  return CY + r * Math.sin(angle(index, total));
}
function labelX(index: number, total: number, r: number): number {
  return CX + (r + LABEL_OFFSET) * Math.cos(angle(index, total));
}
function labelY(index: number, total: number, r: number): number {
  return CY + (r + LABEL_OFFSET) * Math.sin(angle(index, total));
}
function labelAnchor(index: number, total: number): string {
  const x = Math.cos(angle(index, total));
  if (x > 0.15) return 'start';
  if (x < -0.15) return 'end';
  return 'middle';
}
function labelBaseline(index: number, total: number): string {
  const y = Math.sin(angle(index, total));
  if (y > 0.15) return 'hanging';
  if (y < -0.15) return 'auto';
  return 'middle';
}
</script>

<style>
/* ─────────────────────────────────────────
   Signal pulse keyframes
   ─────────────────────────────────────────

   signalTravel:
     The dash starts fully offset (invisible, behind the center dot).
     It travels outward to offset:0 (dot position) then jumps back.
     stroke-dasharray = "10 bigGap" means only a 10px dash is visible
     at any point; the gap swallows the rest of the line length.

   dotFlash:
     Timed to fire when the pulse arrives at the dot endpoint.
     Expands the dot's ghost ring and fades it out — like a ripple
     from the arriving signal packet.
────────────────────────────────────────── */
@keyframes signalTravel {
  0%   { stroke-dashoffset: 220; opacity: 0; }
  8%   { opacity: 1; }
  88%  { opacity: 1; }
  95%  { stroke-dashoffset: 0; opacity: 0.9; }
  100% { stroke-dashoffset: -10; opacity: 0; }
}

@keyframes dotFlash {
  0%   { r: 4.5; opacity: 0; }
  85%  { r: 4.5; opacity: 0; }
  90%  { r: 9;   opacity: 0.8; }
  100% { r: 14;  opacity: 0; }
}

/* Core emit ring — always-on ambient pulse from center */
@keyframes coreEmit {
  0%   { r: 20; opacity: 0.6; }
  100% { r: 36; opacity: 0; }
}
.core-emit {
  animation: coreEmit 2.2s ease-out infinite;
}

/* ── Shell ── */
.orbital-shell {
  display: grid;
  grid-template-columns: 170px 1fr 220px;
  border: 1px solid var(--line2);
  border-radius: 4px;
  overflow: hidden;
  min-height: 420px;
}

/* ── Legend ── */
.orb-legend {
  border-right: 1px solid var(--line);
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--bg2);
}
.orb-legend-title {
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--dim);
  margin-bottom: 14px;
  font-family: var(--mono);
}
.orb-ring-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
}
.orb-ring-btn:hover { background: var(--bg3); }
.orb-ring-btn.active { background: var(--bg3); border-color: var(--line2); }
.orb-ring-pip {
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 1.5px solid;
  flex-shrink: 0;
  transition: background 0.2s;
}
.orb-ring-label {
  font-size: 11px;
  color: var(--muted);
  font-family: var(--mono);
  flex: 1;
  transition: color 0.2s;
}
.orb-ring-btn.active .orb-ring-label { color: var(--white); }
.orb-ring-count {
  font-size: 11px;
  color: var(--dim);
  font-family: var(--mono);
}
.orb-ring-btn.active .orb-ring-count { color: var(--accent); }

.orb-stats {
  display: flex;
  gap: 16px;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
.orb-stat-num {
  font-family: var(--display);
  font-size: 24px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -1px;
  line-height: 1;
}
.orb-stat-lbl {
  font-size: 9px;
  color: var(--dim);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-family: var(--mono);
  margin-top: 4px;
}

/* ── Canvas ── */
.orb-canvas {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg);
  border-right: 1px solid var(--line);
}
.orb-svg { overflow: visible; }

/* ── Detail panel ── */
.orb-detail {
  padding: 24px 18px;
  background: var(--bg2);
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}
.orb-ring-meta { margin-bottom: 12px; }
.orb-detail-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 3px;
  text-transform: uppercase;
  transition: color 0.3s;
  margin-bottom: 2px;
}
.orb-detail-count {
  font-family: var(--display);
  font-size: 26px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -1px;
  line-height: 1.1;
}
.orb-detail-count span {
  font-size: 14px;
  color: var(--muted);
  font-weight: 400;
  letter-spacing: 0;
}

.orb-chip-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  overflow: hidden;
}
.orb-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
  text-align: left;
}
.orb-chip:hover,
.orb-chip.hovered {
  background: var(--bg3);
  border-color: var(--line);
}
.chip-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 0.15s;
}
.chip-name {
  font-size: 11px;
  color: var(--muted);
  font-family: var(--mono);
  flex: 1;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.orb-chip:hover .chip-name,
.orb-chip.hovered .chip-name { color: var(--white); }
.chip-cat {
  font-size: 9px;
  color: var(--dim);
  font-family: var(--mono);
  display: none;
}
.chip-yrs {
  font-size: 9px;
  color: var(--dim);
  font-family: var(--mono);
  flex-shrink: 0;
}

/* Hover detail bar */
.ohd {
  margin-top: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
  min-height: 58px;
}
.ohd.visible { opacity: 1; transform: translateY(0); }
.ohd-name {
  font-family: var(--display);
  font-size: 14px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}
.ohd-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}
.ohd-bar {
  flex: 1;
  height: 2px;
  background: var(--line);
  border-radius: 1px;
  overflow: hidden;
}
.ohd-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.ohd-pct {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
}
.ohd-sub {
  font-size: 9px;
  color: var(--dim);
  font-family: var(--mono);
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .orbital-shell {
    grid-template-columns: 1fr;
  }
  .orb-legend {
    border-right: none;
    border-bottom: 1px solid var(--line);
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding: 16px 20px;
    gap: 8px;
  }
  .orb-legend-title { width: 100%; margin-bottom: 0; }
  .orb-stats { margin-top: 0; padding-top: 0; border-top: none; margin-left: auto; }
  .orb-canvas { border-right: none; border-bottom: 1px solid var(--line); }
}
</style>