import React, { useState, useEffect } from "react";
import { StudyTask } from "../types";
import { Clock, Play, Pause, RotateCcw, CheckCircle2, Coffee, BookOpen } from "lucide-react";

interface PomodoroTimerProps {
  tasks: StudyTask[];
  linkedTaskId?: string | null;
  onClose?: () => void;
  onIncrementPomodoroCount?: (taskId: string) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  tasks,
  linkedTaskId,
  onClose,
  onIncrementPomodoroCount
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(linkedTaskId || (tasks[0]?.id || ""));
  const [mode, setMode] = useState<"study" | "break">("study");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 mins
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      if (mode === "study") {
        setCompletedSessions(prev => prev + 1);
        if (selectedTaskId && onIncrementPomodoroCount) {
          onIncrementPomodoroCount(selectedTaskId);
        }
        setMode("break");
        setTimeLeft(5 * 60); // 5 min break
      } else {
        setMode("study");
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, selectedTaskId, onIncrementPomodoroCount]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "study" ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: "study" | "break") => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === "study" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalDuration = mode === "study" ? 25 * 60 : 5 * 60;
  const progressPct = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl p-5 md:p-6 space-y-5 max-w-lg mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              BSN Pomodoro Study Timer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              25-Min Focus Study / 5-Min Rest Interval
            </p>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            ✕
          </button>
        )}
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl text-xs font-bold">
        <button
          onClick={() => switchMode("study")}
          className={`py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            mode === "study"
              ? "bg-rose-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>25-Min Study Focus</span>
        </button>

        <button
          onClick={() => switchMode("break")}
          className={`py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            mode === "break"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>5-Min Rest Break</span>
        </button>
      </div>

      {/* Task Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Link Timer Session to Task:
        </label>
        <select
          value={selectedTaskId}
          onChange={e => setSelectedTaskId(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
        >
          <option value="">-- General NCLEX Study --</option>
          {tasks.map(t => (
            <option key={t.id} value={t.id}>
              [{t.category}] {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* Timer Display Circle */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        <div className="w-48 h-48 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center relative shadow-inner">
          <div className="text-center space-y-1">
            <div className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              {mode === "study" ? "Focus Mode" : "Break Mode"}
            </div>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Completed Sessions Today: {completedSessions}</span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center space-x-3 pt-2">
        <button
          onClick={resetTimer}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTimer}
          className={`px-8 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center space-x-2 ${
            isRunning
              ? "bg-amber-600 hover:bg-amber-700"
              : mode === "study"
              ? "bg-rose-600 hover:bg-rose-700"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>Start Timer</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
