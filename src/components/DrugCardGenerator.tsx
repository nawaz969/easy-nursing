import React, { useState } from "react";
import { DrugCardData } from "../types";
import { PRESET_DRUG_CARDS } from "../data/defaultData";
import { 
  Pill, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Loader2, 
  BookOpen, 
  HelpCircle 
} from "lucide-react";

interface DrugCardGeneratorProps {
  onClose?: () => void;
}

export const DrugCardGenerator: React.FC<DrugCardGeneratorProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentCard, setCurrentCard] = useState<DrugCardData | null>(PRESET_DRUG_CARDS[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateDrugCard = async (drugNameToSearch?: string) => {
    const term = drugNameToSearch || searchQuery;
    if (!term.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    // Check if it's in presets first
    const preset = PRESET_DRUG_CARDS.find(p => p.drugName.toLowerCase() === term.trim().toLowerCase());
    if (preset) {
      setCurrentCard(preset);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/ai/drug-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drugName: term.trim() })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        const message = data?.error || "Failed to generate AI Drug Card";
        throw new Error(message);
      }

      if (data.card) {
        setCurrentCard(data.card);
      } else {
        setErrorMsg("Could not retrieve details for this drug.");
      }
    } catch (err: any) {
      console.error("Drug Card AI Error:", err);
      setErrorMsg(err.message || "Failed to connect to AI generator. Try another drug name.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl p-5 md:p-6 space-y-5 max-w-4xl mx-auto">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 rounded-xl">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Pharmacology Drug Card Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI-Powered NCLEX Drug Study Cards: MoA, Side Effects, Black Box Warnings & Nursing Assessments
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Input & AI Action */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerateDrugCard()}
            placeholder="Type any medication name (e.g. Vancomycin, Haloperidol, Warfarin, Insulin)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <button
          disabled={loading || !searchQuery.trim()}
          onClick={() => handleGenerateDrugCard()}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50 transition-all flex items-center justify-center space-x-2 shadow-xs shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Card...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Card</span>
            </>
          )}
        </button>
      </div>

      {/* High-Yield Drug Card Presets */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
          High-Yield Presets:
        </span>
        {["Furosemide", "Digoxin", "Metoprolol", "Vancomycin", "Warfarin", "Morphine", "Insulin Regular"].map(drug => (
          <button
            key={drug}
            onClick={() => {
              setSearchQuery(drug);
              handleGenerateDrugCard(drug);
            }}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-slate-700 transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
          >
            {drug}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Drug Card Output Display */}
      {currentCard && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-cyan-50/20 to-slate-50 dark:from-slate-800/80 dark:via-slate-800 dark:to-slate-900 border-2 border-cyan-200 dark:border-cyan-800/60 shadow-sm space-y-4">
          
          {/* Card Top Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-700/80 pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentCard.drugName}
                </h3>
                {currentCard.genericName && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                    ({currentCard.genericName})
                  </span>
                )}
              </div>
              {currentCard.brandNames && currentCard.brandNames.length > 0 && (
                <div className="text-xs text-cyan-800 dark:text-cyan-300 font-medium">
                  Brand Names: {currentCard.brandNames.join(", ")}
                </div>
              )}
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700 self-start sm:self-auto">
              Class: {currentCard.drugClass}
            </span>
          </div>

          {/* Mechanism of Action */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Mechanism of Action (MoA)
            </h4>
            <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              {currentCard.mechanismOfAction}
            </p>
          </div>

          {/* Black Box Warnings if present */}
          {currentCard.blackBoxWarnings && currentCard.blackBoxWarnings.length > 0 && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-800 rounded-xl space-y-1">
              <div className="flex items-center space-x-1.5 text-rose-900 dark:text-rose-200 font-extrabold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>BLACK BOX WARNING</span>
              </div>
              <ul className="list-disc list-inside text-xs text-rose-950 dark:text-rose-100 space-y-0.5">
                {currentCard.blackBoxWarnings.map((warn, wIdx) => (
                  <li key={wIdx}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Side Effects & Indications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Key Side Effects */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Key Side Effects & Adverse Reactions:
              </h4>
              <ul className="list-disc list-inside text-xs text-slate-800 dark:text-slate-200 space-y-1">
                {currentCard.keySideEffects?.map((se, idx) => (
                  <li key={idx}>{se}</li>
                ))}
              </ul>
            </div>

            {/* Antidote & Labs */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> Antidote / Lab Monitoring:
              </h4>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                {currentCard.antidoteOrLabs || "Monitor vital signs and patient response."}
              </p>
            </div>

          </div>

          {/* Nursing Considerations & Assessments */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Essential Nursing Considerations & Priority Assessments:
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-800 dark:text-slate-200 space-y-1.5 leading-relaxed">
              {currentCard.nursingConsiderations?.map((nc, idx) => (
                <li key={idx}>{nc}</li>
              ))}
            </ul>
          </div>

          {/* NCLEX High-Yield Tip */}
          {currentCard.highYieldNclexTip && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-200 font-medium flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold uppercase">High-Yield NCLEX Tip: </strong>
                <span>{currentCard.highYieldNclexTip}</span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
