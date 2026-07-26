import { NclexMcq, StudyTask, ClinicalShift, DrugCardData, LabValue } from "../types";

export const DEFAULT_NCLEX_QUESTIONS: NclexMcq[] = [
  {
    id: "q-1",
    subject: "Pharmacology",
    question: "A nurse is preparing to administer Digoxin 0.25 mg IV push to a client with heart failure. Prior to administration, which assessment action is the nurse's priority?",
    options: [
      "Check the client's blood pressure in both arms.",
      "Assess the apical pulse for 1 full minute.",
      "Review the client's serum creatinine level from yesterday.",
      "Check the radial pulse for 30 seconds and multiply by 2."
    ],
    correctAnswerIndex: 1,
    rationale: "Correct Answer: B. Digoxin is an inotropic cardiac glycoside that slows heart rate. The apical pulse MUST be measured for a full 60 seconds at the 5th intercostal space, midclavicular line. Digoxin should be held if the apical pulse is < 60 bpm in an adult (or < 90 bpm in infants). Radial pulse check is insufficient.",
    categoryTag: "Priority Nursing Assessment",
    clinicalPearl: "Always monitor Potassium levels! Hypokalemia increases Digoxin toxicity risk (visual halos, nausea, bradycardia).",
    bookmarked: true,
    userAnswerIndex: null,
    answeredCorrectly: null
  },
  {
    id: "q-2",
    subject: "Medical-Surgical",
    question: "A client who underwent a thyroidectomy 12 hours ago reports numbness and tingling around the mouth and fingers. The nurse observes positive Chvostek's sign. Which medication does the nurse prepare to administer?",
    options: [
      "Sodium Bicarbonate IV",
      "Calcium Gluconate IV",
      "Potassium Chloride IV",
      "Magnesium Sulfate IV"
    ],
    correctAnswerIndex: 1,
    rationale: "Correct Answer: B. Accidental removal or trauma to the parathyroid glands during thyroidectomy causes acute hypocalcemia. Symptoms include perioral paresthesia, Trousseau's sign (carpopedal spasm), and Chvostek's sign (facial twitching). Emergency treatment is IV Calcium Gluconate.",
    categoryTag: "Post-Op Complications",
    clinicalPearl: "Keep IV Calcium Gluconate and a tracheostomy set at the bedside post-thyroidectomy!",
    bookmarked: false,
    userAnswerIndex: null,
    answeredCorrectly: null
  },
  {
    id: "q-3",
    subject: "Pediatrics",
    question: "An infant with Tetralogy of Fallot becomes acutely cyanotic, hyperpneic, and agitated during a painful procedure ('hypercyanotic' or 'Tet' spell). What is the nurse's IMMEDIATE priority intervention?",
    options: [
      "Administer a dose of IV furosemide.",
      "Place the infant in the knee-chest position.",
      "Prepare for immediate endotracheal intubation.",
      "Start a rapid bolus of 0.9% Normal Saline."
    ],
    correctAnswerIndex: 1,
    rationale: "Correct Answer: B. Placing the infant in the knee-chest position increases systemic vascular resistance (SVR), which decreases the right-to-left shunt across the VSD, promoting pulmonary venous blood flow and improving oxygenation immediately.",
    categoryTag: "Congenital Heart Defects",
    clinicalPearl: "Knee-chest position increases SVR and forces blood into the lungs during a Tet spell.",
    bookmarked: true,
    userAnswerIndex: null,
    answeredCorrectly: null
  },
  {
    id: "q-4",
    subject: "Obstetrics & Gynecology",
    question: "A client at 34 weeks gestation presents with dark vaginal bleeding, severe abdominal pain, and a rigid, board-like abdomen. What condition should the nurse suspect?",
    options: [
      "Placenta Previa",
      "Abruptio Placentae",
      "Cervical Incompetence",
      "Ectopic Pregnancy"
    ],
    correctAnswerIndex: 1,
    rationale: "Correct Answer: B. Abruptio Placentae (premature separation of the placenta) manifests as dark red vaginal bleeding, severe uterine tenderness, and a hard/board-like abdomen due to concealed hemorrhage. Placenta Previa presents with painless, bright red bleeding.",
    categoryTag: "OB Emergencies",
    clinicalPearl: "Abruption = PAINFUL, rigid abdomen, dark blood. Previa = PAINLESS, bright red blood.",
    bookmarked: false,
    userAnswerIndex: null,
    answeredCorrectly: null
  },
  {
    id: "q-5",
    subject: "Mental Health",
    question: "A client taking Phenelzine (an MAOI) is admitted with a severe headache, palpitations, neck stiffness, and a blood pressure of 210/120 mmHg. The nurse suspects a hypertensive crisis. Which dietary indiscretion likely triggered this episode?",
    options: [
      "Eating aged cheddar cheese and salami",
      "Drinking grapefruit juice with breakfast",
      "Consuming high-potassium bananas and leafy greens",
      "Drinking whole milk and white bread"
    ],
    correctAnswerIndex: 0,
    rationale: "Correct Answer: A. MAOIs prevent the breakdown of tyramine. Ingesting tyramine-rich foods (aged cheeses, cured meats like salami/pepperoni, red wine, draft beer, fermented soy) triggers massive release of norepinephrine, causing fatal hypertensive crisis.",
    categoryTag: "Psychopharmacology Safety",
    clinicalPearl: "MAOIs + Tyramine = Hypertensive Crisis! Avoid aged cheese, pepperoni, wine, and tap beer.",
    bookmarked: true,
    userAnswerIndex: null,
    answeredCorrectly: null
  }
];

