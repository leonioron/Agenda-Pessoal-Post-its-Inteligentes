import React, { useState, useMemo } from 'react';
import { PostItColor, StatusFilter, Task, TaskCategory } from '../types';
import { PostItCard } from './PostItCard';
import { CATEGORY_LABELS } from '../utils/themeUtils';
import { getTodayString } from '../utils/dateUtils';
import { Filter, Plus, Search, Sparkles, CheckCircle2, RotateCcw, Calendar, SlidersHorizontal } from 'lucide-react';

interface PostItBoardProps {
  tasks: Task[];
  searchQuery: string;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDuplicate: (task: Task) => void;
  onToggleChecklistItem: (taskId: string, itemId: string) => void;
  onRequestReschedule: (task: Task) => void;
  onOpenNewTaskModal: (prefilledCategory?: TaskCategory) => void;
}

export const PostItBoard: React.FC<PostItBoardProps> = ({
  tasks,
  searchQuery,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleChecklistItem,
  onRequestReschedule,
  onOpenNewTaskModal,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'todas'>('todas');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'created'>('date');

  const today = getTodayString();

  // Metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const todayCount = tasks.filter((t) => t.date === today && !t.completed).length;
    const recurringCount = tasks.filter((t) => t.recurrence.enabled).length;
    return { total, completed, pending, todayCount, recurringCount };
  }, [tasks, today]);

  // Filtering & Sorting
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchCheck = task.checklist.some((c) => c.text.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCheck) return false;
        }

        // Status filter
        if (statusFilter === 'hoje' && (task.date !== today || task.completed)) return false;
        if (statusFilter === 'pendentes' && task.completed) return false;
        if (statusFilter === 'recorrentes' && !task.recurrence.enabled) return false;
        if (statusFilter === 'concluidas' && !task.completed) return false;

        // Category filter
        if (selectedCategory !== 'todas' && task.category !== selectedCategory) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const priorityScore = { alta: 3, media: 2, baixa: 1 };
          return priorityScore[b.priority] - priorityScore[a.priority];
        }
        if (sortBy === 'created') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Default: by date and then time
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return (a.time || '').localeCompare(b.time || '');
      });
  }, [tasks, searchQuery, statusFilter, selectedCategory, sortBy, today]);

  return (
    <div className="space-y-6">
      {/* Board Controls Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
          <button
            onClick={() => setStatusFilter('todas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'todas'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Todas ({stats.total})
          </button>
          <button
            onClick={() => setStatusFilter('hoje')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              statusFilter === 'hoje'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Para Hoje ({stats.todayCount})
          </button>
          <button
            onClick={() => setStatusFilter('pendentes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'pendentes'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Pendentes ({stats.pending})
          </button>
          <button
            onClick={() => setStatusFilter('recorrentes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              statusFilter === 'recorrentes'
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <RotateCcw className="w-3 h-3 text-amber-600" />
            Recorrentes ({stats.recurringCount})
          </button>
          <button
            onClick={() => setStatusFilter('concluidas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              statusFilter === 'concluidas'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Concluídas ({stats.completed})
          </button>
        </div>

        {/* Category & Sorting Controls */}
        <div className="flex items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-400 dark:text-zinc-500 hidden sm:inline">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TaskCategory | 'todas')}
              className="px-2.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="todas">Todas as Categorias</option>
              {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((cKey) => (
                <option key={cKey} value={cKey}>
                  {CATEGORY_LABELS[cKey].icon} {CATEGORY_LABELS[cKey].label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-zinc-400 dark:text-zinc-500 hidden sm:inline">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'created')}
              className="px-2.5 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="date">Data & Horário</option>
              <option value="priority">Prioridade</option>
              <option value="created">Mais Recentes</option>
            </select>
          </div>

          {/* New Post-It CTA */}
          <button
            onClick={() => onOpenNewTaskModal(selectedCategory !== 'todas' ? selectedCategory : undefined)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Post-it</span>
          </button>
        </div>
      </div>

      {/* Board Summary Banner */}
      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1">
        <div className="flex items-center gap-3">
          <span>Exibindo <strong>{filteredTasks.length}</strong> de {tasks.length} post-its</span>
          <span aria-hidden="true">·</span>
          <span>Dica: Clique no checkbox para concluir ou no botão de lembrar para agendar a próxima ocorrência!</span>
        </div>
      </div>

      {/* Post-Its Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
          {filteredTasks.map((task) => (
            <PostItCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onToggleChecklistItem={onToggleChecklistItem}
              onRequestReschedule={onRequestReschedule}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            Nenhum post-it encontrado neste filtro
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
            Crie um novo post-it para o dia de hoje ou ajuste os filtros acima para visualizar suas outras anotações.
          </p>
          <button
            onClick={() => onOpenNewTaskModal()}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Colar Primeiro Post-it</span>
          </button>
        </div>
      )}
    </div>
  );
};
