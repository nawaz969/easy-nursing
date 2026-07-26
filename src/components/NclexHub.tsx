import React, { useState } from "react";
import { NclexMcq, SubjectCategory } from "../types";
import { 
  CheckCircle2, 
  XCircle, 
  Bookmark, 
  BookmarkCheck, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Award, 
  BookOpen, 
  Target,
  Brain,
  AlertCircle
} from "lucide-react";

interface NclexHubProps {
  questions: NclexMcq[];
  setQuestions: React.Dispatch<React.SetStateAction<NclexMcq[]>>;
  questionsAnsweredToday: number;
  setQuestionsAnsweredToday: React.Dispatch<React.SetStateAction<number>>;
  dailyQuestionTarget: number;
  onOpenAiMcqModal: () => void;
}

export const NclexHub: React.FC<NclexHubProps> = ({
  questions,
  setQuestions,
  questionsAnsweredToday,
  setQuestionsAnsweredToday,
  dailyQuestionTarget,
  onOpenAiMcqModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showRationale, setShowRationale] = useState<boolean>(false);

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Bookmarked") return q.bookmarked;
    return q.subject === selectedCategory;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Stats calculation
  const totalAnswered = questions.filter(q => q.userAnswerIndex !== null && q.userAnswerIndex !== undefined).length;
  const totalCorrect = questions.filter(q => q.answeredCorrectly === true).length;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQ || currentQ.userAnswerIndex !== null) return; // Already answered

    const isCorrect = optionIndex === currentQ.correctAnswerIndex;

    setQuestions(prev =>
      prev.map(q =>
        q.id === currentQ.id
          ? {
              ...q,
              userAnswerIndex: optionIndex,
              answeredCorrectly: isCorrect
            }
          : q
      )
    );

    setQuestionsAnsweredToday(prev => prev + 1);
    setShowRationale(true);
  };

  const toggleBookmark = (id: string) => {
    setQuestions(prev =>
      prev.map(q => (q.id === id ? { ...q, bookmarked: !q.bookmarked } : q))
    );
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowRationale(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowRationale(false);
    }
  };

  const categories: string[] = [
    "All",
    "Pharmacology",
    "Medical-Surgical",
    "Pediatrics",
    "Obstetrics & Gynecology",
    "Mental Health",
    "Bookmarked"
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 md:p-6 transition-all duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Brain className="w-5 h-5 text-sky-400" />
            </span>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              NCLEX Prep Hub & MCQs Corner
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Interactive NextGen Question Bank • Immediate Rationales & Clinical Pearls
          </p>
        </div>

        {/* Action Buttons & Target Progress */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <Target className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {questionsAnsweredToday} / {dailyQuestionTarget} Qs
            </span>
            <span className="text-sky-600 dark:text-sky-400 font-bold ml-1">
              ({accuracy}% Accuracy)
            </span>
          </div>

          <button
            onClick={onOpenAiMcqModal}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white shadow-lg shadow-sky-500/20 transition-all flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate AI Questions</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setShowRationale(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/20"
                  : "bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {cat === "Bookmarked" ? "🔖 Bookmarked" : cat}
            </button>
          );
        })}
      </div>

      {/* MCQ Question Area */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No questions found in {selectedCategory}.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Click 'Generate AI Questions' to load custom high-yield NCLEX questions.
          </p>
          <button
            onClick={onOpenAiMcqModal}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
          >
            Generate AI Questions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Question Meta Bar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800">
                {currentQ.subject}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                {currentQ.categoryTag || "NCLEX High-Yield"}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                  currentQ.bookmarked
                    ? "bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                {currentQ.bookmarked ? (
                  <>
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
                    <span>Bookmarked</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Bookmark</span>
                  </>
                )}
              </button>

              <span className="text-slate-400 font-medium">
                {currentIndex + 1} of {filteredQuestions.length}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <p className="text-sm md:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const hasAnswered = currentQ.userAnswerIndex !== null && currentQ.userAnswerIndex !== undefined;
              const isSelected = currentQ.userAnswerIndex === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;

              let btnStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-400 dark:hover:border-teal-600";
              let optionBadgeStyle = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300";

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500";
                  optionBadgeStyle = "bg-emerald-600 text-white";
                } else if (isSelected) {
                  btnStyle = "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-100 font-semibold ring-1 ring-rose-500";
                  optionBadgeStyle = "bg-rose-600 text-white";
                } else {
                  btnStyle = "opacity-60 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400";
                }
              }

              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start space-x-3 ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${optionBadgeStyle}`}>
                    {optionLetter}
                  </span>
                  <span className="text-xs md:text-sm pt-0.5 flex-1">{option}</span>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Rationale & Clinical Pearl Accordion */}
          {currentQ.userAnswerIndex !== null && currentQ.userAnswerIndex !== undefined && (
            <div className="mt-4 p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 space-y-3">
              <div className="flex items-center space-x-2 text-teal-900 dark:text-teal-200 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>NCLEX Rationale & Explanation</span>
              </div>
              <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {currentQ.rationale}
              </p>

              {currentQ.clinicalPearl && (
                <div className="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Clinical Pearl: </span>
                    <span>{currentQ.clinicalPearl}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Question Navigation Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-400 font-semibold">
              Category: <strong className="text-slate-700 dark:text-slate-300">{currentQ.subject}</strong>
            </span>

            <button
              disabled={currentIndex === filteredQuestions.length - 1}
              onClick={handleNext}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white disabled:opacity-40 hover:bg-teal-700 transition-colors flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
