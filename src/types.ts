export type SubjectCategory = 
  | "Pharmacology" 
  | "Medical-Surgical" 
  | "Pediatrics" 
  | "Obstetrics & Gynecology" 
  | "Mental Health" 
  | "General NCLEX";

export type TaskPriority = "high" | "medium" | "low";

export interface StudyTask {
  id: string;
  title: string;
  category: SubjectCategory;
  dueDate: string;
  completed: boolean;
  priority: TaskPriority;
  notes: string;
  summarizedNotes?: string[];
  clinicalPearls?: string[];
  linkedPomodoroCount?: number;
}

export interface NclexMcq {
  id: string;
  subject: SubjectCategory;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  rationale: string;
  categoryTag: string;
  clinicalPearl: string;
  bookmarked?: boolean;
  userAnswerIndex?: number | null;
  answeredCorrectly?: boolean | null;
}

export interface ClinicalShift {
  id: string;
  date: string;
  hours: number;
  hospitalUnit: string;
  preceptor: string;
  skillsPracticed: string[];
  keyReflection: string;
}

export interface DrugCardData {
  drugName: string;
  genericName: string;
  brandNames?: string[];
  drugClass: string;
  mechanismOfAction: string;
  indications?: string[];
  keySideEffects: string[];
  blackBoxWarnings?: string[];
  nursingConsiderations: string[];
  antidoteOrLabs?: string;
  highYieldNclexTip?: string;
}

export interface CarePlanData {
  nandaDiagnosis: string;
  pathophysiology: string;
  expectedOutcomes: string[];
  interventions: {
    action: string;
    rationale: string;
    type: "Independent" | "Collaborative" | string;
  }[];
  evaluation: string;
}

export interface LabValue {
  id: string;
  category: "Hematology" | "Electrolytes" | "Renal & Metabolic" | "Coagulation" | "Therapeutic Levels";
  name: string;
  range: string;
  unit: string;
  clinicalSignificance: string;
  highSignificance?: string;
  lowSignificance?: string;
}

export interface AbgResult {
  condition: string;
  compensationStatus: string;
  phStatus: "Acidemic" | "Normal" | "Alkalemic";
  paco2Status: "High" | "Normal" | "Low";
  hco3Status: "High" | "Normal" | "Low";
  rationale: string;
  commonCauses: string[];
  nursingActions: string[];
}
