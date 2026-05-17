import featherToastVueImage1 from '@/assets/images/feather-toast-vue/feather-toast-vue-1.png';
import featherToastVueImage2 from '@/assets/images/feather-toast-vue/feather-toast-vue-2.png';
import featherToastVueImage3 from '@/assets/images/feather-toast-vue/feather-toast-vue-3.png';
import featherToastVueImage4 from '@/assets/images/feather-toast-vue/feather-toast-vue-4.png';
import eams from '@/assets/images/eams/eams.png';
import labtrack1 from '@/assets/images/labtrack/labtrack1.png';
import labtrack2 from '@/assets/images/labtrack/labtrack2.png';
import labtrack3 from '@/assets/images/labtrack/labtrack3.png';
import labtrack4 from '@/assets/images/labtrack/labtrack4.png';

import msc1 from '@/assets/images/market_scoping/msc1.png';
import msc2 from '@/assets/images/market_scoping/msc2.png';
import msc3 from '@/assets/images/market_scoping/msc3.png';
import msc4 from '@/assets/images/market_scoping/msc4.png';
import msc5 from '@/assets/images/market_scoping/msc5.png';
import type { AboutTag, ContactLink, ExperienceItem, ProjectItem, StackItem } from "@/interfaces/profile-data.interfaces";

export const stackItems: StackItem[] = [
  { icon: 'frontend', name: 'Vue.js', level: 'Advanced · 2 years', width: '92%' },
  { icon: 'frontend', name: 'Tailwind CSS', level: 'Advanced · 2 years', width: '88%' },
  { icon: 'frontend', name: 'HTML / CSS', level: 'Advanced · 3 years', width: '90%' },

  { icon: 'backend', name: 'Laravel', level: 'Advanced · 2 years', width: '90%' },
  { icon: 'backend', name: 'ASP.NET Core', level: 'Mid-Level · 1 year', width: '82%' },

  { icon: 'lang', name: 'JavaScript', level: 'Mid-Level · 3 years', width: '89%' },
  { icon: 'lang', name: 'PHP', level: 'Advanced · 2 years', width: '87%' },
  { icon: 'lang', name: 'C#', level: 'Intermediate · 1 year', width: '80%' },
  { icon: 'lang', name: 'Java', level: 'Mid-Level · 2 years', width: '76%' },
  { icon: 'lang', name: 'Python', level: 'Mid-Level · 2 years', width: '74%' },

  { icon: 'mobile', name: 'Flutter', level: 'Beginner · 6 months', width: '65%' },

  { icon: 'db', name: 'MySQL', level: 'Advanced · 2 years', width: '86%' },
  { icon: 'db', name: 'Firebase / Supabase', level: 'Intermediate · 1 year', width: '78%' },

  { icon: 'infra', name: 'Git & GitHub', level: 'Advanced · 3 years', width: '84%' }
];

export const projectItems: ProjectItem[] = [
  {
    num: '001',
    title: 'BAC Procurement Management System',
    desc: 'A web-based Procurement Market Scoping System for the Provincial Government of Agusan del Sur BAC procurement workflow, featuring AI-assisted generation of Terms of Reference (TOR) and market analysis reports. Built RESTful APIs using ASP.NET Core and developed a dynamic frontend using Vue.js to improve efficiency, automate document generation, and reduce manual workload.',
    tags: ['Vue.js', 'TypeScript', 'WebSockets', 'SQL Server', 'ASP.NET'],
    year: '2026',
    linkLabel: 'View ↗',
    images: [msc1, msc2, msc3, msc4, msc5],
    repoUrl: 'https://github.com/zin-ix/pms-frontend',
    fullDesc: 'Developed to streamline the procurement process, this system automates document generation and market analysis. It connects a robust ASP.NET backend with a highly reactive Vue.js interface, drastically cutting down administrative overhead and improving cross-department efficiency.'
  },
  {
    num: '002',
    title: 'LabTrack',
    desc: 'An RFID-based computer laboratory logging system with student-to-PC mapping and issue reporting features. The system integrates Laravel, Vue.js, Windows Forms, RFID technology, and Espressif Systems ESP32 to automate attendance logging, device monitoring, and laboratory issue management through a centralized platform.',
    tags: ['Vue.js', 'Windows Forms', 'Laravel', 'WebSockets', 'ESP32', 'MySQL'],
    year: '2025',
    linkLabel: 'GitHub ↗',
    images: [labtrack1, labtrack2, labtrack3, labtrack4],
    repoUrl: 'https://github.com/zin-ix/labtrack',
    fullDesc: 'LabTrack provides end-to-end laboratory monitoring by mapping students to specific PCs via RFID tags. Its seamless integration of hardware (ESP32) and software (Laravel + Vue.js) enables real-time device tracking and instant issue reporting.'
  },
  {
    num: '003',
    title: 'Employee Attendance Management System',
    desc: 'A comprehensive solution for managing employee attendance in large organizations. Features include real-time tracking, automated reporting, and integration with existing HR systems.',
    tags: ['Vue.js', 'Laravel', 'MySQL', 'Websockets'],
    year: '2022',
    linkLabel: 'Docs ↗',
    images: [eams],
    repoUrl: 'https://github.com/zin-ix/Attendance-Management-using-Rfid',
    fullDesc: 'This attendance management tool uses WebSockets for live status updates, allowing HR teams to see employee check-ins in real-time. Paired with automated reporting, it acts as a central hub for personnel time tracking.'
  },
  {
    num: '004',
    title: 'Feather-toast-vue',
    desc: 'A lightweight, customizable toast notification library for Vue.js applications. Built with TypeScript and designed for ease of use and flexibility, it supports various notification types, animations, and theming options.',
    tags: ['Open Source', 'TypeScript', 'Vue.Js', 'CSS'],
    year: '2022',
    linkLabel: 'npm ↗',
    images: [featherToastVueImage1, featherToastVueImage2, featherToastVueImage3, featherToastVueImage4],
    repoUrl: 'https://github.com/zin-ix/feather-toast-vue',
    demoUrl: 'https://www.npmjs.com/package/feather-toast-vue',
    fullDesc: 'Feather-toast-vue is a developer-focused, minimal notification library. Designed with smooth CSS transitions and a robust TypeScript API, it seamlessly integrates into any Vue 3 project without adding bulky dependencies.'
  }
];