export const DEFAULT_STUDY_TASKS: StudyTask[] = [
  {
    id: "task-1",
    title: "Master High-Yield Cardiac Meds: Digoxin, Furosemide & Metoprolol",
    category: "Pharmacology",
    dueDate: "Today",
    completed: false,
    priority: "high",
    notes: "Digoxin: Normal level 0.5-2.0 ng/mL. Toxicity signs: anorexia, N/V, yellow-green visual halos, dysrhythmias. Antidote: Digibind (Digoxin immune fab). Hold if apical HR < 60 bpm.\nFurosemide (Lasix): Loop diuretic. Watch for hypokalemia, ototoxicity (tinnitus if pushed too fast!), and orthostatic hypotension.",
    summarizedNotes: [
      "Digoxin therapeutic range: 0.5 - 2.0 ng/mL. Toxicity: Halos, N/V, bradycardia.",
      "Check apical pulse for 60 seconds before Digoxin; hold if HR < 60 bpm.",
      "Furosemide causes hypokalemia & ototoxicity if IV push is > 20mg/min."
    ],
    clinicalPearls: ["Hypokalemia potentiates Digoxin toxicity risk."],
    linkedPomodoroCount: 2
  },
  {
    id: "task-2",
    title: "Review Post-Op Thyroidectomy Care & Hypocalcemia Signs",
    category: "Medical-Surgical",
    dueDate: "Today",
    completed: true,
    priority: "high",
    notes: "Watch for airway compromise from stridor or neck hematoma. Place tracheostomy tray and suction at bedside. Check Chvostek's sign (facial twitching) and Trousseau's sign (carpal spasm with BP cuff) for hypocalcemia caused by parathyroid injury.",
    summarizedNotes: [
      "Emergency bedside equipment: Trach tray, suction, Calcium Gluconate IV.",
      "Positive Chvostek's & Trousseau's = Acute Hypocalcemia."
    ],
    clinicalPearls: ["Stridor after neck surgery indicates airway collapse—emergency call!"],
    linkedPomodoroCount: 1
  },
  {
    id: "task-3",
    title: "Study Pediatric Congenital Cyanotic vs Acyanotic Heart Defects",
    category: "Pediatrics",
    dueDate: "Tomorrow",
    completed: false,
    priority: "medium",
    notes: "Cyanotic (Right-to-Left shunt): Tetralogy of Fallot, Transposition of Great Vessels. Acyanotic (Left-to-Right shunt): VSD, ASD, PDA. Tetralogy of Fallot 4 defects: PROVe = Pulmonary stenosis, Right ventricular hypertrophy, Overriding aorta, Ventricular septal defect.",
    summarizedNotes: [
      "Mnemonic for Tetralogy of Fallot: PROVe (Pulmonary stenosis, RV hypertrophy, Overriding aorta, VSD).",
      "Knee-chest position for Tet hypercyanotic spells."
    ],
    clinicalPearls: ["Cyanotic = Right to Left shunt; Acyanotic = Left to Right shunt."],
    linkedPomodoroCount: 0
  },
  {
    id: "task-4",
    title: "Compare Placenta Previa vs Abruptio Placentae Signs",
    category: "Obstetrics & Gynecology",
    dueDate: "In 2 days",
    completed: false,
    priority: "medium",
    notes: "Previa: Painless, bright red vaginal bleeding, soft non-tender uterus. NO vaginal exams!\nAbruption: Painful, dark red bleeding, rigid board-like abdomen, fetal distress. Prepare for emergency C-section.",
    summarizedNotes: [
      "Placenta Previa: Painless, bright red, NO digital cervical exam.",
      "Abruptio Placentae: Painful, dark red, rigid abdomen."
    ],
    clinicalPearls: ["Never perform a digital vaginal exam on placenta previa!"],
    linkedPomodoroCount: 0
  },
  {
    id: "task-5",
    title: "Psychopharmacology: Lithium Toxicity & MAOI Diet Rules",
    category: "Mental Health",
    dueDate: "In 3 days",
    completed: false,
    priority: "low",
    notes: "Lithium level: 0.6 - 1.2 mEq/L. Toxicity occurs > 1.5 mEq/L (ataxia, coarse tremors, confusion, polyuria). Hyponatremia increases lithium retention! Maintain steady sodium and fluid intake.",
    summarizedNotes: [
      "Lithium range: 0.6 - 1.2 mEq/L. Keep sodium intake consistent.",
      "MAOIs: Avoid tyramine (aged cheeses, cured meats, wine)."
    ],
    clinicalPearls: ["Low Sodium = High Lithium toxic risk!"],
    linkedPomodoroCount: 0
  }
];

