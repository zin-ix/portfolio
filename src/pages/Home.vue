<script setup lang="ts">
import { aboutTags, contactLinks, experienceItems, projectItems, stackItems } from '@/utils/profile-data.utils';
import { ref, onMounted, onUnmounted } from 'vue';
import AppCursor from '@/components/AppCursor.vue';
import AboutSection from '@/components/AboutSection.vue';
import AppLoader from '@/components/AppLoader.vue';
import ContactSection from '@/components/ContactSection.vue';
import ExperienceSection from '@/components/ExperienceSection.vue';
import HeroSection from '@/components/HeroSection.vue';
import ParticleCanvas from '@/components/ParticleCanvas.vue';
import ProjectsSection from '@/components/ProjectsSection.vue';
import SiteFooter from '@/components/SiteFooter.vue';
import Topbar from '@/components/Topbar.vue';
import StackSection from '@/components/StackSection.vue';

const footerTimeText = ref('');

const isDarkMode = ref(true);

let clockInterval: number | null = null;
let intersectionObserver: IntersectionObserver | null = null;

function updateTime() {
  const now = new Date();
  const t = now.toLocaleTimeString('en-US', { hour12: false });
  footerTimeText.value = `SF ${t}`;
}

function setupScrollReveal() {
  intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .stack-cell').forEach(el => intersectionObserver!.observe(el));
  document.querySelectorAll('.stack-cell').forEach((el, i) => { (el as HTMLElement).style.transitionDelay = `${i * 0.06}s`; });
  document.querySelectorAll('.project-row').forEach((el, i) => { (el as HTMLElement).style.transitionDelay = `${i * 0.08}s`; });
}

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
  document.body.classList.toggle('light-mode', !isDarkMode.value);
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  isDarkMode.value = savedTheme === 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    document.documentElement.setAttribute('data-theme', 'light');
  }

  updateTime();
  clockInterval = window.setInterval(updateTime, 1000);
  setupScrollReveal();
});

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
  if (intersectionObserver) intersectionObserver.disconnect();
});
</script>

<template>
  <AppCursor />
  <ParticleCanvas :is-dark-mode="isDarkMode" />
  <AppLoader />

  <main>
    <Topbar :is-dark-mode="isDarkMode" @toggle-theme="toggleTheme" />
    <HeroSection />

    <!-- STACK -->
    <StackSection :stack-items="stackItems" />

    <!-- PROJECTS -->
    <ProjectsSection :project-items="projectItems" />
    <AboutSection :about-tags="aboutTags" />
    <ExperienceSection :experience-items="experienceItems" />
    <ContactSection :contact-links="contactLinks" />
    <SiteFooter :time-text="footerTimeText" />
  </main>
</template>

<style>
/* Stack bar fill (CSS var width) */
.stack-bar-fill { width: 0; }
.stack-cell.visible .stack-bar-fill { width: var(--w, 80%); }

/* Stack cell accent underline */
.stack-cell::before {
  content: '';
  position: absolute; bottom: 0; left: 0;
  width: 100%; height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.stack-cell:hover::before { transform: scaleX(1); }

/* Project row accent left border */
.project-row::after {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 2px;
  background: var(--accent);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}
.project-row:hover::after { transform: scaleY(1); }
.project-row:hover .proj-link { color: var(--accent); border-color: var(--line2); }
.project-row:hover .proj-title-el { color: var(--accent); }

/* Expanded project panel */
.proj-expanded-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease, margin-top 0.4s ease;
  opacity: 0; visibility: hidden; margin-top: 0;
}
.proj-expanded-content.is-expanded {
  grid-template-rows: 1fr;
  opacity: 1; visibility: visible; margin-top: 24px;
}

/* Scroll reveal */
.reveal {
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }

/* Responsive overrides */
@media (max-width: 768px) {
  .hero-center { flex-direction: column; gap: 40px; padding: 80px 0 40px; }
  .topbar { padding: 16px 20px; }
  section { padding: 60px 20px !important; }
  .stack-grid { grid-template-columns: repeat(2, 1fr); }
  .exp-item { grid-template-columns: 1fr !important; gap: 16px; }
  .about-grid { grid-template-columns: 1fr !important; }
  .contact-inner { grid-template-columns: 1fr !important; }
}
@media (max-width: 480px) {
  .stack-grid { grid-template-columns: 1fr !important; }
}
</style>