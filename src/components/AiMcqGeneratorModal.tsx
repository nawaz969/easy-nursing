import React, { useState } from "react";
import { NclexMcq, SubjectCategory } from "../types";
import { Brain, Sparkles, Loader2 } from "lucide-react";

interface AiMcqGeneratorModalProps {
  onAddQuestions: (newQuestions: NclexMcq[]) => void;
  onClose: () => void;
}

export const AiMcqGeneratorModal: React.FC<AiMcqGeneratorModalProps> = ({
  onAddQuestions,
  onClose
}) => {
  const [subject, setSubject] = useState<SubjectCategory>("Pharmacology");
  const [count, setCount] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<string>("NCLEX-RN Standard Priority");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/nclex-mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, count, difficulty })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        const message = data?.error || "Failed to generate questions. Please check network connection.";
        throw new Error(message);
      }

      if (data.questions && data.questions.length > 0) {
        onAddQuestions(data.questions);
        onClose();
      } else {
        setError("No questions generated. Try again.");
      }
    } catch (err: any) {
      console.error("AI MCQ Generation Error:", err);
      setError(err.message || "Failed to generate AI questions. Check network or retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-5 md:p-6 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-xl">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Generate AI NCLEX MCQs
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            ✕
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Nursing Subject
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value as SubjectCategory)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="Pharmacology">Pharmacology</option>
              <option value="Medical-Surgical">Medical-Surgical Nursing</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
              <option value="Mental Health">Mental Health</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Difficulty / Focus Style
            </label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="NCLEX-RN Standard Priority">NCLEX-RN Standard Priority Care</option>
              <option value="NextGen NCLEX Clinical Judgment">NextGen NCLEX Clinical Judgment</option>
              <option value="High-Yield Patient Safety & Infection Control">High-Yield Patient Safety & Infection Control</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Number of Questions to Generate
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 5].map(num => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setCount(num)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    count === num
                      ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {num} {num === 1 ? "Question" : "Questions"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs flex items-center space-x-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Questions</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
