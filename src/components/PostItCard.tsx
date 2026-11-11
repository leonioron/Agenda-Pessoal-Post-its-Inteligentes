import React from 'react';
import { Task } from '../types';
import { CATEGORY_LABELS, POSTIT_COLORS, PRIORITY_LABELS } from '../utils/themeUtils';
import { formatFriendlyDate, getTodayString } from '../utils/dateUtils';
import { Check, CheckCircle2, Clock, Edit2, MoreVertical, RotateCcw, Trash2, Copy, Sparkles } from 'lucide-react';

interface PostItCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDuplicate: (task: Task) => void;
  onToggleChecklistItem: (taskId: string, itemId: string) => void;
  onRequestReschedule: (task: Task) => void;
}

export const PostItCard: React.FC<PostItCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleChecklistItem,
  onRequestReschedule,
}) => {
  const colorTheme = POSTIT_COLORS[task.color] || POSTIT_COLORS.yellow;
  const category = CATEGORY_LABELS[task.category] || CATEGORY_LABELS.geral;
  const priority = PRIORITY_LABELS[task.priority] || PRIORITY_LABELS.media;
  const today = getTodayString();
  const isToday = task.date === today;

  const totalChecklist = task.checklist?.length || 0;
  const completedChecklist = task.checklist?.filter((item) => item.done).length || 0;

  return (
    <div
      style={{
        transform: `rotate(${task.rotation}deg)`,
      }}
      className={`group relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 postit-shadow hover:postit-shadow-hover hover:-translate-y-1 hover:z-20 ${colorTheme.cardBg} ${
        task.completed ? 'opacity-70 grayscale-[30%]' : ''
      }`}
    >
      {/* Top Masking Tape Visual */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4.5 masking-tape rounded-xs border-x border-white/60 pointer-events-none" />

      {/* Card Header & Controls */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          {/* Metadata: Category & Priority */}
          <div className="flex items-center gap-1.5 text-xs font-medium opacity-80">
            <span>{category.icon} {category.label}</span>
            <span aria-hidden="true">·</span>
            <span className={task.priority === 'alta' ? 'font-bold text-red-700 dark:text-red-300' : ''}>
              {priority.label}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Editar"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDuplicate(task)}
              className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Duplicar"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 rounded-md hover:bg-red-500/20 hover:text-red-700 transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task Title with Interactive Completion Checkbox */}
        <div className="flex items-start gap-2.5 my-2">
          <button
            type="button"
            onClick={() => onToggleComplete(task)}
            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
              task.completed
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'border-current/40 hover:border-current hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          <div className="min-w-0 flex-1">
            <h3
              className={`text-base font-bold leading-snug tracking-tight text-balance ${
                task.completed ? 'line-through opacity-60' : ''
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className={`mt-1.5 text-xs opacity-85 leading-relaxed line-clamp-3 ${task.completed ? 'line-through opacity-50' : ''}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Checklist Subtasks if any */}
        {totalChecklist > 0 && (
          <div className="mt-3 pt-2.5 border-t border-current/10 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium opacity-70 mb-1">
              <span>Subtarefas</span>
              <span className="font-mono-numbers">{completedChecklist}/{totalChecklist}</span>
            </div>
            {task.checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 text-xs cursor-pointer select-none group/item"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onToggleChecklistItem(task.id, item.id)}
                  className="w-3.5 h-3.5 rounded text-amber-600 border-current/40 focus:ring-amber-500"
                />
                <span className={`truncate ${item.done ? 'line-through opacity-50' : 'opacity-90'}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Date, Recurrence and Reschedule Trigger */}
      <div className="mt-4 pt-3 border-t border-current/15 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs opacity-80">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className={isToday ? 'font-bold underline underline-offset-2' : ''}>
              {formatFriendlyDate(task.date)}
            </span>
            {task.time && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono-numbers">{task.time}</span>
              </>
            )}
          </div>

          {task.recurrence.enabled && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300" title="Tarefa Recorrente">
              <RotateCcw className="w-3 h-3" />
              <span>{task.recurrence.label || `${task.recurrence.intervalDays}d`}</span>
            </div>
          )}
        </div>

        {/* Recurrence Prompt / Next Reminder Button */}
        <button
          type="button"
          onClick={() => onRequestReschedule(task)}
          className="w-full mt-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/10 dark:border-white/10 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{task.completed ? 'Reagendar novo ciclo' : 'Lembrar novamente depois'}</span>
        </button>

        {/* Completed Stamp */}
        {task.completed && (
          <div className="mt-1 text-center">
            <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 border border-emerald-600/40 rounded-sm rotate-1">
              Concluído ✓
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
