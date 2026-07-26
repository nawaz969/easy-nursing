import React, { useState, useEffect } from "react";
import { NclexMcq, StudyTask, ClinicalShift } from "./types";
import { 
  DEFAULT_NCLEX_QUESTIONS, 
  DEFAULT_STUDY_TASKS, 
  DEFAULT_CLINICAL_SHIFTS 
} from "./data/defaultData";
import { Header } from "./components/Header";
import { NclexHub } from "./components/NclexHub";
import { TaskNotesSection } from "./components/TaskNotesSection";
import { ClinicalShiftTracker } from "./components/ClinicalShiftTracker";
import { DrugCardGenerator } from "./components/DrugCardGenerator";
import { AbgAndLabsModal } from "./components/AbgAndLabsModal";
import { CarePlanModal } from "./components/CarePlanModal";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { AiMcqGeneratorModal } from "./components/AiMcqGeneratorModal";
import { Stethoscope, Sparkles, Brain, Pill, FileText, Activity, Clock, Heart } from "lucide-react";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Core State
  const [questions, setQuestions] = useState<NclexMcq[]>(DEFAULT_NCLEX_QUESTIONS);
  const [questionsAnsweredToday, setQuestionsAnsweredToday] = useState<number>(18);
  const [dailyQuestionTarget] = useState<number>(30);
  const [streakDays] = useState<number>(14);
  const [nclexCountdownDays] = useState<number>(48);

  const [tasks, setTasks] = useState<StudyTask[]>(DEFAULT_STUDY_TASKS);
  const [shifts, setShifts] = useState<ClinicalShift[]>(DEFAULT_CLINICAL_SHIFTS);

  // Modals state
  const [activeModal, setActiveModal] = useState<"none" | "ai-mcq" | "drug-card" | "abg-labs" | "care-plan" | "pomodoro">("none");
  const [linkedPomodoroTaskId, setLinkedPomodoroTaskId] = useState<string | null>(null);

  // Dark Mode Class Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAddAiQuestions = (newQs: NclexMcq[]) => {
    setQuestions(prev => [...newQs, ...prev]);
  };

  const handleIncrementPomodoroForTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, linkedPomodoroCount: (t.linkedPomodoroCount || 0) + 1 }
          : t
      )
    );
  };

  const openPomodoroWithTask = (taskId: string) => {
    setLinkedPomodoroTaskId(taskId);
    setActiveModal("pomodoro");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        questionsAnsweredToday={questionsAnsweredToday}
        dailyQuestionTarget={dailyQuestionTarget}
        streakDays={streakDays}
        nclexCountdownDays={nclexCountdownDays}
        onOpenAiMcqModal={() => setActiveModal("ai-mcq")}
        onOpenCarePlanModal={() => setActiveModal("care-plan")}
        onOpenDrugCardModal={() => setActiveModal("drug-card")}
        onOpenAbgLabsModal={() => setActiveModal("abg-labs")}
        onOpenPomodoroModal={() => {
          setLinkedPomodoroTaskId(null);
          setActiveModal("pomodoro");
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Main Section 1: NCLEX Prep Hub & MCQs Corner */}
        <section id="nclex-hub">
          <NclexHub
            questions={questions}
            setQuestions={setQuestions}
            questionsAnsweredToday={questionsAnsweredToday}
            setQuestionsAnsweredToday={setQuestionsAnsweredToday}
            dailyQuestionTarget={dailyQuestionTarget}
            onOpenAiMcqModal={() => setActiveModal("ai-mcq")}
          />
        </section>

        {/* Main Section 2 & 3: Two Column Layout for Tasks & Clinical Shifts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Subject-Wise Daily Tasks & Study Notes (7 Columns) */}
          <section className="lg:col-span-7">
            <TaskNotesSection
              tasks={tasks}
              setTasks={setTasks}
              onOpenPomodoroModalWithTask={openPomodoroWithTask}
            />
          </section>

          {/* Right Column: Clinical Shift & Skills Tracker (5 Columns) */}
          <section className="lg:col-span-5 space-y-6">
            <ClinicalShiftTracker
              shifts={shifts}
              setShifts={setShifts}
              targetHours={500}
            />

            {/* Quick Tools Callout Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xl space-y-3">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Quick Clinical Tools Suite
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setActiveModal("drug-card")}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 hover:border-sky-500 font-bold flex flex-col items-start gap-1 transition-all text-left group"
                >
                  <Pill className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>Drug Card Generator</span>
                </button>

                <button
                  onClick={() => setActiveModal("abg-labs")}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 hover:border-purple-500 font-bold flex flex-col items-start gap-1 transition-all text-left group"
                >
                  <Activity className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span>ABG & Labs Reference</span>
                </button>

                <button
                  onClick={() => setActiveModal("care-plan")}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 hover:border-teal-500 font-bold flex flex-col items-start gap-1 transition-all text-left group"
                >
                  <FileText className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                  <span>AI Care Plan Builder</span>
                </button>

                <button
                  onClick={() => {
                    setLinkedPomodoroTaskId(null);
                    setActiveModal("pomodoro");
                  }}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 hover:border-rose-500 font-bold flex flex-col items-start gap-1 transition-all text-left group"
                >
                  <Clock className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span>Pomodoro Timer</span>
                </button>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              AI Nursing Student Daily Planner
            </span>
            <span>— Empowering BSN Candidates for NCLEX Success</span>
          </div>
          <div className="text-slate-400 flex items-center gap-1">
            <span>Built with care for Future RNs</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {activeModal === "ai-mcq" && (
        <AiMcqGeneratorModal
          onAddQuestions={handleAddAiQuestions}
          onClose={() => setActiveModal("none")}
        />
      )}

      {activeModal === "drug-card" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full my-auto">
            <DrugCardGenerator onClose={() => setActiveModal("none")} />
          </div>
        </div>
      )}

      {activeModal === "abg-labs" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full my-auto">
            <AbgAndLabsModal onClose={() => setActiveModal("none")} />
          </div>
        </div>
      )}

      {activeModal === "care-plan" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full my-auto">
            <CarePlanModal onClose={() => setActiveModal("none")} />
          </div>
        </div>
      )}

      {activeModal === "pomodoro" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full my-auto">
            <PomodoroTimer
              tasks={tasks}
              linkedTaskId={linkedPomodoroTaskId}
              onClose={() => setActiveModal("none")}
              onIncrementPomodoroCount={handleIncrementPomodoroForTask}
            />
          </div>
        </div>
      )}

    </div>
  );
}
