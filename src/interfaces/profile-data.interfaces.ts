export type StackItem = {
  icon: string;
  name: string;
  level: string;
  width: string;
};

export type ProjectItem = {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  year: string;
  linkLabel: string;
  images?: string[];
  repoUrl?: string;
  demoUrl?: string;
  fullDesc?: string;
};

export type AboutTag = {
  label: string;
  value: string;
  accent?: boolean;
};

export type ExperienceItem = {
  period: string;
  company: string;
  role: string;
  desc: string;
  tech: string[];
};

export type ContactLink = {
  name: string;
  handle: string;
  url: string;
};