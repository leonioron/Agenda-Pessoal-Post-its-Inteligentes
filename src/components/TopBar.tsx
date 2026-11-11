import React from 'react';
import { ViewMode } from '../types';
import { Calendar, LayoutGrid, Columns2, Plus, Moon, Sun, Shield, Search } from 'lucide-react';

interface TopBarProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenNewTaskModal: () => void;
  onOpenBackupModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  onChangeViewMode,
  onOpenNewTaskModal,
  onOpenBackupModal,
  darkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-xs rotate-[-3deg]">
            📝
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-white whitespace-nowrap">
            Agenda Pessoal
          </span>
        </div>

        {/* Zone 2: View Switcher Tabs & Search Input */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-auto">
          {/* View Mode Segmented Controls */}
          <div className="flex items-center p-1 bg-zinc-200/60 dark:bg-zinc-800/80 rounded-xl">
            <button
              onClick={() => onChangeViewMode('board')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Post-its</span>
            </button>

            <button
              onClick={() => onChangeViewMode('agenda')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                viewMode === 'agenda'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Semana</span>
            </button>

            <button
              onClick={() => onChangeViewMode('split')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Dividida</span>
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-100/80 dark:bg-zinc-800/60 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-amber-500 rounded-lg focus:outline-none text-zinc-900 dark:text-white placeholder-zinc-400 transition-colors"
            />
          </div>
        </div>

        {/* Zone 3: Actions (Backup, Theme toggle & Primary "+ Novo Post-it") */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Backup / Export */}
          <button
            onClick={onOpenBackupModal}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Backup & Armazenamento Local"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Dark Mode Switch */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={darkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* Primary CTA Button */}
          <button
            onClick={onOpenNewTaskModal}
            className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Post-it</span>
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Bar */}
      <div className="md:hidden px-4 pb-3 flex items-center gap-2 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-2.5">
        <div className="flex items-center p-0.5 bg-zinc-200/60 dark:bg-zinc-800/80 rounded-lg flex-1">
          <button
            onClick={() => onChangeViewMode('board')}
            className={`flex-1 py-1 text-xs font-semibold rounded-md flex items-center justify-center gap-1 transition-all ${
              viewMode === 'board'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>Post-its</span>
          </button>
          <button
            onClick={() => onChangeViewMode('agenda')}
            className={`flex-1 py-1 text-xs font-semibold rounded-md flex items-center justify-center gap-1 transition-all ${
              viewMode === 'agenda'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Semana</span>
          </button>
          <button
            onClick={() => onChangeViewMode('split')}
            className={`flex-1 py-1 text-xs font-semibold rounded-md flex items-center justify-center gap-1 transition-all ${
              viewMode === 'split'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <Columns2 className="w-3 h-3" />
            <span>Dividida</span>
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-28 px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
        />
      </div>
    </header>
  );
};
