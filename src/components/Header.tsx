import React from "react";
import { 
  Stethoscope, 
  Flame, 
  Calendar, 
  Moon, 
  Sun, 
  Sparkles, 
  Brain, 
  Pill, 
  FileText, 
  Activity, 
  Clock 
} from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  questionsAnsweredToday: number;
  dailyQuestionTarget: number;
  streakDays: number;
  nclexCountdownDays: number;
  onOpenAiMcqModal: () => void;
  onOpenCarePlanModal: () => void;
  onOpenDrugCardModal: () => void;
  onOpenAbgLabsModal: () => void;
  onOpenPomodoroModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  questionsAnsweredToday,
  dailyQuestionTarget,
  streakDays,
  nclexCountdownDays,
  onOpenAiMcqModal,
  onOpenCarePlanModal,
  onOpenDrugCardModal,
  onOpenAbgLabsModal,
  onOpenPomodoroModal
}) => {
  const targetPct = Math.min(100, Math.round((questionsAnsweredToday / dailyQuestionTarget) * 100));

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 transition-colors duration-200 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 text-white shrink-0">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">
                  AI Nursing Student Planner
                </h1>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-extrabold bg-sky-500/10 text-sky-400 rounded-md border border-sky-500/30">
                  BSN Dashboard
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                High-Yield NCLEX Prep • Clinical Tracker • AI Study Suite
              </p>
            </div>
          </div>

          {/* Quick Metrics & Theme Toggle */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-400 text-xs font-semibold shadow-xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>🔥 {streakDays} Day Streak</span>
            </div>

            {/* NCLEX Exam Countdown */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
              <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>NCLEX: {nclexCountdownDays} Days</span>
            </div>

            {/* Daily MCQ Progress */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs shadow-xs">
              <Activity className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <div className="text-xs">
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">{questionsAnsweredToday}/{dailyQuestionTarget}</span> Qs Today
              </div>
              <div className="w-12 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-500 h-full transition-all duration-500" 
                  style={{ width: `${targetPct}%` }}
                />
              </div>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-sky-500 transition-colors shadow-xs"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
            </button>

          </div>
        </div>

        {/* AI Action Buttons Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> AI Assistant Suite:
          </span>

          <button
            onClick={onOpenAiMcqModal}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white shadow-lg shadow-sky-500/20 transition-all flex items-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5" /> Generate NCLEX Quiz
          </button>

          <button
            onClick={onOpenDrugCardModal}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
          >
            <Pill className="w-3.5 h-3.5 text-sky-400" /> Drug Card Generator
          </button>

          <button
            onClick={onOpenCarePlanModal}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" /> Break Down Care Plan
          </button>

          <button
            onClick={onOpenAbgLabsModal}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" /> ABG & Lab Reference
          </button>

          <button
            onClick={onOpenPomodoroModal}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center gap-1.5 ml-auto"
          >
            <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> Pomodoro Timer
          </button>
        </div>

      </div>
    </header>
  );
};
