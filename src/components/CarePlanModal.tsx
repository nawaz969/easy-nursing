import React, { useState } from "react";
import { CarePlanData } from "../types";
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Loader2, 
  BookOpen, 
  Target, 
  Layers 
} from "lucide-react";

interface CarePlanModalProps {
  onClose?: () => void;
}

export const CarePlanModal: React.FC<CarePlanModalProps> = ({ onClose }) => {
  const [topic, setTopic] = useState<string>("Impaired Gas Exchange secondary to COPD");
  const [loading, setLoading] = useState<boolean>(false);
  const [carePlan, setCarePlan] = useState<CarePlanData | null>({
    nandaDiagnosis: "Impaired Gas Exchange related to alveolar-capillary membrane changes secondary to COPD as evidenced by dyspnea, SpO2 87% on room air, and PaCO2 52 mmHg.",
    pathophysiology: "Chronic inflammation and destruction of alveolar walls leads to loss of lung elasticity, airway collapse during expiration, and gas trapping. Impaired oxygen diffusion across damaged alveolar membranes causes arterial hypoxemia and hypercapnia.",
    expectedOutcomes: [
      "Client will maintain SpO2 >= 90% on 2L NC within 2 hours of oxygen initiation.",
      "Client will demonstrate purse-lipped breathing technique to decrease dyspnea by end of shift."
    ],
    interventions: [
      {
        action: "Position client in high-Fowler's position or tripod position.",
        rationale: "Elevating the head of bed promotes maximum chest expansion and diaphragm descent.",
        type: "Independent"
      },
      {
        action: "Administer low-flow supplemental oxygen (1-2 L/min via nasal cannula) as prescribed.",
        rationale: "COPD patients rely on hypoxic drive for respiration. Excessive oxygen can abolish the hypoxic drive, leading to acute respiratory depression.",
        type: "Collaborative"
      },
      {
        action: "Teach and assist client with pursed-lip breathing exercises.",
        rationale: "Pursed-lip breathing creates positive end-expiratory pressure (PEEP), preventing micro-airway collapse and improving exhalation of trapped CO2.",
        type: "Independent"
      },
      {
        action: "Administer prescribed inhaled bronchodilators (e.g. Albuterol / Ipratropium nebulizer).",
        rationale: "Beta-2 agonists relax bronchial smooth muscle to dilate airways and reduce airway resistance.",
        type: "Collaborative"
      }
    ],
    evaluation: "Client SpO2 increased to 92% on 2L nasal cannula. Client demonstrated purse-lipped breathing effectively, reporting reduced shortness of breath."
  });

  const handleGenerateCarePlan = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/ai/care-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicOrDiagnosis: topic.trim() })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        throw new Error(data?.error || "Failed to generate Care Plan");
      }

      if (data.carePlan) {
        setCarePlan(data.carePlan);
      }
    } catch (err) {
      console.error("Care Plan AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl p-5 md:p-6 space-y-5 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              AI NANDA Nursing Care Plan Builder
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Input diagnosis or patient case &rarr; AI breaks down NANDA Diagnosis, Pathophysiology, SMART Goals &amp; Interventions
            </p>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            ✕
          </button>
        )}
      </div>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleGenerateCarePlan()}
          placeholder="e.g. Decreased Cardiac Output secondary to Acute Heart Failure..."
          className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          disabled={loading || !topic.trim()}
          onClick={handleGenerateCarePlan}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-all flex items-center justify-center space-x-2 shadow-xs shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Building Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Build Care Plan with AI</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Topics */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Presets:
        </span>
        {[
          "COPD Gas Exchange",
          "Heart Failure Cardiac Output",
          "DKA Fluid Volume Deficit",
          "Sepsis Infection Risk",
          "Post-Op Pain Management"
        ].map(p => (
          <button
            key={p}
            onClick={() => {
              setTopic(p);
            }}
            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100 dark:hover:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-700"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Care Plan Output Display */}
      {carePlan && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-800 shadow-sm space-y-4">
          
          {/* Diagnosis Header */}
          <div className="p-3.5 rounded-xl bg-indigo-600 text-white space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200">
              NANDA Nursing Diagnosis
            </span>
            <p className="text-xs md:text-sm font-bold leading-relaxed">
              {carePlan.nandaDiagnosis}
            </p>
          </div>

          {/* Pathophysiology */}
          <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Pathophysiology Brief:
            </h4>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {carePlan.pathophysiology}
            </p>
          </div>

          {/* Expected Outcomes (SMART Goals) */}
          <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> SMART Expected Patient Outcomes:
            </h4>
            <ul className="list-disc list-inside text-xs text-slate-800 dark:text-slate-200 space-y-1">
              {carePlan.expectedOutcomes?.map((goal, gIdx) => (
                <li key={gIdx}>{goal}</li>
              ))}
            </ul>
          </div>

          {/* Interventions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" /> Nursing Interventions & Rationales:
            </h4>

            <div className="space-y-2">
              {carePlan.interventions?.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Action: {item.action}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      item.type === "Independent" 
                        ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                        : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                    <strong>NCLEX Rationale: </strong>{item.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation */}
          {carePlan.evaluation && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-100 space-y-1">
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-emerald-700 dark:text-emerald-400">
                Evaluation Criteria:
              </span>
              <p>{carePlan.evaluation}</p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
