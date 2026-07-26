import React, { useState } from "react";
import { DEFAULT_LAB_VALUES } from "../data/defaultData";
import { AbgResult, LabValue } from "../types";
import { 
  Activity, 
  Search, 
  Sparkles, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  HelpCircle, 
  FlaskConical 
} from "lucide-react";

interface AbgAndLabsModalProps {
  onClose?: () => void;
}

export const AbgAndLabsModal: React.FC<AbgAndLabsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"abg" | "labs">("abg");

  // ABG Interpreter Inputs
  const [ph, setPh] = useState<number>(7.28);
  const [paco2, setPaco2] = useState<number>(52);
  const [hco3, setHco3] = useState<number>(26);

  // Lab Search State
  const [labSearch, setLabSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // ABG Interpretation Logic (ROME: Respiratory Opposite, Metabolic Equal)
  const interpretAbg = (phVal: number, paco2Val: number, hco3Val: number): AbgResult => {
    // Normal Ranges: pH 7.35-7.45 | PaCO2 35-45 | HCO3 22-26
    let phStatus: "Acidemic" | "Normal" | "Alkalemic" = "Normal";
    if (phVal < 7.35) phStatus = "Acidemic";
    else if (phVal > 7.45) phStatus = "Alkalemic";

    let paco2Status: "High" | "Normal" | "Low" = "Normal";
    if (paco2Val > 45) paco2Status = "High"; // Respiratory Acidosis indicator
    else if (paco2Val < 35) paco2Status = "Low"; // Respiratory Alkalosis indicator

    let hco3Status: "High" | "Normal" | "Low" = "Normal";
    if (hco3Val > 26) hco3Status = "High"; // Metabolic Alkalosis indicator
    else if (hco3Val < 22) hco3Status = "Low"; // Metabolic Acidosis indicator

    // Normal ABG
    if (phStatus === "Normal" && paco2Status === "Normal" && hco3Status === "Normal") {
      return {
        condition: "Normal ABG Values",
        compensationStatus: "Normal Range",
        phStatus,
        paco2Status,
        hco3Status,
        rationale: "All values (pH, PaCO2, HCO3-) are within normal reference ranges.",
        commonCauses: ["Normal physiology", "Effective mechanical ventilation"],
        nursingActions: ["Continue routine oxygenation and respiratory monitoring."]
      };
    }

    // Determine primary disorder and compensation
    let condition = "Mixed Acid-Base Disorder";
    let compensationStatus = "Uncompensated";
    let rationale = "";
    let commonCauses: string[] = [];
    let nursingActions: string[] = [];

    // Uncompensated or Compensated Respiratory Acidosis
    if ((phStatus === "Acidemic" || phVal <= 7.40) && paco2Status === "High") {
      if (hco3Status === "Normal") {
        condition = "Uncompensated Respiratory Acidosis";
        compensationStatus = "Uncompensated";
        rationale = "pH is low (< 7.35) and PaCO2 is high (> 45 mmHg), while HCO3 is normal. The kidneys have not yet compensated.";
      } else if (hco3Status === "High") {
        if (phStatus === "Acidemic") {
          condition = "Partially Compensated Respiratory Acidosis";
          compensationStatus = "Partially Compensated";
          rationale = "pH remains low (< 7.35), PaCO2 is high (> 45), and HCO3 is elevated (> 26) as kidneys attempt renal retention of bicarbonate.";
        } else {
          condition = "Fully Compensated Respiratory Acidosis";
          compensationStatus = "Fully Compensated";
          rationale = "pH has returned to normal range (7.35-7.40), PaCO2 is high, and HCO3 is elevated.";
        }
      }
      commonCauses = ["COPD / Emphysema", "Opioid or Sedative Overdose", "Severe Asthma Attack", "Atelectasis", "Hypoventilation"];
      nursingActions = [
        "Assess airway patency and respiratory rate.",
        "Administer oxygen with caution (COPD patients may lose hypoxic drive).",
        "Prepare Naloxone (Narcan) if drug-induced hypoventilation is suspected.",
        "Encourage deep breathing, coughing, and incentive spirometry."
      ];
    }

    // Uncompensated or Compensated Metabolic Acidosis
    else if ((phStatus === "Acidemic" || phVal < 7.40) && hco3Status === "Low") {
      if (paco2Status === "Normal") {
        condition = "Uncompensated Metabolic Acidosis";
        compensationStatus = "Uncompensated";
        rationale = "pH is low (< 7.35) and HCO3 is low (< 22 mEq/L), while PaCO2 is normal.";
      } else if (paco2Status === "Low") {
        if (phStatus === "Acidemic") {
          condition = "Partially Compensated Metabolic Acidosis";
          compensationStatus = "Partially Compensated";
          rationale = "pH is low, HCO3 is low, and PaCO2 is low as lungs hyperventilate (Kussmaul respirations) to blow off CO2.";
        } else {
          condition = "Fully Compensated Metabolic Acidosis";
          compensationStatus = "Fully Compensated";
          rationale = "pH is normal (7.35-7.40), HCO3 is low, and PaCO2 is low due to respiratory compensation.";
        }
      }
      commonCauses = ["Diabetic Ketoacidosis (DKA)", "Severe Diarrhea (losing base)", "Renal Failure / Uremia", "Lactic Acidosis / Shock", "Starvation"];
      nursingActions = [
        "Monitor for Kussmaul respirations (rapid, deep breathing).",
        "Check blood glucose and ketone levels (DKA protocol with regular insulin).",
        "Monitor potassium levels—acidosis shifts K+ out of cells causing hyperkalemia.",
        "Administer IV fluids and IV Sodium Bicarbonate if ordered."
      ];
    }

    // Uncompensated or Compensated Respiratory Alkalosis
    else if ((phStatus === "Alkalemic" || phVal > 7.40) && paco2Status === "Low") {
      if (hco3Status === "Normal") {
        condition = "Uncompensated Respiratory Alkalosis";
        compensationStatus = "Uncompensated";
        rationale = "pH is elevated (> 7.45) and PaCO2 is low (< 35 mmHg), while HCO3 is normal.";
      } else if (hco3Status === "Low") {
        if (phStatus === "Alkalemic") {
          condition = "Partially Compensated Respiratory Alkalosis";
          compensationStatus = "Partially Compensated";
          rationale = "pH is high, PaCO2 is low, and HCO3 is low as kidneys excrete bicarbonate.";
        } else {
          condition = "Fully Compensated Respiratory Alkalosis";
          compensationStatus = "Fully Compensated";
          rationale = "pH is normal (7.40-7.45), PaCO2 is low, and HCO3 is low.";
        }
      }
      commonCauses = ["Hyperventilation due to Anxiety or Panic", "High Altitude", "Early Salicylate Overdose", "Pulmonary Embolism", "Mechanical Over-ventilation"];
      nursingActions = [
        "Encourage patient to slow breathing rate (rebreathing into paper bag or rebreather mask).",
        "Provide reassurance and anxiety-reducing measures.",
        "Monitor for hypocalcemia and hypokalemia signs (paresthesias, tetany)."
      ];
    }

    // Uncompensated or Compensated Metabolic Alkalosis
    else if ((phStatus === "Alkalemic" || phVal > 7.40) && hco3Status === "High") {
      if (paco2Status === "Normal") {
        condition = "Uncompensated Metabolic Alkalosis";
        compensationStatus = "Uncompensated";
        rationale = "pH is high (> 7.45) and HCO3 is high (> 26 mEq/L), while PaCO2 is normal.";
      } else if (paco2Status === "High") {
        if (phStatus === "Alkalemic") {
          condition = "Partially Compensated Metabolic Alkalosis";
          compensationStatus = "Partially Compensated";
          rationale = "pH is high, HCO3 is high, and PaCO2 is elevated as lungs hypoventilate to retain CO2.";
        } else {
          condition = "Fully Compensated Metabolic Alkalosis";
          compensationStatus = "Fully Compensated";
          rationale = "pH is normal (7.40-7.45), HCO3 is high, and PaCO2 is elevated.";
        }
      }
      commonCauses = ["Severe Vomiting or Prolonged NG Suction (losing gastric acid)", "Excessive Antacid Ingestion", "Loop Diuretic Overuse (hypokalemia)", "Cushing's Syndrome"];
      nursingActions = [
        "Stop NG tube suction if appropriate.",
        "Monitor potassium and chloride levels closely.",
        "Administer IV isotonic fluids (0.9% Normal Saline) to promote renal excretion of bicarbonate."
      ];
    }

    return {
      condition,
      compensationStatus,
      phStatus,
      paco2Status,
      hco3Status,
      rationale,
      commonCauses,
      nursingActions
    };
  };

  const abgResult = interpretAbg(ph, paco2, hco3);

  // Lab Values Filter
  const filteredLabs = DEFAULT_LAB_VALUES.filter(lab => {
    const matchesSearch = lab.name.toLowerCase().includes(labSearch.toLowerCase()) || lab.category.toLowerCase().includes(labSearch.toLowerCase());
    const matchesCat = selectedCategory === "All" || lab.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xl p-5 md:p-6 space-y-5 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              ABG Interpreter & Lab Values Reference
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive ROME ABG acid-base calculator & high-yield NCLEX normal lab reference
            </p>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            ✕
          </button>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("abg")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "abg"
              ? "border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/30"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Interactive ABG Interpreter</span>
        </button>

        <button
          onClick={() => setActiveTab("labs")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === "labs"
              ? "border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/30"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Normal Lab Values Reference</span>
        </button>
      </div>

      {/* ABG Tab Content */}
      {activeTab === "abg" && (
        <div className="space-y-5">
          
          {/* Controls Sliders / Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            
            {/* pH Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">pH Level:</span>
                <span className={`px-2 py-0.5 rounded text-white font-mono ${
                  ph < 7.35 ? "bg-rose-600" : ph > 7.45 ? "bg-amber-600" : "bg-emerald-600"
                }`}>
                  {ph.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={7.00}
                max={7.80}
                step={0.01}
                value={ph}
                onChange={e => setPh(parseFloat(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Acidemia (&lt;7.35)</span>
                <span>Normal (7.35-7.45)</span>
                <span>Alkalemia (&gt;7.45)</span>
              </div>
            </div>

            {/* PaCO2 Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">PaCO2 (mmHg):</span>
                <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-mono">
                  {paco2}
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={70}
                step={1}
                value={paco2}
                onChange={e => setPaco2(parseInt(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Alkalosis (&lt;35)</span>
                <span>Normal (35-45)</span>
                <span>Acidosis (&gt;45)</span>
              </div>
            </div>

            {/* HCO3 Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">HCO3- (mEq/L):</span>
                <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-mono">
                  {hco3}
                </span>
              </div>
              <input
                type="range"
                min={12}
                max={40}
                step={1}
                value={hco3}
                onChange={e => setHco3(parseInt(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Acidosis (&lt;22)</span>
                <span>Normal (22-26)</span>
                <span>Alkalosis (&gt;26)</span>
              </div>
            </div>

          </div>

          {/* Quick Preset Scenarios */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Quick Case Presets:
            </span>
            <button
              onClick={() => { setPh(7.28); setPaco2(55); setHco3(25); }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-100 dark:hover:bg-purple-950 shrink-0"
            >
              COPD / Hypoventilation
            </button>
            <button
              onClick={() => { setPh(7.24); setPaco2(32); setHco3(14); }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-100 dark:hover:bg-purple-950 shrink-0"
            >
              Diabetic Ketoacidosis (DKA)
            </button>
            <button
              onClick={() => { setPh(7.52); setPaco2(28); setHco3(23); }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-100 dark:hover:bg-purple-950 shrink-0"
            >
              Panic Hyperventilation
            </button>
            <button
              onClick={() => { setPh(7.50); setPaco2(42); setHco3(33); }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-100 dark:hover:bg-purple-950 shrink-0"
            >
              Severe Vomiting / NG Suction
            </button>
          </div>

          {/* ABG Output Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 dark:from-purple-950/40 dark:via-slate-900 dark:to-purple-950/20 border-2 border-purple-200 dark:border-purple-800 space-y-4 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900 gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Acid-Base Condition Result
                </span>
                <h3 className="text-xl font-black text-purple-950 dark:text-purple-100">
                  {abgResult.condition}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-600 text-white self-start sm:self-auto">
                {abgResult.compensationStatus}
              </span>
            </div>

            {/* Step-by-Step Rationale */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-purple-100 dark:border-purple-900">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                ROME Method Explanation (Respiratory Opposite / Metabolic Equal):
              </h4>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                {abgResult.rationale}
              </p>
            </div>

            {/* Causes & Interventions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Common Clinical Causes:
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-800 dark:text-slate-200 space-y-1">
                  {abgResult.commonCauses.map((cause, cIdx) => (
                    <li key={cIdx}>{cause}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Priority Nursing Actions:
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-800 dark:text-slate-200 space-y-1">
                  {abgResult.nursingActions.map((act, aIdx) => (
                    <li key={aIdx}>{act}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Labs Tab Content */}
      {activeTab === "labs" && (
        <div className="space-y-4">
          
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={labSearch}
                onChange={e => setLabSearch(e.target.value)}
                placeholder="Search lab (e.g. Potassium, Creatinine, INR, Lithium)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              <option value="All">All Lab Categories</option>
              <option value="Electrolytes">Electrolytes</option>
              <option value="Hematology">Hematology</option>
              <option value="Renal & Metabolic">Renal & Metabolic</option>
              <option value="Coagulation">Coagulation</option>
              <option value="Therapeutic Levels">Therapeutic Levels</option>
            </select>
          </div>

          {/* Labs Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredLabs.map(lab => (
              <div
                key={lab.id}
                className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-purple-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {lab.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {lab.range} {lab.unit}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {lab.clinicalSignificance}
                </p>

                {lab.highSignificance && (
                  <div className="text-[11px] text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 p-2 rounded-lg border border-rose-200 dark:border-rose-900">
                    <strong>HIGH: </strong>{lab.highSignificance}
                  </div>
                )}
                {lab.lowSignificance && (
                  <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 p-2 rounded-lg border border-amber-200 dark:border-amber-900">
                    <strong>LOW: </strong>{lab.lowSignificance}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