export const aboutTags: AboutTag[] = [
  { label: 'Based in', value: 'San Francisco, CA' },
  { label: 'Codename', value: 'zin.' },
  { label: 'Currently at', value: 'Provincial Information Management Office' },
  { label: 'Education', value: 'B.S. Information Technology — SFXC San Francisco' },
  { label: 'Open to', value: 'New opportunities', accent: true }
];

export const experienceItems: ExperienceItem[] = [
  {
    period: '2026 — Present',
    company: 'Provincial Information Management Office',
    role: 'Junior Developer(Intern) — Infrastructure',
    desc: "Develop a procurement management system for the Provincial Government of Agusan del Sur BAC procurement workflow, featuring AI-assisted generation of Terms of Reference (TOR) and market analysis reports. Built RESTful APIs using ASP.NET Core and developed a dynamic frontend using Vue.js to improve efficiency, automate document generation, and reduce manual workload.",
    tech: ['Vue.js', 'TypeScript', 'ASP.NET', 'WebSockets', 'SQL Server']
  },
    {
    period: '2022 — 2025',
    company: 'Hack4Gov',
    role: 'CTF Participant',
    desc: 'Participated in Hack4Gov regional cybersecurity competitions focused on digital forensics, cryptography, web exploitation, and cybersecurity problem-solving challenges.',
    tech: ['Cybersecurity', 'Digital Forensics', 'Cryptography', 'Web Exploitation']
    },
    {
    period: '2025',
    company: 'PSITE Regional Programming Competition',
    role: 'Programming Contest Participant',
    desc: 'Represented the institution in a regional programming competition, solving algorithmic and logical coding problems under time constraints.',
    tech: ['Java', 'C++', 'Problem Solving', 'Algorithms']
    },
    {
    period: '2024 — Present',
    company: 'Freelance',
    role: 'Full-Stack Developer',
    desc: 'Developed small-scale academic and institutional systems for different schools, including web-based management systems, capstone projects, authentication modules, and database-driven applications.',
    tech: ['Laravel', 'Vue.js', 'MySQL', 'Kotlin', 'Firebase', 'Supabase']
    }
];

export const contactLinks: ContactLink[] = [
  { name: 'GitHub', handle: '@zin-ix', url: 'https://github.com/zin-ix' },
//   { name: 'LinkedIn', handle: '/in/alexrivera', url: 'https://linkedin.com/in/alexrivera' },
  { name: 'Jobstreet', handle: 'meljun-mariquit', url: 'https://www.ph.jobstreet.com/profiles/meljun-mariquit-g4QyZqlR0W' },
  { name: 'Facebook', handle: 'meljun.mariquit', url: 'https://www.facebook.com/meljun.mariquit'},
//   { name: 'Twitter / X', handle: '@alexriveradev', url: 'https://twitter.com/alexriveradev' },
//   { name: 'Read.cv', handle: 'alexrivera', url: 'https://read.cv/alexrivera' }
];