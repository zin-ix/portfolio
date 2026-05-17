<script setup lang="ts">
import { aboutTags, contactLinks, experienceItems, projectItems, stackItems } from '@/utils/profile-data.utils';
import { ref, onMounted, onUnmounted } from 'vue';

// Refs for DOM elements
const loaderEl = ref<HTMLElement | null>(null);
const cursorEl = ref<HTMLElement | null>(null);
const cursorRingEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);
const typedCmdEl = ref<HTMLElement | null>(null);
const tbTimeEl = ref<HTMLElement | null>(null);
const footerTimeEl = ref<HTMLElement | null>(null);
const activeProjectImage = ref<string | null>(null);

// State variables
const mousePos = ref({ x: -999, y: -999 });
const cursorPos = ref({ x: 0, y: 0 });
const isDarkMode = ref(true);
let cursorRingPos = { x: 0, y: 0 };

// Canvas and particles
let particles: any[] = [];
let W = 0, H = 0;
let canvas2dCtx: CanvasRenderingContext2D | null = null;

// Animation and timer IDs
let loaderTimeout: number | null = null;
let typingTimeout: number | null = null;
let clockInterval: number | null = null;
let animationFrameId: number | null = null;
let cursorRingFrameId: number | null = null;
let intersectionObserver: IntersectionObserver | null = null;

// Particle initialization
function initParticles() {
  particles = [];
  const cols = Math.floor(W / 50);
  const rows = Math.floor(H / 50);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = (i / cols) * W + 40;
      const y = (j / rows) * H + 40;
      particles.push({
        x, y,
        ox: x,
        oy: y,
        vx: 0, vy: 0,
        size: Math.random() * 1.2 + 0.3
      });
    }
  }
}

