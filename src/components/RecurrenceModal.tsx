import React, { useState } from 'react';
import { Task } from '../types';
import { addDays, getTodayString, parseDateString } from '../utils/dateUtils';
import { Calendar, CheckCircle2, Clock, Sparkles, X, RotateCcw, ArrowRight } from 'lucide-react';
import { CATEGORY_LABELS, POSTIT_COLORS } from '../utils/themeUtils';

interface RecurrenceModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onScheduleNext: (taskId: string, nextDate: string, intervalDays: number, keepRecurrence: boolean) => void;
  onCompleteWithoutReschedule: (taskId: string) => void;
}

export const RecurrenceModal: React.FC<RecurrenceModalProps> = ({
  task,
  isOpen,
  onClose,
  onScheduleNext,
  onCompleteWithoutReschedule,
}) => {
  if (!isOpen) return null;

  const today = getTodayString();
  const defaultInterval = task.recurrence.enabled && task.recurrence.intervalDays > 0 ? task.recurrence.intervalDays : 15;

  const [selectedInterval, setSelectedInterval] = useState<number>(defaultInterval);
  const [customDays, setCustomDays] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>(addDays(today, defaultInterval));
  const [mode, setMode] = useState<'preset' | 'customDate'>('preset');
  const [keepFutureRecurrence, setKeepFutureRecurrence] = useState<boolean>(true);

  // Quick preset intervals
  const presets = [
    { days: 3, label: '+3 dias', desc: 'Em breve' },
    { days: 7, label: '+7 dias', desc: '1 semana' },
    { days: 15, label: '+15 dias', desc: 'Quinzena (ex: Pet)', highlight: task.category === 'pet' || defaultInterval === 15 },
    { days: 30, label: '+30 dias', desc: '1 mês' },
    { days: 90, label: '+90 dias', desc: 'Trimestral' },
  ];

  const handleSelectPreset = (days: number) => {
    setSelectedInterval(days);
    setMode('preset');
    setCustomDate(addDays(today, days));
    setCustomDays('');
  };

  const handleCustomDaysChange = (val: string) => {
    setCustomDays(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setSelectedInterval(num);
      setCustomDate(addDays(today, num));
      setMode('preset');
    }
  };

  const handleCustomDateChange = (val: string) => {
    setCustomDate(val);
    setMode('customDate');
    const targetDate = parseDateString(val);
    const todayDate = parseDateString(today);
    const diff = Math.round((targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0) {
      setSelectedInterval(diff);
    }
  };

  const handleConfirm = () => {
    const finalDate = mode === 'customDate' ? customDate : addDays(today, selectedInterval);
    onScheduleNext(task.id, finalDate, selectedInterval, keepFutureRecurrence);
  };

  const targetDateLabel = () => {
    const dStr = mode === 'customDate' ? customDate : addDays(today, selectedInterval);
    const [y, m, d] = dStr.split('-');
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${d} de ${months[parseInt(m, 10) - 1]} de ${y}`;
  };

  const colorTheme = POSTIT_COLORS[task.color] || POSTIT_COLORS.yellow;
  const categoryInfo = CATEGORY_LABELS[task.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl my-6 max-h-[calc(100vh-48px)] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Banner - Fixed Header */}
        <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-amber-950/20 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  Tarefa Realizada com Sucesso!
                </span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white truncate">
                  {task.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <span>{categoryInfo.icon} {categoryInfo.label}</span>
            <span aria-hidden="true">·</span>
            <span>Concluído hoje</span>
            {task.recurrence.enabled && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> {task.recurrence.label || `A cada ${task.recurrence.intervalDays} dias`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Modal Content - Scrollable when needed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Quando você deseja ser lembrado novamente?
              </label>
              <span className="text-xs text-zinc-500">Recorrência inteligente</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Ideal para rotinas periódicas (banho do cachorro, troca de filtro, regar plantas ou consultas).
            </p>
          </div>

          {/* Quick Presets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {presets.map((preset) => {
              const isSelected = mode === 'preset' && selectedInterval === preset.days && !customDays;
              return (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => handleSelectPreset(preset.days)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-sm ring-1 ring-amber-400'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{preset.label}</span>
                    {preset.highlight && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Recomendado para esta tarefa" />
                    )}
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-0.5">
                    {preset.desc}
                  </span>
                </button>
              );
            })}

            {/* Custom Days Input button / tile */}
            <div className={`p-3 rounded-xl border transition-all ${
              customDays ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40'
            }`}>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 block mb-1">
                Outro intervalo:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={customDays}
                  onChange={(e) => handleCustomDaysChange(e.target.value)}
                  placeholder="Ex: 21"
                  className="w-full px-2 py-1 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="text-xs text-zinc-500 shrink-0">dias</span>
              </div>
            </div>
          </div>

          {/* Or specific calendar date selection */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" /> Ou escolha uma data específica:
              </span>
            </div>
            <input
              type="date"
              min={today}
              value={customDate}
              onChange={(e) => handleCustomDateChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-zinc-800 dark:text-zinc-200"
            />
          </div>

          {/* Target Preview Box */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                  Próxima Notificação na Agenda:
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {targetDateLabel()} (daqui a {selectedInterval} dias)
                </span>
              </div>
            </div>
          </div>

          {/* Keep future recurrence checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepFutureRecurrence}
              onChange={(e) => setKeepFutureRecurrence(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 border-zinc-300 dark:border-zinc-700 focus:ring-amber-500"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-300">
              Continuar repetindo a cada <strong className="text-zinc-900 dark:text-zinc-100">{selectedInterval} dias</strong> nos próximos ciclos
            </span>
          </label>
        </div>

        {/* Modal Footer Actions - Fixed at Bottom */}
        <div className="shrink-0 p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onCompleteWithoutReschedule(task.id)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 rounded-lg transition-colors"
          >
            Apenas Concluir (Sem Reagendar)
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="w-1/2 sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              Agendar Próxima <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
