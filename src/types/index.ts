export type PostItColor = 'yellow' | 'mint' | 'peach' | 'sky' | 'lavender' | 'rose';

export type TaskCategory = 'geral' | 'casa' | 'pet' | 'trabalho' | 'saude' | 'estudos';

export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface RecurrenceConfig {
  enabled: boolean;
  intervalDays: number;
  label?: string;
}

export interface TaskHistoryEntry {
  completedAt: string;
  nextScheduledDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  color: PostItColor;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  completedAt?: string; // ISO
  recurrence: RecurrenceConfig;
  checklist: ChecklistItem[];
  rotation: number; // e.g. -1.5 to 1.5 degrees
  history?: TaskHistoryEntry[];
  createdAt: string;
}

export type ViewMode = 'board' | 'agenda' | 'split';

export type StatusFilter = 'todas' | 'hoje' | 'pendentes' | 'recorrentes' | 'concluidas';