function drawParticles() {
  if (!canvas2dCtx) return;
  
  const glowColor = isDarkMode.value ? [200, 255, 0] : [37, 99, 235];
  const baseColor = isDarkMode.value ? [255, 255, 255] : [100, 100, 100];
  const lineColor = isDarkMode.value ? [255, 255, 255] : [37, 99, 235];
  
  canvas2dCtx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    const dx = mousePos.value.x - p.x;
    const dy = mousePos.value.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.max(0, 120 - dist) / 120;
    p.vx += (-dx / dist || 0) * force * 2.5;
    p.vy += (-dy / dist || 0) * force * 2.5;
    p.vx += (p.ox - p.x) * 0.06;
    p.vy += (p.oy - p.y) * 0.06;
    p.vx *= 0.82;
    p.vy *= 0.82;
    p.x += p.vx;
    p.y += p.vy;

    const glow = Math.min(1, force * 3);
    canvas2dCtx!.beginPath();
    canvas2dCtx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    if (glow > 0.1) {
      canvas2dCtx!.fillStyle = `rgba(${glowColor[0]},${glowColor[1]},${glowColor[2]},${0.2 + glow * 0.7})`;
    } else {
      const opacity = isDarkMode.value ? 0.12 : 0.25;
      canvas2dCtx!.fillStyle = `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${opacity})`;
    }
    canvas2dCtx!.fill();
  });

  // Draw connecting lines for nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        canvas2dCtx!.beginPath();
        canvas2dCtx!.moveTo(particles[i].x, particles[i].y);
        canvas2dCtx!.lineTo(particles[j].x, particles[j].y);
        const lineOpacity = isDarkMode.value ? (1 - d / 90) * 0.05 : (1 - d / 90) * 0.12;
        canvas2dCtx!.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${lineOpacity})`;
        canvas2dCtx!.lineWidth = 0.5;
        canvas2dCtx!.stroke();
      }
    }
  }

  animationFrameId = requestAnimationFrame(drawParticles);
}

function handleWindowResize() {
  if (!canvasEl.value) return;
  W = canvasEl.value.width = window.innerWidth;
  H = canvasEl.value.height = window.innerHeight;
  initParticles();
}

function openProjectImage(image: string) {
  activeProjectImage.value = image;
}

function closeProjectImage() {
  activeProjectImage.value = null;
}

// Typed command animation
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

// Clock update
function updateTime() {
  const now = new Date();
  const t = now.toLocaleTimeString('en-US', { hour12: false });
  if (tbTimeEl.value) {
    tbTimeEl.value.textContent = t;
  }
  if (footerTimeEl.value) {
    footerTimeEl.value.textContent = `SF ${t}`;
  }
}

// Cursor ring animation
function animateCursorRing() {
  if (!cursorRingEl.value) return;
  
  const mx = cursorPos.value.x;
  const my = cursorPos.value.y;
  
  cursorRingPos.x += (mx - cursorRingPos.x) * 0.12;
  cursorRingPos.y += (my - cursorRingPos.y) * 0.12;
  
  cursorRingEl.value.style.left = cursorRingPos.x + 'px';
  cursorRingEl.value.style.top = cursorRingPos.y + 'px';
  
  cursorRingFrameId = requestAnimationFrame(animateCursorRing);
}

// Scroll reveal setup
function setupScrollReveal() {
  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .stack-cell').forEach(el => {
    intersectionObserver!.observe(el);
  });

  // Stagger reveal delays
  document.querySelectorAll('.stack-cell').forEach((el, i) => {
    (el as HTMLElement).style.transitionDelay = `${i * 0.06}s`;
  });
  document.querySelectorAll('.project-row').forEach((el, i) => {
    (el as HTMLElement).style.transitionDelay = `${i * 0.08}s`;
  });
}

// Theme toggle
function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
  if (isDarkMode.value) {
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
  }
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
}

// Lifecycle hooks
onMounted(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  isDarkMode.value = savedTheme === 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    document.documentElement.setAttribute('data-theme', 'light');
  }
  // Hide loader after delay
  loaderTimeout = window.setTimeout(() => {
    if (loaderEl.value) {
      loaderEl.value.classList.add('hide');
    }
  }, 1600);

  // Setup cursor
  const handleMouseMove = (e: MouseEvent) => {
    if (cursorEl.value) {
      cursorPos.value.x = e.clientX;
      cursorPos.value.y = e.clientY;
      cursorEl.value.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
    }
    mousePos.value.x = e.clientX;
    mousePos.value.y = e.clientY;
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  
  // Start cursor ring animation
  animateCursorRing();

  // Setup canvas
  if (canvasEl.value) {
    canvas2dCtx = canvasEl.value.getContext('2d');
    handleWindowResize();
    drawParticles();
  }
  window.addEventListener('resize', handleWindowResize);

  // Start typed command animation
  const cmds = ['cat developer.json', 'git log --oneline', 'npm run ship'];
  typingTimeout = window.setTimeout(() => typeCmd(cmds, 0, 0, true), 2400);

  // Setup clock
  updateTime();
  clockInterval = window.setInterval(updateTime, 1000);

  // Setup scroll reveal
  setupScrollReveal();

  // Return cleanup function
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleWindowResize);
  };
});

onUnmounted(() => {
  if (loaderTimeout) clearTimeout(loaderTimeout);
  if (typingTimeout) clearTimeout(typingTimeout);
  if (clockInterval) clearInterval(clockInterval);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (cursorRingFrameId) cancelAnimationFrame(cursorRingFrameId);
  if (intersectionObserver) intersectionObserver.disconnect();
});
</script>
<template>
<!-- Cursor -->
<div id="cursor" ref="cursorEl"></div>
<div id="cursor-ring" ref="cursorRingEl"></div>

<!-- Canvas -->
<canvas id="canvas-bg" ref="canvasEl"></canvas>

<!-- Loader -->
<div id="loader" ref="loaderEl">
  <div style="font-family:'JetBrains Mono';font-size:11px;color:rgba(200,255,0,0.6);letter-spacing:3px;margin-bottom:16px">INITIALIZING</div>
  <div class="loader-line"></div>
  <div class="loader-text">loading portfolio.exe</div>
</div>

<main>

<!-- TOP BAR -->
<nav class="topbar">
  <div class="tb-logo">
    <div class="tb-logo-dot"></div>
    Meljun
  </div>
  <div class="tb-center">
    <span>Developer</span>
    <span class="tb-sep">/</span>
    <span>San Francisco</span>
    <span class="tb-sep">/</span>
    <span id="tb-time" ref="tbTimeEl">--:--:--</span>
  </div>
  <div class="tb-right">
    <a class="tb-link" href="#work">Work</a>
    <a class="tb-link" href="#about">About</a>
    <a class="tb-link" href="#exp">Exp</a>
    <button class="tb-theme" @click="toggleTheme" :title="isDarkMode ? 'Light mode' : 'Dark mode'">
      <svg v-if="isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    </button>
    <button class="tb-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">hire_me();</button>
  </div>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-grid-lines"></div>
  <div class="hero-center">
    <div class="hero-left">
      <div class="hero-overline">
        <div class="hero-overline-line"></div>
        Full-stack engineer · open to work
      </div>
      <h1 class="hero-name">
        Meljun<br>
        <span class="line2">Mariquit</span>
      </h1>
      <p class="hero-bio">
        I engineer high-performance, scalable web applications with a focus on modern aesthetics, seamless user experiences, and robust backend architecture.
      </p>
      <div class="hero-ctas">
        <button class="btn-primary" onclick="document.getElementById('work').scrollIntoView({behavior:'smooth'})">View Projects</button>
        <button class="btn-secondary" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Contact Me</button>
      </div>
    </div>
    <div class="hero-right">
      <div class="hero-terminal">
        <div class="ht-bar">
          <div class="ht-dot" style="background:#ff5f57"></div>
          <div class="ht-dot" style="background:#febc2e"></div>
          <div class="ht-dot" style="background:#28c840"></div>
          <span style="font-size:11px;color:var(--muted);margin-left:10px">~/portfolio — zsh</span>
        </div>
        <div class="ht-body">
          <span class="ht-prompt">❯ </span><span class="ht-cmd" id="typed-cmd" ref="typedCmdEl"></span><br>
          <span class="ht-key">name:</span><span class="ht-val">     "Meljun Mariquit"</span><br>
          <span class="ht-key">role:</span><span class="ht-val">     "Full-stack Developer"</span><br>
          <span class="ht-key">stack:</span><span class="ht-val">    ["TypeScript","Vue","Asp.NET","Laravel", "SQL Server"]</span><br>
          <span class="ht-key">status:</span><span class="ht-val">   <span style="color:var(--accent)">OPEN_TO_WORK</span></span><br>
          <span class="ht-key">yoe:</span><span class="ht-val">      null</span><br>
          <span class="ht-prompt">❯ </span><span class="ht-cursor"></span>
        </div>
      </div>
    </div>
  </div>
  <div class="hero-bottom">
    <div class="hero-scroll">
      <div class="scroll-line"></div>
      Scroll
    </div>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-num">14+</div>
        <div class="hero-stat-lbl">Projects</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num">8yr</div>
        <div class="hero-stat-lbl">Experience</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num">100%</div>
        <div class="hero-stat-lbl">Commitment</div>
      </div>
    </div>
  </div>
</section>

<!-- STACK -->
<section class="section" id="stack">
  <div class="section-header">
    <span class="sec-num">01</span>
    <div class="sec-line"></div>
    <span class="sec-title">Tech stack</span>
  </div>
  <div class="stack-grid">
    <div v-for="item in stackItems" :key="item.name" class="stack-cell reveal"><div class="stack-icon">{{ item.icon }}</div><div class="stack-name">{{ item.name }}</div><div class="stack-level">{{ item.level }}</div><div class="stack-bar"><div class="stack-bar-fill" :style="{ '--w': item.width }"></div></div></div>
  </div>
</section>

<!-- PROJECTS -->
<section class="section" id="work">
  <div class="section-header">
    <span class="sec-num">02</span>
    <div class="sec-line"></div>
    <span class="sec-title">Selected work</span>
  </div>
  <div class="projects-list">
    <div v-for="project in projectItems" :key="project.num" class="project-row reveal">
      <div class="proj-num">{{ project.num }}</div>
      <div class="proj-main">
        <div v-if="project.num === '004' && project.images?.length" class="proj-gallery">
          <div v-for="(image, index) in project.images" :key="`${project.num}-image-${index}`" class="proj-thumb">
            <img :src="image" :alt="`${project.title} preview ${index + 1}`" @click="openProjectImage(image)" />
          </div>
        </div>
        <div class="proj-title">{{ project.title }}</div>
        <div class="proj-desc">{{ project.desc }}</div>
        <div class="proj-tags">
          <span v-for="tag in project.tags" :key="`${project.num}-${tag}`" class="proj-tag">{{ tag }}</span>
        </div>
      </div>
      <div class="proj-right">
        <div class="proj-year">{{ project.year }}</div>
        <a class="proj-link" href="#">{{ project.linkLabel }}</a>
      </div>
    </div>
  </div>
</section>

<div v-if="activeProjectImage" class="image-lightbox" @click.self="closeProjectImage">
  <button class="image-lightbox-close" type="button" @click="closeProjectImage">×</button>
  <img :src="activeProjectImage" alt="Feather-toast-vue preview full screen" class="image-lightbox-img" />
</div>

<!-- ABOUT / CODE -->
<section class="section" id="about">
  <div class="section-header">
    <span class="sec-num">03</span>
    <div class="sec-line"></div>
    <span class="sec-title">About</span>
  </div>
  <div class="about-grid">
    <div class="about-text reveal">
      <div class="about-heading">I build <em>fast,</em><br>ship clean.</div>
      <div class="about-body">Systems thinker and full-stack engineer obsessed with performance, developer experience, and building things that outlast the sprint. I've shipped infrastructure that handles millions of daily events and UIs used by hundreds of thousands of people.</div>
      <div class="about-tags">
        <div v-for="tag in aboutTags" :key="tag.label" class="about-tag-row"><span class="at-label">{{ tag.label }}</span><span class="at-val" :style="tag.accent ? 'color:var(--accent)' : undefined">{{ tag.value }}</span></div>
      </div>
    </div>
    <div class="code-block reveal">
      <div class="cb-header">
        <div class="cb-dots">
          <div class="cb-dot" style="background:#ff5f57"></div>
          <div class="cb-dot" style="background:#febc2e"></div>
          <div class="cb-dot" style="background:#28c840"></div>
        </div>
        <div class="cb-filename">developer.ts</div>
      </div>
      <div class="cb-body">
<span class="cb-line"><span class="cb-ln">1</span><span class="kw">interface</span> <span class="ty">Developer</span> <span class="op">{</span></span>
<span class="cb-line"><span class="cb-ln">2</span>  name<span class="op">:</span> <span class="ty">string</span><span class="op">;</span></span>
<span class="cb-line"><span class="cb-ln">3</span>  stack<span class="op">:</span> <span class="ty">string[]</span><span class="op">;</span></span>
<span class="cb-line"><span class="cb-ln">4</span>  available<span class="op">:</span> <span class="ty">boolean</span><span class="op">;</span></span>
<span class="cb-line"><span class="cb-ln">5</span><span class="op">}</span></span>
<span class="cb-line"><span class="cb-ln">6</span></span>
<span class="cb-line"><span class="cb-ln">7</span><span class="kw">const</span> <span class="fn">me</span><span class="op">:</span> <span class="ty">Developer</span> <span class="op">= {</span></span>
<span class="cb-line"><span class="cb-ln">8</span>  name<span class="op">:</span> <span class="str">"Meljun Mariquit"</span><span class="op">,</span></span>
<span class="cb-line"><span class="cb-ln">9</span>  stack<span class="op">: [</span></span>
<span class="cb-line"><span class="cb-ln">10</span>    <span class="str">"TypeScript"</span><span class="op">,</span> <span class="str">"PHP"</span><span class="op">,</span></span>
<span class="cb-line"><span class="cb-ln">11</span>    <span class="str">"Vue.js"</span><span class="op">,</span> <span class="str">"ASP.NET"</span><span class="op">,</span></span>
<span class="cb-line"><span class="cb-ln">12</span>    <span class="str">"SQL Server"</span><span class="op">,</span> <span class="str">"PostgreSQL"</span></span>
<span class="cb-line"><span class="cb-ln">13</span>  <span class="op">],</span></span>
<span class="cb-line"><span class="cb-ln">14</span>  available<span class="op">:</span> <span class="kw">true</span><span class="op">,</span> <span class="cm">// ← hire me</span></span>
<span class="cb-line"><span class="cb-ln">15</span><span class="op">};</span></span>
<span class="cb-line"><span class="cb-ln">16</span></span>
<span class="cb-line"><span class="cb-ln">17</span><span class="kw">async function</span> <span class="fn">collaborate</span><span class="op">(</span></span>
<span class="cb-line"><span class="cb-ln">18</span>  idea<span class="op">:</span> <span class="ty">string</span></span>
<span class="cb-line"><span class="cb-ln">19</span><span class="op">) {</span></span>
<span class="cb-line"><span class="cb-ln">20</span>  <span class="kw">return await</span> <span class="fn">ship</span><span class="op">(</span>idea<span class="op">);</span></span>
<span class="cb-line"><span class="cb-ln">21</span><span class="op">}</span></span>
      </div>
    </div>
  </div>
</section>

<!-- EXPERIENCE -->
<section class="section" id="exp">
  <div class="section-header">
    <span class="sec-num">04</span>
    <div class="sec-line"></div>
    <span class="sec-title">Experience</span>
  </div>
  <div class="exp-list">
    <div v-for="item in experienceItems" :key="item.period" class="exp-item reveal">
      <div class="exp-left">
        <div class="exp-period">{{ item.period }}</div>
        <div class="exp-co">{{ item.company }}</div>
      </div>
      <div class="exp-right">
        <div class="exp-role">{{ item.role }}</div>
        <div class="exp-desc">{{ item.desc }}</div>
        <div class="exp-tech">
          <span v-for="tech in item.tech" :key="`${item.period}-${tech}`" class="exp-t">{{ tech }}</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section class="section" id="contact">
  <div class="section-header">
    <span class="sec-num">05</span>
    <div class="sec-line"></div>
    <span class="sec-title">Contact</span>
  </div>
  <div class="contact-inner">
    <div class="reveal">
      <div class="contact-big">Let's build<br>something<br><span>great.</span></div>
      <div class="cfa-row">
        <div class="cfa-label">Email</div>
        <a class="cfa-val" href="mailto:mariquit.meljun26@gmail.com">mariquit.meljun26@gmail.com</a>
      </div>
      <div class="cfa-row">
        <div class="cfa-label">Location</div>
        <div class="cfa-val" style="cursor:default">San Francisco, CA · Remote OK</div>
      </div>
    </div>
    <div class="contact-links reveal">
      <a v-for="link in contactLinks" :key="link.name" :href="link.url" target="_blank" rel="noopener noreferrer" class="contact-link-row">
        <div><div class="cl-name">{{ link.name }}</div><div class="cl-handle">{{ link.handle }}</div></div>
        <div class="cl-arr">↗</div>
      </a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-copy">
    <span class="footer-acc">Zin.</span>
    <span>© 2026 Meljun Mariquit. Built with TypeScript + CSS.</span>
  </div>
  <div>
    <span id="footer-time" ref="footerTimeEl" style="font-size:11px;color:var(--dim);letter-spacing:1px"></span>
  </div>
</footer>
</main>
</template>
<style scoped>
/* ── LOADER ── */
#loader {
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  transition: opacity 0.6s ease, visibility 0.6s;
}
#loader.hide { opacity: 0; visibility: hidden; }
.loader-line {
  width: 200px;
  height: 1px;
  background: var(--line2);
  position: relative;
  overflow: hidden;
}
.loader-line::after {
  content: '';
  position: absolute;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--accent);
  animation: loadBar 1.4s cubic-bezier(0.4,0,0.2,1) forwards;
}
@keyframes loadBar { to { left: 100%; } }
.loader-text {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 3px;
  text-transform: uppercase;
  animation: blink 0.8s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }

/* ── TOP BAR ── */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(var(--bg-rgb, 8, 8, 8), 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.tb-logo {
  font-family: var(--display);
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--white);
  display: flex;
  align-items: center;
  gap: 8px;
}
.tb-logo-dot { width: 7px; height: 7px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.7} }
.tb-center {
  font-size: 10px;
  color: var(--dim);
  letter-spacing: 2px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 20px;
}
.tb-sep { color: var(--line2); }
.tb-right { display: flex; gap: 24px; align-items: center; }
.tb-link {
  font-size: 11px;
  color: var(--muted);
  text-decoration: none;
  letter-spacing: 1px;
  transition: color 0.2s;
  text-transform: uppercase;
}
.tb-link:hover { color: var(--accent); }
.tb-cta {
  padding: 8px 18px;
  border: 1px solid var(--line2);
  border-radius: 2px;
  font-size: 11px;
  font-family: var(--mono);
  color: var(--accent);
  background: transparent;
  cursor: pointer;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.2s;
}
.tb-cta:hover { background: var(--accent); color: var(--bg); border-color: var(--accent); }
.tb-theme {
  width: 32px;
  height: 32px;
  border: 1px solid var(--line2);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.tb-theme svg {
  color: var(--accent);
  transition: color 0.3s, filter 0.3s;
  filter: drop-shadow(0 0 6px rgba(200, 255, 0, 0.5));
}
body.light-mode .tb-theme svg {
  filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.4));
}
.tb-theme:hover {
  background: var(--bg3);
  border-color: var(--accent);
}
.tb-theme:hover svg {
  color: var(--accent);
  filter: drop-shadow(0 0 10px rgba(200, 255, 0, 0.8));
}
body.light-mode .tb-theme:hover svg {
  filter: drop-shadow(0 0 12px rgba(37, 99, 235, 0.8));
}

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-rows: 1fr auto;
  padding: 0 40px;
  position: relative;
  overflow: hidden;
}
.hero-grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}
.hero-center {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 80px 0 40px;
  max-width: 1400px;
  position: relative;
  gap: 60px;
}
.hero-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hero-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.hero-overline {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 32px;
  opacity: 0;
  animation: fadeUp 0.6s ease 1.6s forwards;
}
.hero-overline-line { width: 32px; height: 1px; background: var(--muted); }

.hero-name {
  font-family: var(--display);
  font-size: clamp(48px, 7vw, 96px);
  font-weight: 800;
  letter-spacing: -3px;
  line-height: 1;
  color: var(--white);
  opacity: 0;
  animation: heroReveal 1s cubic-bezier(0.16,1,0.3,1) 1.8s forwards;
  position: relative;
}

.hero-name .line2 {
  display: block;
  color: transparent;
  -webkit-text-stroke: 1px rgba(240,237,232,0.25);
}
body.light-mode .hero-name .line2 {
  -webkit-text-stroke: 1px rgba(37, 99, 235, 0.4);
}
@keyframes heroReveal {
  from { opacity: 0; transform: translateY(40px) skewY(2deg); }
  to { opacity: 1; transform: translateY(0) skewY(0deg); }
}

.hero-bio {
  font-size: 16px;
  color: var(--muted);
  line-height: 1.7;
  max-width: 520px;
  margin-top: 24px;
  opacity: 0;
  animation: fadeUp 0.8s ease 2s forwards;
}

.hero-ctas {
  display: flex;
  gap: 16px;
  margin-top: 40px;
  opacity: 0;
  animation: fadeUp 0.8s ease 2.2s forwards;
}

.btn-primary {
  padding: 12px 24px;
  background: var(--accent);
  color: var(--bg);
  border: 1px solid var(--accent);
  border-radius: 4px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-primary:hover {
  background: transparent;
  color: var(--accent);
}

.btn-secondary {
  padding: 12px 24px;
  background: transparent;
  color: var(--white);
  border: 1px solid var(--line2);
  border-radius: 4px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.hero-terminal {
  margin-top: 0;
  border: 1px solid var(--line2);
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  max-width: 560px;
  opacity: 0;
  animation: fadeUp 0.7s ease 2.2s forwards;
}
.ht-bar {
  background: var(--bg3);
  padding: 9px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid var(--line);
}
.ht-dot { width: 10px; height: 10px; border-radius: 50%; }
.ht-body { padding: 16px; font-size: 12px; line-height: 2; background: rgba(255,255,255,0.02); }
.ht-prompt { color: var(--accent); }
.ht-cmd { color: var(--white); }
.ht-out { color: var(--muted); }
.ht-key { color: var(--accent2); }
.ht-val { color: var(--white); }
.ht-cursor {
  display: inline-block;
  width: 8px; height: 14px;
  background: var(--accent);
  vertical-align: middle;
  animation: blink 1s step-end infinite;
}

.hero-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 28px 0;
  border-top: 1px solid var(--line);
  opacity: 0;
  animation: fadeUp 0.6s ease 2.5s forwards;
}
.hero-scroll {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  color: var(--dim);
  letter-spacing: 2px;
  text-transform: uppercase;
}
.scroll-line {
  width: 1px;
  height: 40px;
  background: var(--line2);
  position: relative;
  overflow: hidden;
}
.scroll-line::after {
  content: '';
  position: absolute;
  top: -100%;
  width: 100%;
  height: 100%;
  background: var(--accent);
  animation: scrollDrop 2s ease-in-out infinite;
}
@keyframes scrollDrop { 0%{top:-100%} 100%{top:200%} }
.hero-stats { display: flex; gap: 40px; }
.hero-stat { text-align: right; }
.hero-stat-num {
  font-family: var(--display);
  font-size: 32px;
  font-weight: 800;
  color: var(--white);
  line-height: 1;
  letter-spacing: -1px;
}
.hero-stat-lbl { font-size: 10px; color: var(--dim); letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }

/* ── SECTION COMMON ── */
.section { padding: 100px 40px; border-top: 1px solid var(--line); }
.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 60px;
}
.sec-num { font-size: 11px; color: var(--dim); letter-spacing: 2px; }
.sec-line { flex: 1; height: 1px; background: var(--line); }
.sec-title {
  font-family: var(--display);
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 4px;
  text-transform: uppercase;
}

/* ── STACK SECTION ── */
.stack-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
}
.stack-cell {
  background: var(--bg);
  padding: 28px 24px;
  transition: background 0.25s;
  position: relative;
  overflow: hidden;
}
.stack-cell::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.stack-cell:hover { background: var(--bg3); }
.stack-cell:hover::before { transform: scaleX(1); }
.stack-icon {
  font-size: 10px;
  color: var(--dim);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.stack-name {
  font-family: var(--display);
  font-size: 18px;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 6px;
}
.stack-level {
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 1px;
}
.stack-bar {
  width: 100%;
  height: 1px;
  background: var(--line);
  margin-top: 16px;
  position: relative;
}
.stack-bar-fill {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  background: var(--accent);
  transition: width 1.2s cubic-bezier(0.16,1,0.3,1);
  width: 0;
}
.stack-cell.visible .stack-bar-fill { width: var(--w, 80%); }

/* ── PROJECTS ── */
.projects-list { display: flex; flex-direction: column; gap: 0; }
.project-row {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 32px;
  align-items: start;
  padding: 32px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  transition: padding-left 0.3s ease;
  position: relative;
  overflow: hidden;
}
.project-row::after {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--accent);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}
.project-row:hover { padding-left: 16px; }
.project-row:hover::after { transform: scaleY(1); }
.project-row:first-child { border-top: 1px solid var(--line); }
.proj-num {
  font-size: 11px;
  color: var(--dim);
  padding-top: 4px;
  font-family: var(--mono);
}
.proj-main {}
.proj-gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
  max-width: 360px;
}
.proj-thumb {
  border: 1px solid var(--line2);
  border-radius: 6px;
  overflow: hidden;
  background: var(--bg2);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}
.proj-thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  cursor: zoom-in;
}
.proj-title {
  font-family: var(--display);
  font-size: 28px;
  font-weight: 700;
  color: var(--white);
  letter-spacing: -1px;
  margin-bottom: 8px;
  line-height: 1.1;
  transition: color 0.2s;
}
.project-row:hover .proj-title { color: var(--accent); }
.proj-desc { font-size: 13px; color: var(--muted); line-height: 1.7; max-width: 560px; }
.proj-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 14px; }
.proj-tag {
  font-size: 10px;
  padding: 3px 10px;
  border: 1px solid var(--line2);
  border-radius: 2px;
  color: var(--dim);
  letter-spacing: 1px;
  text-transform: uppercase;
}
.proj-right { padding-top: 4px; text-align: right; }
.proj-year { font-size: 11px; color: var(--dim); margin-bottom: 8px; }
.proj-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--muted);
  text-decoration: none;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.2s;
  border: 1px solid transparent;
  padding: 6px 12px;
  border-radius: 2px;
}
.project-row:hover .proj-link { color: var(--accent); border-color: var(--line2); }

.image-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 24px;
}
.image-lightbox-img {
  width: min(96vw, 1400px);
  max-height: 92vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
}
.image-lightbox-close {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
}

/* ── CODE BLOCK SECTION ── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}
.about-text {}
.about-heading {
  font-family: var(--display);
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.05;
  color: var(--white);
  margin-bottom: 24px;
}
.about-heading em {
  font-style: italic;
  color: transparent;
  -webkit-text-stroke: 1px rgba(240,237,232,0.3);
}
body.light-mode .about-heading em {
  -webkit-text-stroke: 1px rgba(37, 99, 235, 0.3);
}
.about-body { font-size: 14px; color: var(--muted); line-height: 1.9; margin-bottom: 32px; }
.about-tags { display: flex; flex-direction: column; gap: 0; }
.about-tag-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
}
.at-label { color: var(--dim); letter-spacing: 1px; }
.at-val { color: var(--white); font-weight: 500; }

.code-block {
  background: var(--bg2);
  border: 1px solid var(--line2);
  border-radius: 4px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.8;
}
.cb-header {
  background: var(--bg3);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--line);
}
.cb-dots { display: flex; gap: 6px; }
.cb-dot { width: 10px; height: 10px; border-radius: 50%; }
.cb-filename { font-size: 11px; color: var(--muted); margin-left: 8px; letter-spacing: 1px; }
.cb-body { padding: 20px; }
.cb-ln { color: var(--dim); user-select: none; margin-right: 20px; display: inline-block; width: 20px; text-align: right; }
.kw { color: #c792ea; }
.fn { color: #82aaff; }
.str { color: #c3e88d; }
.num-c { color: #f78c6c; }
.cm { color: var(--dim); font-style: italic; }
.ty { color: #ffcb6b; }
.op { color: var(--muted); }
.cb-line { display: block; padding: 1px 0; }
.cb-line:hover { background: rgba(255,255,255,0.03); margin: 0 -20px; padding: 1px 20px; }

/* ── EXPERIENCE ── */
.exp-list { display: flex; flex-direction: column; gap: 0; }
.exp-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  padding: 40px 0;
  border-bottom: 1px solid var(--line);
}
.exp-left {}
.exp-period { font-size: 11px; color: var(--dim); letter-spacing: 1px; margin-bottom: 8px; }
.exp-co {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.5px;
}
.exp-right {}
.exp-role {
  font-size: 16px;
  font-weight: 500;
  color: var(--white);
  margin-bottom: 10px;
}
.exp-desc { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 14px; }
.exp-tech { display: flex; gap: 6px; flex-wrap: wrap; }
.exp-t {
  font-size: 10px;
  padding: 2px 8px;
  background: rgba(200,255,0,0.07);
  border: 1px solid rgba(200,255,0,0.15);
  border-radius: 2px;
  color: var(--accent);
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* ── CONTACT ── */
.contact-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}
.contact-big {
  font-family: var(--display);
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.05;
  color: var(--white);
  margin-bottom: 32px;
}
.contact-big span { color: var(--accent); }
.contact-form-alt {}
.cfa-row { margin-bottom: 24px; }
.cfa-label { font-size: 10px; color: var(--dim); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
.cfa-val {
  font-size: 16px;
  color: var(--white);
  text-decoration: none;
  border-bottom: 1px solid var(--line2);
  padding-bottom: 8px;
  display: block;
  transition: border-color 0.2s, color 0.2s;
}
.cfa-val:hover { color: var(--accent); border-color: var(--accent); }

.contact-links { display: flex; flex-direction: column; gap: 16px; margin-top: 40px; }
.contact-link-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  transition: padding-left 0.25s;
  cursor: pointer;
}
.contact-link-row:hover { padding-left: 12px; }
.cl-name { font-family: var(--display); font-size: 20px; font-weight: 700; color: var(--white); transition: color 0.2s; }
.contact-link-row:hover .cl-name { color: var(--accent); }
.cl-handle { font-size: 12px; color: var(--dim); }
.cl-arr { font-size: 20px; color: var(--dim); transition: all 0.2s; }
.contact-link-row:hover .cl-arr { color: var(--accent); transform: translate(4px,-4px); }

/* ── FOOTER ── */
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  border-top: 1px solid var(--line);
  font-size: 11px;
  color: var(--dim);
  letter-spacing: 1px;
}
.footer-copy { display: flex; align-items: center; gap: 12px; }
.footer-acc { color: var(--accent); }

/* ── ANIMATIONS ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ── RESPONSIVE DESIGN ── */
@media (max-width: 768px) {
  .topbar { padding: 16px 20px; }
  .tb-center { display: none; }
  .tb-right { gap: 12px; }
  .tb-link { display: none; /* Hide navigation links on mobile to save space */ }
  
  .hero { padding: 0 20px; }
  .hero-center { padding: 80px 0 40px; flex-direction: column; gap: 40px; }
  .hero-name { font-size: clamp(40px, 10vw, 64px); }
  .hero-bio { font-size: 14px; margin-top: 16px; }
  .hero-ctas { margin-top: 24px; flex-direction: column; gap: 12px; }
  .btn-primary, .btn-secondary { width: 100%; text-align: center; }
  .hero-terminal { margin-top: 0; width: 100%; }
  .hero-bottom { flex-direction: column; align-items: flex-start; gap: 20px; padding: 20px 0; }
  .hero-stats { gap: 20px; width: 100%; justify-content: space-between; }
  .hero-stat { text-align: left; }
  
  .section { padding: 60px 20px; }
  .section-header { margin-bottom: 40px; }
  
  .stack-grid { grid-template-columns: repeat(2, 1fr); }
  .stack-cell { padding: 20px 16px; }
  
  .project-row { grid-template-columns: 1fr; gap: 16px; padding: 24px 0; }
  .proj-num { display: none; }
  .proj-right { text-align: left; display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
  .proj-year { margin-bottom: 0; }
  .proj-gallery { grid-template-columns: 1fr; }
  .proj-gallery { max-width: 100%; }
  
  .about-grid { grid-template-columns: 1fr; gap: 40px; }
  .about-heading { font-size: 32px; }
  
  .exp-item { grid-template-columns: 1fr; gap: 16px; padding: 24px 0; }
  .exp-left { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--line); padding-bottom: 12px; }
  .exp-period { margin-bottom: 0; }
  
  .contact-inner { grid-template-columns: 1fr; gap: 40px; }
  .contact-big { font-size: clamp(32px, 8vw, 48px); }
  
  footer { flex-direction: column; gap: 16px; padding: 24px 20px; text-align: center; }
  .footer-copy { flex-direction: column; gap: 8px; }
}

@media (max-width: 480px) {
  .stack-grid { grid-template-columns: 1fr; }
  .tb-cta { padding: 6px 12px; font-size: 10px; }
  .hero-stats { flex-direction: column; gap: 16px; }
}
</style>