export const DEFAULT_CLINICAL_SHIFTS: ClinicalShift[] = [
  {
    id: "shift-1",
    date: "2026-07-22",
    hours: 12,
    hospitalUnit: "Medical ICU (MICU)",
    preceptor: "Sarah Jenkins, RN, BSN, CCRN",
    skillsPracticed: [
      "Arterial Line Blood Sampling",
      "Tracheostomy Care & Suctioning",
      "IV Medication Titration (Norepinephrine)",
      "SBAR Shift Handoff Report"
    ],
    keyReflection: "Monitored septic shock patient on titratable vasopressors. Practiced calculating MAP (Mean Arterial Pressure = [SBP + 2(DBP)] / 3). Target MAP >= 65 mmHg."
  },
  {
    id: "shift-2",
    date: "2026-07-18",
    hours: 12,
    hospitalUnit: "Pediatric Inpatient Ward",
    preceptor: "Marcus Vance, RN, CPN",
    skillsPracticed: [
      "Pediatric Dosage Calculations",
      "Pediatric IV Insertion (24G)",
      "Nebulizer Therapy Administration",
      "Family-Centered Discharge Education"
    ],
    keyReflection: "Administered weight-based pediatric oral suspensions (mg/kg/day). Focused on non-pharmacological pain management during IV placement for a 4-year-old child."
  },
  {
    id: "shift-3",
    date: "2026-07-12",
    hours: 12,
    hospitalUnit: "Labor & Delivery (L&D)",
    preceptor: "Elena Rostova, RN, MSN, RNC-OB",
    skillsPracticed: [
      "Electronic Fetal Monitoring (EFM) Interpretation",
      "Leopold Maneuvers",
      "Postpartum Fundal & Lochia Assessment",
      "Oxytocin (Pitocin) Infusion Management"
    ],
    keyReflection: "Assisted in identifying variable decelerations caused by cord compression. Implemented UNLOAD protocol (Change position, Oxygen, Fluids, Stop Pitocin)."
  }
];

