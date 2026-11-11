import React, { useRef, useState } from 'react';
import { Task } from '../types';
import { Download, Upload, RotateCcw, X, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onImportTasks: (tasks: Task[]) => void;
  onResetDefaultTasks: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onImportTasks,
  onResetDefaultTasks,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `agenda-pessoal-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setStatusMessage({ text: 'Backup exportado com sucesso!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {
      setStatusMessage({ text: 'Erro ao exportar arquivo.', isError: true });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportTasks(parsed);
          setStatusMessage({ text: `${parsed.length} tarefas importadas com sucesso!` });
          setTimeout(() => {
            setStatusMessage(null);
            onClose();
          }, 1500);
        } else {
          setStatusMessage({ text: 'O arquivo não contém uma lista de tarefas válida.', isError: true });
        }
      } catch (err) {
        setStatusMessage({ text: 'Arquivo JSON inválido.', isError: true });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md my-6 max-h-[calc(100vh-48px)] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Backup & Armazenamento Local
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Sua agenda opera <strong>100% no seu navegador</strong> (armazenamento local). Nenhum dado é enviado para servidores externos. Você pode baixar uma cópia de segurança a qualquer momento.
          </p>

          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              statusMessage.isError
                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
            }`}>
              {statusMessage.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Action cards */}
          <div className="space-y-2.5">
            {/* Export */}
            <button
              onClick={handleExportJSON}
              className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                    Exportar Backup (JSON)
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Salva todas as {tasks.length} tarefas no seu computador
                  </span>
                </div>
              </div>
            </button>

            {/* Import */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                    Restaurar de um Arquivo (JSON)
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Carregar anotações salvas anteriormente
                  </span>
                </div>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            {/* Reset to initial demo */}
            <button
              onClick={() => {
                if (confirm('Deseja recarregar os exemplos iniciais da agenda?')) {
                  onResetDefaultTasks();
                  onClose();
                }
              }}
              className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-left flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                    Restaurar Tarefas de Exemplo
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Inclui banho do pet, regar plantas e consultas
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
