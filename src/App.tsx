import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, ViewMode } from './types';
import { INITIAL_TASKS } from './data/initialTasks';
import { TopBar } from './components/TopBar';
import { PostItBoard } from './components/PostItBoard';
import { WeeklyAgenda } from './components/WeeklyAgenda';
import { RecurrenceModal } from './components/RecurrenceModal';
import { TaskModal } from './components/TaskModal';
import { BackupModal } from './components/BackupModal';
import { formatFriendlyDate, getTodayString } from './utils/dateUtils';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

const STORAGE_KEY = 'agenda_pessoal_tasks_v2';
const THEME_KEY = 'agenda_pessoal_theme_v2';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [darkMode]);

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Falha ao ler tasks do localStorage:', e);
    }
    return INITIAL_TASKS;
  });

  // Save to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Falha ao salvar tasks no localStorage:', e);
    }
  }, [tasks]);

  // View & UI state
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [prefilledDate, setPrefilledDate] = useState<string | undefined>(undefined);
  const [recurrenceModalTask, setRecurrenceModalTask] = useState<Task | null>(null);
  const [backupModalOpen, setBackupModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ title: string; desc?: string } | null>(null);

  const showToast = (title: string, desc?: string) => {
    setToast({ title, desc });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Handlers for task completion & recurrence
  const handleToggleComplete = (task: Task) => {
    if (!task.completed) {
      // Completing the task:
      const updatedTasks = tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              completed: true,
              completedAt: new Date().toISOString(),
              checklist: t.checklist.map((c) => ({ ...c, done: true })),
            }
          : t
      );
      setTasks(updatedTasks);

      // Open the recurrence reminder modal so user can choose when to repeat (ex: banho do cachorro a cada 15 dias)
      setRecurrenceModalTask(task);
    } else {
      // Revert to pending
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: false, completedAt: undefined } : t))
      );
      showToast('Tarefa marcada como pendente novamente');
    }
  };

  const handleScheduleNext = (
    taskId: string,
    nextDate: string,
    intervalDays: number,
    keepRecurrence: boolean
  ) => {
    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask) {
      setRecurrenceModalTask(null);
      return;
    }

    // 1. Mark original task as completed
    const nowIso = new Date().toISOString();
    const updatedTasks = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            completed: true,
            completedAt: nowIso,
            history: [
              ...(t.history || []),
              { completedAt: nowIso, nextScheduledDate: nextDate },
            ],
          }
        : t
    );

    // 2. Create the next occurrence scheduled for `nextDate`
    const nextTask: Task = {
      ...originalTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: nextDate,
      completed: false,
      completedAt: undefined,
      checklist: originalTask.checklist.map((item) => ({ ...item, done: false })),
      recurrence: {
        enabled: keepRecurrence,
        intervalDays: intervalDays,
        label: keepRecurrence ? `A cada ${intervalDays} dias` : undefined,
      },
      rotation: Number(((Math.random() - 0.5) * 3).toFixed(1)),
      createdAt: nowIso,
    };

    setTasks([...updatedTasks, nextTask]);
    setRecurrenceModalTask(null);

    showToast(
      'Próxima ocorrência agendada!',
      `"${originalTask.title}" agendada para ${formatFriendlyDate(nextDate)} (${intervalDays} dias).`
    );
  };

  const handleCompleteWithoutReschedule = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: true,
              completedAt: new Date().toISOString(),
            }
          : t
      )
    );
    setRecurrenceModalTask(null);
    showToast('Tarefa concluída!');
  };

  const handleOpenNewTaskModal = (dateOrCat?: string | TaskCategory) => {
    setEditingTask(null);
    if (typeof dateOrCat === 'string' && dateOrCat.includes('-')) {
      setPrefilledDate(dateOrCat);
    } else {
      setPrefilledDate(getTodayString());
    }
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setPrefilledDate(undefined);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'rotation'>,
    existingId?: string
  ) => {
    if (existingId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === existingId ? { ...t, ...taskData } : t))
      );
      showToast('Post-it atualizado com sucesso!');
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        rotation: Number(((Math.random() - 0.5) * 3).toFixed(1)),
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast('Novo post-it colado na agenda!');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Post-it removido');
  };

  const handleDuplicateTask = (task: Task) => {
    const duplicated: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${task.title} (Cópia)`,
      completed: false,
      completedAt: undefined,
      rotation: Number(((Math.random() - 0.5) * 3).toFixed(1)),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [duplicated, ...prev]);
    showToast('Post-it duplicado');
  };

  const handleToggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedChecklist = t.checklist.map((c) =>
          c.id === itemId ? { ...c, done: !c.done } : c
        );
        return { ...t, checklist: updatedChecklist };
      })
    );
  };

  const handleImportTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    showToast('Tarefas importadas com sucesso!');
  };

  const handleResetDefaultTasks = () => {
    setTasks(INITIAL_TASKS);
    showToast('Exemplos iniciais recarregados!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Header */}
      <TopBar
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenNewTaskModal={() => handleOpenNewTaskModal()}
        onOpenBackupModal={() => setBackupModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'board' && (
          <PostItBoard
            tasks={tasks}
            searchQuery={searchQuery}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onDuplicate={handleDuplicateTask}
            onToggleChecklistItem={handleToggleChecklistItem}
            onRequestReschedule={(task) => setRecurrenceModalTask(task)}
            onOpenNewTaskModal={handleOpenNewTaskModal}
          />
        )}

        {viewMode === 'agenda' && (
          <WeeklyAgenda
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onRequestReschedule={(task) => setRecurrenceModalTask(task)}
            onOpenNewTaskModal={handleOpenNewTaskModal}
          />
        )}

        {viewMode === 'split' && (
          <div className="space-y-8">
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                  Agenda da Semana Atual
                </h2>
              </div>
              <WeeklyAgenda
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onRequestReschedule={(task) => setRecurrenceModalTask(task)}
                onOpenNewTaskModal={handleOpenNewTaskModal}
              />
            </section>

            <section className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                  Quadro de Post-its Diários
                </h2>
              </div>
              <PostItBoard
                tasks={tasks}
                searchQuery={searchQuery}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onDuplicate={handleDuplicateTask}
                onToggleChecklistItem={handleToggleChecklistItem}
                onRequestReschedule={(task) => setRecurrenceModalTask(task)}
                onOpenNewTaskModal={handleOpenNewTaskModal}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-zinc-200/80 dark:border-zinc-800/80 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Agenda Pessoal · Armazenamento 100% Local no Navegador</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBackupModalOpen(true)}
              className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
            >
              Exportar / Importar Dados
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handleResetDefaultTasks()}
              className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
            >
              Restaurar Exemplos
            </button>
          </div>
        </div>
      </footer>

      {/* Recurrence & Next Reminder Modal */}
      {recurrenceModalTask && (
        <RecurrenceModal
          task={recurrenceModalTask}
          isOpen={!!recurrenceModalTask}
          onClose={() => setRecurrenceModalTask(null)}
          onScheduleNext={handleScheduleNext}
          onCompleteWithoutReschedule={handleCompleteWithoutReschedule}
        />
      )}

      {/* Create / Edit Task Modal */}
      {taskModalOpen && (
        <TaskModal
          isOpen={taskModalOpen}
          onClose={() => {
            setTaskModalOpen(false);
            setEditingTask(null);
            setPrefilledDate(undefined);
          }}
          onSave={handleSaveTask}
          initialTask={editingTask}
          initialDate={prefilledDate}
        />
      )}

      {/* Backup & Restore Modal */}
      {backupModalOpen && (
        <BackupModal
          isOpen={backupModalOpen}
          onClose={() => setBackupModalOpen(false)}
          tasks={tasks}
          onImportTasks={handleImportTasks}
          onResetDefaultTasks={handleResetDefaultTasks}
        />
      )}

      {/* Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="px-4 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl border border-zinc-700 dark:border-zinc-300 flex items-center gap-3 max-w-sm">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight truncate">{toast.title}</p>
              {toast.desc && <p className="text-[11px] opacity-80 leading-tight mt-0.5 truncate">{toast.desc}</p>}
            </div>
            <button
              onClick={() => setToast(null)}
              className="p-1 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
