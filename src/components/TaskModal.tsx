import React, { useState, useEffect } from 'react';
import { ChecklistItem, PostItColor, RecurrenceConfig, Task, TaskCategory, TaskPriority } from '../types';
import { addDays, getTodayString } from '../utils/dateUtils';
import { CATEGORY_LABELS, POSTIT_COLORS, PRIORITY_LABELS } from '../utils/themeUtils';
import { Calendar, CheckSquare, Clock, Plus, RotateCcw, Trash2, X, Sparkles } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'rotation'>, existingId?: string) => void;
  initialTask?: Task | null;
  initialDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  initialDate,
}) => {
  if (!isOpen) return null;

  const today = getTodayString();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<PostItColor>('yellow');
  const [date, setDate] = useState(initialDate || today);
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<TaskCategory>('geral');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(false);
  const [recurrenceDays, setRecurrenceDays] = useState(15);
  const [recurrenceLabel, setRecurrenceLabel] = useState('A cada 15 dias');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setColor(initialTask.color);
      setDate(initialTask.date);
      setTime(initialTask.time || '');
      setCategory(initialTask.category);
      setPriority(initialTask.priority);
      setRecurrenceEnabled(initialTask.recurrence.enabled);
      setRecurrenceDays(initialTask.recurrence.intervalDays || 15);
      setRecurrenceLabel(initialTask.recurrence.label || `A cada ${initialTask.recurrence.intervalDays || 15} dias`);
      setChecklist(initialTask.checklist || []);
    } else {
      setTitle('');
      setDescription('');
      setColor('yellow');
      setDate(initialDate || today);
      setTime('');
      setCategory('geral');
      setPriority('media');
      setRecurrenceEnabled(false);
      setRecurrenceDays(15);
      setRecurrenceLabel('A cada 15 dias');
      setChecklist([]);
    }
  }, [initialTask, initialDate, isOpen]);

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      {
        id: `check-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        text: newChecklistText.trim(),
        done: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const recurrenceConfig: RecurrenceConfig = {
      enabled: recurrenceEnabled,
      intervalDays: recurrenceDays,
      label: recurrenceEnabled ? (recurrenceLabel || `A cada ${recurrenceDays} dias`) : undefined,
    };

    onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        color,
        date: date || today,
        time: time.trim() || undefined,
        category,
        priority,
        completed: initialTask ? initialTask.completed : false,
        completedAt: initialTask ? initialTask.completedAt : undefined,
        recurrence: recurrenceConfig,
        checklist,
      },
      initialTask?.id
    );
    onClose();
  };

  // Quick preset suggestions
  const quickTemplates = [
    { title: 'Banho do pet 🐶', cat: 'pet' as TaskCategory, col: 'yellow' as PostItColor, recDays: 15 },
    { title: 'Regar as plantas 🪴', cat: 'casa' as TaskCategory, col: 'mint' as PostItColor, recDays: 4 },
    { title: 'Consulta médica / exames 🩺', cat: 'saude' as TaskCategory, col: 'sky' as PostItColor, recDays: 180 },
    { title: 'Troca de filtro / manutenção 🔧', cat: 'casa' as TaskCategory, col: 'peach' as PostItColor, recDays: 90 },
  ];

  const applyTemplate = (tpl: typeof quickTemplates[0]) => {
    setTitle(tpl.title);
    setCategory(tpl.cat);
    setColor(tpl.col);
    setRecurrenceEnabled(true);
    setRecurrenceDays(tpl.recDays);
    setRecurrenceLabel(`A cada ${tpl.recDays} dias`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl my-6 max-h-[calc(100vh-48px)] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {initialTask ? 'Editar Post-it / Atividade' : 'Novo Post-it / Atividade'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Adicione à agenda do dia ou programe para a semana
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Quick Suggestions for new tasks */}
          {!initialTask && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1.5">
                Ideias Rápidas com Recorrência Pronta:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-900 dark:hover:text-amber-200 border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Título da Tarefa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Banho do cachorro Totó, Consulta médica, Fazer feira..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-900 dark:text-white"
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Cor do Post-it
            </label>
            <div className="grid grid-cols-6 gap-2">
              {(Object.keys(POSTIT_COLORS) as PostItColor[]).map((cKey) => {
                const c = POSTIT_COLORS[cKey];
                const isSelected = color === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setColor(cKey)}
                    className={`h-10 rounded-xl transition-all border flex items-center justify-center relative ${
                      isSelected
                        ? 'ring-2 ring-zinc-900 dark:ring-white scale-105 shadow-md border-transparent'
                        : 'border-black/10 hover:scale-102 opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-900 dark:text-white"
              >
                {(Object.keys(CATEGORY_LABELS) as TaskCategory[]).map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {CATEGORY_LABELS[catKey].icon} {CATEGORY_LABELS[catKey].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-900 dark:text-white"
              >
                {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((pKey) => (
                  <option key={pKey} value={pKey}>
                    {PRIORITY_LABELS[pKey].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" /> Data Prevista
                </label>
                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDate(today)}
                    className="text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Hoje
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setDate(addDays(today, 1))}
                    className="text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Amanhã
                  </button>
                </div>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" /> Horário (Opcional)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Notas ou Detalhes (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Instruções adicionais, lembretes ou informações de apoio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-900 dark:text-white resize-none"
            />
          </div>

          {/* Checklist Subtasks */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-zinc-400" /> Itens de Checklist / Subtarefas
            </label>
            
            {/* Checklist items list */}
            {checklist.length > 0 && (
              <div className="space-y-1.5 mb-2.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-150 dark:border-zinc-700/60 text-xs"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => handleToggleChecklistItem(item.id)}
                        className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className={`truncate ${item.done ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {item.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                      title="Remover item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input to add subtask */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Adicionar subtarefa (ex: comprar shampoo, secar pelo)..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>
          </div>

          {/* Smart Recurrence Configuration */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recurrenceEnabled}
                  onChange={(e) => setRecurrenceEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                />
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    Lembrar novamente depois de concluída
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                    Ao finalizar esta tarefa, o próximo ciclo será sugerido automaticamente
                  </span>
                </div>
              </label>
            </div>

            {recurrenceEnabled && (
              <div className="pt-2 border-t border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 shrink-0">
                    Repetir a cada:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[4, 7, 15, 30, 90].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setRecurrenceDays(d);
                          setRecurrenceLabel(`A cada ${d} dias`);
                        }}
                        className={`px-2 py-1 text-xs rounded-md border font-medium transition-colors ${
                          recurrenceDays === d
                            ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                            : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-amber-50'
                        }`}
                      >
                        {d === 15 ? '15 dias (Pet)' : `${d}d`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={recurrenceDays}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10) || 1;
                      setRecurrenceDays(v);
                      setRecurrenceLabel(`A cada ${v} dias`);
                    }}
                    className="w-20 px-2.5 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-white"
                  />
                  <span className="text-xs text-zinc-500">dias</span>

                  <input
                    type="text"
                    placeholder="Rótulo (ex: Quinzena do banho)"
                    value={recurrenceLabel}
                    onChange={(e) => setRecurrenceLabel(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-sm transition-colors"
            >
              {initialTask ? 'Salvar Alterações' : 'Criar Post-it'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
