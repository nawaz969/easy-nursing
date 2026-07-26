import React, { useState } from "react";
import { ClinicalShift } from "../types";
import { 
  Building2, 
  Clock, 
  User, 
  CheckCircle, 
  Plus, 
  Sparkles, 
  Award, 
  Calendar, 
  Trash2, 
  Briefcase 
} from "lucide-react";

interface ClinicalShiftTrackerProps {
  shifts: ClinicalShift[];
  setShifts: React.Dispatch<React.SetStateAction<ClinicalShift[]>>;
  targetHours?: number;
}

export const ClinicalShiftTracker: React.FC<ClinicalShiftTrackerProps> = ({
  shifts,
  setShifts,
  targetHours = 500
}) => {
  const [showLogModal, setShowLogModal] = useState<boolean>(false);

  // Form state
  const [shiftDate, setShiftDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [shiftHours, setShiftHours] = useState<number>(12);
  const [hospitalUnit, setHospitalUnit] = useState<string>("Medical-Surgical ICU");
  const [preceptor, setPreceptor] = useState<string>("");
  const [reflection, setReflection] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["IV Insertion", "SBAR Handoff"]);

  const totalHoursLogged = shifts.reduce((acc, s) => acc + (s.hours || 0), 0);
  const progressPct = Math.min(100, Math.round((totalHoursLogged / targetHours) * 100));

  const availableSkillTags = [
    "IV Insertion",
    "Foley Catheterization",
    "Tracheostomy Care & Suction",
    "NG Tube Insertion",
    "Medication Administration",
    "Blood Transfusion",
    "Arterial Line Sampling",
    "Wound Care & Dressing",
    "SBAR Handoff",
    "Vital Signs & Physical Assessment"
  ];

  const toggleSkillTag = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalUnit || !preceptor) return;

    const newShift: ClinicalShift = {
      id: `shift-${Date.now()}`,
      date: shiftDate,
      hours: Number(shiftHours),
      hospitalUnit,
      preceptor,
      skillsPracticed: selectedSkills,
      keyReflection: reflection
    };

    setShifts(prev => [newShift, ...prev]);
    setShowLogModal(false);
    setReflection("");
  };

  const deleteShift = (id: string) => {
    setShifts(prev => prev.filter(s => s !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 md:p-6 transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-5 h-5 text-indigo-400" />
            </span>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
              Clinical Shift & Skills Tracker
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Log Rotation Hours • Preceptors • Hospital Units • Clinical Skills
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center space-x-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Clinical Shift</span>
        </button>
      </div>

      {/* Graduation Hours Progress Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white mb-5 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="text-[10px] uppercase font-extrabold tracking-widest text-sky-400 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              BSN Clinical Graduation Progress
            </div>
            <div className="text-2xl font-black text-white flex items-baseline gap-2">
              <span>{totalHoursLogged} Hours Logged</span>
              <span className="text-xs font-semibold text-slate-400">
                / {targetHours} Hours Target
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-white">
              {progressPct}% Completed
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden mt-3 p-0.5 border border-slate-800">
          <div
            className="bg-gradient-to-r from-sky-400 to-teal-400 h-full rounded-full transition-all duration-700 shadow-md shadow-sky-500/50"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Modal to Log Shift */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-5 md:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Log Clinical Shift
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={shiftDate}
                    onChange={e => setShiftDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Shift Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={shiftHours}
                    onChange={e => setShiftHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital Unit / Department
                </label>
                <input
                  type="text"
                  required
                  value={hospitalUnit}
                  onChange={e => setHospitalUnit(e.target.value)}
                  placeholder="e.g. Medical-Surgical ICU, ED, Labor & Delivery"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preceptor Name & Credentials
                </label>
                <input
                  type="text"
                  required
                  value={preceptor}
                  onChange={e => setPreceptor(e.target.value)}
                  placeholder="e.g. Sarah Jenkins, RN, BSN, CCRN"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Skills Practiced (Click to Toggle)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                  {availableSkillTags.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkillTag(skill)}
                        className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all border ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Reflection / High-Yield Takeaway
                </label>
                <textarea
                  rows={3}
                  value={reflection}
                  onChange={e => setReflection(e.target.value)}
                  placeholder="Reflect on key patient cases, emergency interventions, or SBAR handoff experience..."
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Save Clinical Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shifts List Feed */}
      <div className="space-y-3">
        {shifts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No clinical shifts logged yet. Click 'Log Clinical Shift' to record your hours.
          </div>
        ) : (
          shifts.map(shift => (
            <div
              key={shift.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 space-y-2.5 hover:border-slate-300 transition-all shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {shift.hospitalUnit}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {shift.hours} Hours
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {shift.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> Preceptor: {shift.preceptor}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteShift(shift.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Delete Shift Log"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Skills Badges */}
              {shift.skillsPracticed && shift.skillsPracticed.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {shift.skillsPracticed.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-600"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Reflection */}
              {shift.keyReflection && (
                <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  "{shift.keyReflection}"
                </p>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