export const DEFAULT_LAB_VALUES: LabValue[] = [
  {
    id: "lab-1",
    category: "Electrolytes",
    name: "Potassium (K+)",
    range: "3.5 - 5.0",
    unit: "mEq/L",
    clinicalSignificance: "Crucial for cardiac conduction and muscle contraction.",
    highSignificance: "Hyperkalemia (> 5.0): Tall peaked T-waves, widened QRS, risk of cardiac arrest.",
    lowSignificance: "Hypokalemia (< 3.5): U-waves, flattened T-waves, muscle cramps, Digoxin toxicity."
  },
  {
    id: "lab-2",
    category: "Electrolytes",
    name: "Sodium (Na+)",
    range: "135 - 145",
    unit: "mEq/L",
    clinicalSignificance: "Primary ECF cation; controls osmolality and fluid balance.",
    highSignificance: "Hypernatremia (> 145): Extreme thirst, agitation, seizures, dry mucous membranes.",
    lowSignificance: "Hyponatremia (< 135): Confusion, altered mental status, cerebral edema, seizures."
  },
  {
    id: "lab-3",
    category: "Hematology",
    name: "White Blood Cells (WBC)",
    range: "4,500 - 11,000",
    unit: "/mm3",
    clinicalSignificance: "Immune defense against pathogens.",
    highSignificance: "Leukocytosis (> 11,000): Acute bacterial infection, inflammation, leukemia.",
    lowSignificance: "Leukopenia (< 4,500): Immunosuppression, chemotherapy, neutropenic precautions (< 1,000)."
  },
  {
    id: "lab-4",
    category: "Hematology",
    name: "Platelets (PLT)",
    range: "150,000 - 450,000",
    unit: "/mcL",
    clinicalSignificance: "Essential for blood clotting and hemostasis.",
    highSignificance: "Thrombocytosis (> 450k): Clotting risk, myeloproliferative disorder.",
    lowSignificance: "Thrombocytopenia (< 150k): Bleeding risk. Hold enoxaparin/heparin if < 50k!"
  },
  {
    id: "lab-5",
    category: "Renal & Metabolic",
    name: "Serum Creatinine",
    range: "0.6 - 1.2",
    unit: "mg/dL",
    clinicalSignificance: "Gold standard for renal function and GFR health.",
    highSignificance: "Elevated (> 1.2): Acute Kidney Injury (AKI) or Chronic Kidney Disease.",
    lowSignificance: "Low (< 0.6): Severe muscle wasting, debilitation."
  },
  {
    id: "lab-6",
    category: "Renal & Metabolic",
    name: "Blood Urea Nitrogen (BUN)",
    range: "10 - 20",
    unit: "mg/dL",
    clinicalSignificance: "Byproduct of protein catabolism in liver, excreted by kidneys.",
    highSignificance: "Elevated (> 20): Dehydration, high protein diet, renal impairment.",
    lowSignificance: "Low (< 10): Liver failure, fluid overload/overhydration."
  },
  {
    id: "lab-7",
    category: "Coagulation",
    name: "INR (Warfarin Therapy)",
    range: "2.0 - 3.0",
    unit: "ratio",
    clinicalSignificance: "Standardized blood clotting time monitoring for Warfarin/Coumadin.",
    highSignificance: "INR > 3.0 (or > 3.5 mechanical valves): High bleeding risk! Antidote: Vitamin K.",
    lowSignificance: "INR < 2.0: Subtherapeutic, high stroke/thromboembolism risk."
  },
  {
    id: "lab-8",
    category: "Therapeutic Levels",
    name: "Digoxin Level",
    range: "0.5 - 2.0",
    unit: "ng/mL",
    clinicalSignificance: "Cardiac glycoside therapeutic range.",
    highSignificance: "Toxicity (> 2.0): Halos, nausea, bradycardia, dysrhythmias. Give Digibind.",
    lowSignificance: "Subtherapeutic (< 0.5): Ineffective for heart failure / rate control."
  },
  {
    id: "lab-9",
    category: "Therapeutic Levels",
    name: "Lithium Level",
    range: "0.6 - 1.2",
    unit: "mEq/L",
    clinicalSignificance: "Bipolar mood stabilizer therapeutic window.",
    highSignificance: "Toxicity (> 1.5): Ataxia, slurred speech, tremors, seizures, renal failure.",
    lowSignificance: "Subtherapeutic (< 0.6): Risk of manic relapse."
  }
];

