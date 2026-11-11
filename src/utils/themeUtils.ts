import { PostItColor, TaskCategory, TaskPriority } from '../types';

export interface ColorTheme {
  name: string;
  cardBg: string;
  accentBar: string;
  tapeColor: string;
  badgeBg: string;
  checkRing: string;
  hex: string;
}

export const POSTIT_COLORS: Record<PostItColor, ColorTheme> = {
  yellow: {
    name: 'Amarelo Sol',
    cardBg: 'bg-[#FEF9C3] dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 border-amber-200/80 dark:border-amber-800/50',
    accentBar: 'bg-amber-400 dark:bg-amber-600',
    tapeColor: 'bg-amber-200/50 dark:bg-amber-400/20',
    badgeBg: 'bg-amber-100/90 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200',
    checkRing: 'border-amber-400 text-amber-600 focus:ring-amber-500',
    hex: '#FEF08A',
  },
  mint: {
    name: 'Menta Fresca',
    cardBg: 'bg-[#DCFCE7] dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border-emerald-200/80 dark:border-emerald-800/50',
    accentBar: 'bg-emerald-400 dark:bg-emerald-600',
    tapeColor: 'bg-emerald-200/50 dark:bg-emerald-400/20',
    badgeBg: 'bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200',
    checkRing: 'border-emerald-400 text-emerald-600 focus:ring-emerald-500',
    hex: '#BBF7D0',
  },
  peach: {
    name: 'Pêssego Quente',
    cardBg: 'bg-[#FFEDD5] dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 border-orange-200/80 dark:border-orange-800/50',
    accentBar: 'bg-orange-400 dark:bg-orange-600',
    tapeColor: 'bg-orange-200/50 dark:bg-orange-400/20',
    badgeBg: 'bg-orange-100/90 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200',
    checkRing: 'border-orange-400 text-orange-600 focus:ring-orange-500',
    hex: '#FED7AA',
  },
  sky: {
    name: 'Azul Céu',
    cardBg: 'bg-[#E0F2FE] dark:bg-sky-950/40 text-sky-950 dark:text-sky-100 border-sky-200/80 dark:border-sky-800/50',
    accentBar: 'bg-sky-400 dark:bg-sky-600',
    tapeColor: 'bg-sky-200/50 dark:bg-sky-400/20',
    badgeBg: 'bg-sky-100/90 dark:bg-sky-900/60 text-sky-900 dark:text-sky-200',
    checkRing: 'border-sky-400 text-sky-600 focus:ring-sky-500',
    hex: '#BAE6FD',
  },
  lavender: {
    name: 'Lavanda',
    cardBg: 'bg-[#F3E8FF] dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 border-purple-200/80 dark:border-purple-800/50',
    accentBar: 'bg-purple-400 dark:bg-purple-600',
    tapeColor: 'bg-purple-200/50 dark:bg-purple-400/20',
    badgeBg: 'bg-purple-100/90 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200',
    checkRing: 'border-purple-400 text-purple-600 focus:ring-purple-500',
    hex: '#E9D5FF',
  },
  rose: {
    name: 'Rosa Coral',
    cardBg: 'bg-[#FFE4E6] dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 border-rose-200/80 dark:border-rose-800/50',
    accentBar: 'bg-rose-400 dark:bg-rose-600',
    tapeColor: 'bg-rose-200/50 dark:bg-rose-400/20',
    badgeBg: 'bg-rose-100/90 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200',
    checkRing: 'border-rose-400 text-rose-600 focus:ring-rose-500',
    hex: '#FECDD3',
  },
};

export const CATEGORY_LABELS: Record<TaskCategory, { label: string; icon: string }> = {
  pet: { label: 'Pet & Animais', icon: '🐾' },
  casa: { label: 'Casa & Rotina', icon: '🏠' },
  saude: { label: 'Saúde & Bem-estar', icon: '❤️' },
  trabalho: { label: 'Trabalho & Foco', icon: '💼' },
  estudos: { label: 'Estudos', icon: '📚' },
  geral: { label: 'Geral', icon: '📌' },
};

export const PRIORITY_LABELS: Record<TaskPriority, { label: string; colorClass: string }> = {
  alta: { label: 'Alta', colorClass: 'text-red-700 dark:text-red-400 bg-red-100/80 dark:bg-red-950/60' },
  media: { label: 'Média', colorClass: 'text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/60' },
  baixa: { label: 'Baixa', colorClass: 'text-zinc-600 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-800/60' },
};
