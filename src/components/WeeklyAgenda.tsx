import React, { useState } from 'react';
import { Task } from '../types';
import { addDays, formatWeekRangeLabel, getTodayString, getWeekDays, WeekDay } from '../utils/dateUtils';
import { CATEGORY_LABELS, POSTIT_COLORS } from '../utils/themeUtils';
import { ChevronLeft, ChevronRight, Plus, RotateCcw, Clock, Check, Sparkles, Calendar as CalendarIcon } from 'lucide-react';

interface WeeklyAgendaProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onRequestReschedule: (task: Task) => void;
  onOpenNewTaskModal: (date?: string) => void;
}

export const WeeklyAgenda: React.FC<WeeklyAgendaProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onRequestReschedule,
  onOpenNewTaskModal,
}) => {
  const today = getTodayString();
  const [currentReferenceDate, setCurrentReferenceDate] = useState<string>(today);

  // Compute 7 days of the reference week
  const weekDays: WeekDay[] = getWeekDays(currentReferenceDate);
  const weekRangeLabel = formatWeekRangeLabel(weekDays);

  // Navigate weeks
  const handlePrevWeek = () => {
    setCurrentReferenceDate(addDays(currentReferenceDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentReferenceDate(addDays(currentReferenceDate, 7));
  };

  const handleGoToday = () => {
    setCurrentReferenceDate(today);
  };

  // Group tasks by date
  const tasksByDate = React.useMemo(() => {
    const map: Record<string, Task[]> = {};
    weekDays.forEach((wd) => {
      map[wd.dateStr] = [];
    });

    tasks.forEach((task) => {
      if (map[task.date]) {
        map[task.date].push(task);
      }
    });

    // Sort tasks in each day by time
    Object.keys(map).forEach((dateKey) => {
      map[dateKey].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    });

    return map;
  }, [tasks, weekDays]);

  return (
    <div className="space-y-4">
      {/* Week Navigator Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
              Agenda Semanal
            </span>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              {weekRangeLabel}
            </h2>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Hoje
          </button>
          <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
            <button
              onClick={handlePrevWeek}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-700" />
            <button
              onClick={handleNextWeek}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
              title="Próxima semana"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7 Days Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3.5">
        {weekDays.map((day) => {
          const dayTasks = tasksByDate[day.dateStr] || [];
          const pendingCount = dayTasks.filter((t) => !t.completed).length;

          return (
            <div
              key={day.dateStr}
              className={`flex flex-col min-h-[440px] rounded-2xl border transition-all ${
                day.isToday
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-400/80 dark:border-amber-700/60 shadow-xs ring-1 ring-amber-400/30'
                  : 'bg-white dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-3 border-b flex items-center justify-between ${
                  day.isToday
                    ? 'border-amber-300 dark:border-amber-800/60 bg-amber-100/60 dark:bg-amber-900/40'
                    : 'border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">
                      {day.dayNameShort}
                    </span>
                    <span
                      className={`text-xs font-extrabold font-mono-numbers px-1.5 py-0.2 rounded-md ${
                        day.isToday
                          ? 'bg-amber-600 text-white'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                    {dayTasks.length === 0
                      ? 'Livre'
                      : `${dayTasks.length} ${dayTasks.length === 1 ? 'atividade' : 'atividades'}`}
                  </span>
                </div>

                {/* Quick Add Button for this day */}
                <button
                  onClick={() => onOpenNewTaskModal(day.dateStr)}
                  className="p-1 rounded-md text-zinc-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-950/60 transition-colors"
                  title={`Adicionar atividade em ${day.dayNameShort}, ${day.dayNumber}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Day Tasks List */}
              <div className="p-2.5 flex-1 flex flex-col gap-2 overflow-y-auto">
                {dayTasks.length > 0 ? (
                  dayTasks.map((task) => {
                    const colorTheme = POSTIT_COLORS[task.color] || POSTIT_COLORS.yellow;
                    const category = CATEGORY_LABELS[task.category];

                    return (
                      <div
                        key={task.id}
                        className={`group relative p-3 rounded-xl border transition-all text-xs ${colorTheme.cardBg} ${
                          task.completed ? 'opacity-60 line-through' : 'shadow-xs hover:shadow-sm'
                        }`}
                      >
                        {/* Time & Recurrence Header */}
                        <div className="flex items-center justify-between text-[11px] font-medium opacity-80 mb-1">
                          <div className="flex items-center gap-1">
                            {task.time ? (
                              <span className="font-mono-numbers font-semibold flex items-center gap-0.5">
                                <Clock className="w-3 h-3" /> {task.time}
                              </span>
                            ) : (
                              <span>{category.icon} {category.label}</span>
                            )}
                          </div>

                          {task.recurrence.enabled && (
                            <span className="flex items-center gap-0.5 text-amber-800 dark:text-amber-300 font-semibold" title="Tarefa Recorrente">
                              <RotateCcw className="w-2.5 h-2.5" />
                              <span>{task.recurrence.intervalDays}d</span>
                            </span>
                          )}
                        </div>

                        {/* Title & Interactive Toggle */}
                        <div className="flex items-start gap-2 my-1">
                          <button
                            type="button"
                            onClick={() => onToggleComplete(task)}
                            className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-all ${
                              task.completed
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-current/40 hover:border-current hover:bg-black/5 dark:hover:bg-white/10'
                            }`}
                          >
                            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>

                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => onEdit(task)}
                            title="Clique para editar"
                          >
                            <span className="font-bold leading-tight line-clamp-2">
                              {task.title}
                            </span>
                          </div>
                        </div>

                        {/* Checklist progress if present */}
                        {task.checklist && task.checklist.length > 0 && (
                          <div className="mt-1.5 text-[10px] opacity-70 flex items-center gap-1">
                            <span>Checklist:</span>
                            <span className="font-mono-numbers">
                              {task.checklist.filter((c) => c.done).length}/{task.checklist.length}
                            </span>
                          </div>
                        )}

                        {/* Fast Reschedule Button */}
                        <div className="mt-2 pt-1.5 border-t border-current/10 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => onRequestReschedule(task)}
                            className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Lembrar depois</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onEdit(task)}
                            className="text-[10px] opacity-60 hover:opacity-100 hover:underline"
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Empty state for the day */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-xl">
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                      Sem atividades
                    </span>
                    <button
                      onClick={() => onOpenNewTaskModal(day.dateStr)}
                      className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Agendar
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
