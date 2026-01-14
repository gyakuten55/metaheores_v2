import React from 'react';

export interface Stat {
  value: string;
  suffix?: string;
  label: string;
}

export interface Catchphrase {
  main: string | React.ReactNode;
  emphasis: string;
}

export interface Philosophy {
  backgroundImage: string;
  paragraphs: string[];
}

export interface Skill {
  title: string;
  description: string;
}

export interface CaseStudy {
  image: string;
  challenge: string;
  approach: string;
  result: string;
}

export interface CareerItem {
  label: string;
  title: string;
  description: string[];
}

export interface QAItem {
  question: string;
  answer: string;
  image: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export type MemberCategory = 'コンテンツプロデュース' | 'クリエイティブ' | 'セールス' | 'ビジネスプロデュース' | 'コーポレート';

export interface MemberData {
  id: string;
  category: MemberCategory;
  name: string;
  nameEn: string;
  role: string;
  icon: string;
  catchphrase: Catchphrase;
  heroImage: string;
  stats: Stat[];
  philosophy: Philosophy;
  skills: Skill[];
  caseStudy: CaseStudy;
  career: CareerItem[];
  qa: QAItem[];
  schedule: ScheduleItem[];
  accentColor?: string;
}
