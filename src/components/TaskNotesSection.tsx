import React, { useState } from "react";
import { StudyTask, SubjectCategory, TaskPriority } from "../types";
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Pill, 
  Stethoscope, 
  Baby, 
  HeartHandshake, 
  Brain, 
  Trash2, 
  Edit3, 
  BookMarked, 
  Clock, 
  Lightbulb, 
  Loader2 
} from "lucide-react";

interface TaskNotesSectionProps {
  tasks: StudyTask[];
  setTasks: React.Dispatch<React.SetStateAction<StudyTask[]>>;
  onOpenPomodoroModalWithTask?: (taskId: string) => void;
}

export const TaskNotesSection: React.FC<TaskNotesSectionProps> = ({
  tasks,
  setTasks,
  onOpenPomodoroModalWithTask
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>("task-1");
  const [summarizingId, setSummarizingId] = useState<string | null>(null);

  // New task form state
  const [showNewTaskForm, setShowNewTaskForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<SubjectCategory>("Pharmacology");
  const [newDueDate, setNewDueDate] = useState<string>("Today");
  const [newPriority, setNewPriority] = useState<TaskPriority>("high");
  const [newNotes, setNewNotes] = useState<string>("");

  const subjects: { name: string; icon: React.ReactNode; color: string }[] = [
    { name: "All", icon: null, color: "bg-slate-500" },
    { name: "Pharmacology", icon: <Pill className="w-3.5 h-3.5" />, color: "bg-teal-500" },
    { name: "Medical-Surgical", icon: <Stethoscope className="w-3.5 h-3.5" />, color: "bg-blue-500" },
    { name: "Pediatrics", icon: <Baby className="w-3.5 h-3.5" />, color: "bg-purple-500" },
    { name: "Obstetrics & Gynecology", icon: <HeartHandshake className="w-3.5 h-3.5" />, color: "bg-rose-500" },
    { name: "Mental Health", icon: <Brain className="w-3.5 h-3.5" />, color: "bg-amber-500" }
  ];

  const filteredTasks = tasks.filter(t => {
    if (selectedSubject === "All") return true;
    return t.category === selectedSubject;
  });

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateNotes = (id: string, updatedNotes: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, notes: updatedNotes } : t))
    );
  };

  const handleSummarizeWithAi = async (task: StudyTask) => {
    if (!task.notes || task.notes.trim().length === 0) return;

    setSummarizingId(task.id);
    try {
      const response = await fetch("/api/ai/summarize-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: task.notes })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        throw new Error(data?.error || "Failed to summarize notes");
      }

      const summaryBullets = data.summary?.summaryBullets || [];
      const pearls = data.summary?.clinicalPearls || [];

      setTasks(prev =>
        prev.map(t =>
          t.id === task.id
            ? {
                ...t,
                summarizedNotes: summaryBullets,
                clinicalPearls: pearls
              }
            : t
        )
      );
    } catch (err) {
      console.error("Summarization error:", err);
    } finally {
      setSummarizingId(null);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      dueDate: newDueDate,
      completed: false,
      priority: newPriority,
      notes: newNotes,
      summarizedNotes: [],
      clinicalPearls: []
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTitle("");
    setNewNotes("");
    setShowNewTaskForm(false);
    setExpandedTaskId(newTask.id);
  };

  const getSubjectBadge = (cat: SubjectCategory) => {
    switch (cat) {
      case "Pharmacology":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300 border-teal-200 dark:border-teal-800";
      case "Medical-Surgical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Pediatrics":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Obstetrics & Gynecology":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "Mental Health":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 md:p-6 transition-all">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <BookMarked className="w-5 h-5 text-sky-400" />
            </span>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              Subject-Wise Daily Tasks & Study Notes
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Organize study goals by BSN subject with expandable notes & AI 1-click summarizer
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskForm(!showNewTaskForm)}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white shadow-lg shadow-sky-500/20 transition-all flex items-center space-x-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* New Task Form */}
      {showNewTaskForm && (
        <form onSubmit={handleCreateTask} className="mb-6 p-4 rounded-xl border-2 border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
            Create New Study Goal / NCLEX Task
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Study Cardiac Glycosides & Digoxin Toxicity"
                className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject Category
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as SubjectCategory)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Pharmacology">Pharmacology</option>
                <option value="Medical-Surgical">Medical-Surgical</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                <option value="Mental Health">Mental Health</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date / Target
              </label>
              <input
                type="text"
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                placeholder="Today, Tomorrow, or Date"
                className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Key Formulas / Clinical Notes
            </label>
            <textarea
              rows={3}
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="Store dosage formulas, high-yield labs, or pre-lecture notes here..."
              className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowNewTaskForm(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Subject Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {subjects.map(subj => {
          const isActive = selectedSubject === subj.name;
          return (
            <button
              key={subj.name}
              onClick={() => setSelectedSubject(subj.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center space-x-1.5 ${
                isActive
                  ? "bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/20"
                  : "bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {subj.icon}
              <span>{subj.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No study tasks found for {selectedSubject}.
          </div>
        ) : (
          filteredTasks.map(task => {
            const isExpanded = expandedTaskId === task.id;
            const isSummarizing = summarizingId === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-xl border transition-all duration-200 ${
                  task.completed
                    ? "bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75"
                    : "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Task Header */}
                <div className="p-3.5 flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-teal-600 transition-colors shrink-0"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getSubjectBadge(task.category)}`}>
                          {task.category}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.dueDate}
                        </span>
                        {task.priority === "high" && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                            High Priority
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-semibold leading-snug cursor-pointer ${
                          task.completed
                            ? "line-through text-slate-400 dark:text-slate-500"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      >
                        {task.title}
                      </h4>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    {onOpenPomodoroModalWithTask && (
                      <button
                        onClick={() => onOpenPomodoroModalWithTask(task.id)}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs flex items-center gap-1"
                        title="Start Pomodoro Study Session"
                      >
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        <span className="hidden sm:inline font-bold text-[10px] text-slate-600 dark:text-slate-300">
                          {task.linkedPomodoroCount || 0} poms
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title={isExpanded ? "Collapse Notes" : "Expand Notes"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Notes Section */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-b-xl">
                    
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                        Task Study Notes & Formulas:
                      </label>

                      {/* 1-Click AI Summarizer Button */}
                      <button
                        disabled={isSummarizing || !task.notes}
                        onClick={() => handleSummarizeWithAi(task)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition-all flex items-center space-x-1 shadow-2xs"
                      >
                        {isSummarizing ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Summarizing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>Summarize Notes with AI</span>
                          </>
                        )}
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={task.notes}
                      onChange={e => handleUpdateNotes(task.id, e.target.value)}
                      placeholder="Type study notes, nursing considerations, or formulas here..."
                      className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"
                    />

                    {/* AI Summarized Bullets */}
                    {task.summarizedNotes && task.summarizedNotes.length > 0 && (
                      <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 space-y-2">
                        <div className="flex items-center space-x-1.5 text-teal-900 dark:text-teal-200 font-bold text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span>AI High-Yield Bulleted Summary:</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-slate-800 dark:text-slate-200 space-y-1 pl-1">
                          {task.summarizedNotes.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Clinical Pearls */}
                    {task.clinicalPearls && task.clinicalPearls.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Clinical Pearl: </span>
                          <span>{task.clinicalPearls.join(" | ")}</span>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