export const PRESET_DRUG_CARDS: DrugCardData[] = [
  {
    drugName: "Furosemide",
    genericName: "Furosemide",
    brandNames: ["Lasix"],
    drugClass: "Loop Diuretic",
    mechanismOfAction: "Inhibits reabsorption of sodium and chloride in the ascending Loop of Henle, causing profound diuresis.",
    indications: ["Heart Failure Edema", "Pulmonary Edema", "Hypertension", "Renal Disease"],
    keySideEffects: ["Hypokalemia", "Hyponatremia", "Ototoxicity (tinnitus/hearing loss)", "Orthostatic Hypotension", "Dehydration"],
    blackBoxWarnings: ["Profound diuresis leading to electrolyte depletion and fluid deficit."],
    nursingConsiderations: [
      "Monitor serum potassium levels (3.5-5.0 mEq/L) prior to administration.",
      "Check blood pressure before pushing IV.",
      "Administer IV push slowly over 1-2 mins (max 20 mg/min to prevent ototoxicity).",
      "Weigh patient daily at same time, same scale, same clothing."
    ],
    antidoteOrLabs: "Potassium replacement protocol; monitor K+, Na+, BUN, Creatinine.",
    highYieldNclexTip: "Ototoxicity is a classic NCLEX trap! Push Lasix slowly to protect the ears."
  },
  {
    drugName: "Digoxin",
    genericName: "Digoxin",
    brandNames: ["Lanoxin"],
    drugClass: "Cardiac Glycoside / Inotrope",
    mechanismOfAction: "Inhibits Na+/K+-ATPase pump, increasing intracellular calcium. Increases myocardial contractility (+ inotrope) and decreases AV conduction rate (- chronotrope).",
    indications: ["Heart Failure", "Atrial Fibrillation / Atrial Flutter"],
    keySideEffects: ["Bradycardia", "Anorexia", "Nausea & Vomiting", "Visual Disturbances (Yellow-Green Halos, Blurred Vision)", "Arrhythmias"],
    blackBoxWarnings: ["Narrow therapeutic index; dig toxicity risk high in hypokalemic patients."],
    nursingConsiderations: [
      "Count apical pulse for 1 full minute prior to administration. Hold if HR < 60 bpm in adults.",
      "Monitor therapeutic drug level (0.5 - 2.0 ng/mL).",
      "Assess potassium levels closely—hypokalemia increases toxicity risk!"
    ],
    antidoteOrLabs: "Digoxin Immune Fab (Digibind) is the antidote for severe overdose.",
    highYieldNclexTip: "Early toxicity = Nausea/Anorexia. Late toxicity = Yellow/green halos & dysrhythmias!"
  },
  {
    drugName: "Metoprolol",
    genericName: "Metoprolol Succinate / Tartrate",
    brandNames: ["Lopressor", "Toprol-XL"],
    drugClass: "Cardioselective Beta-1 Adrenergic Blocker",
    mechanismOfAction: "Selectively blocks Beta-1 receptors in the myocardium, decreasing heart rate, cardiac output, and blood pressure.",
    indications: ["Hypertension", "Angina Pectoris", "Heart Failure", "Post-Myocardial Infarction"],
    keySideEffects: ["Bradycardia", "Hypotension", "Fatigue / Dizziness", "Erectile Dysfunction", "Masks Hypoglycemia Signs"],
    blackBoxWarnings: ["Do not discontinue abruptly; may precipitate severe angina or myocardial infarction."],
    nursingConsiderations: [
      "Check heart rate and blood pressure before administration. Hold if HR < 60 bpm or SBP < 90 mmHg.",
      "Warn diabetic patients that metoprolol masks symptoms of hypoglycemia (tachycardia, tremors). Sweating is NOT masked!",
      "Caution in asthma/COPD at high doses."
    ],
    antidoteOrLabs: "Glucagon IV is antidote for beta-blocker overdose.",
    highYieldNclexTip: "Metoprolol masks tachycardia from low blood sugar—diabetic patients must monitor blood glucose!"
  }
];
