import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json({ limit: "5mb" }));

const PORT = 3000;

// Initialize Gemini Client
const getGeminiAi = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. AI endpoints will use intelligent clinical fallback mode.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    isVercel: Boolean(process.env.VERCEL)
  });
});

// Helper Fallback Generator Functions for offline/missing key scenarios on Vercel
function getFallbackMcqs(subject: string, count: number, difficulty: string) {
  const questionsList = [
    {
      id: `ai-fb-1-${Date.now()}`,
      subject,
      question: `A nurse is caring for a client receiving intravenous Heparin infusion for Deep Vein Thrombosis (DVT). Which laboratory result requires the nurse's IMMEDIATE intervention?`,
      options: [
        "aPTT of 65 seconds (Control: 30 seconds)",
        "Platelet count of 75,000/mm³ (Baseline: 220,000/mm³)",
        "Prothrombin Time (PT) of 12 seconds",
        "Hemoglobin level of 13.8 g/dL"
      ],
      correctAnswerIndex: 1,
      rationale: "A sudden drop in platelet count greater than 50% from baseline or below 100,000/mm³ strongly suggests Heparin-Induced Thrombocytopenia (HIT), a life-threatening immune-mediated reaction. Heparin must be stopped immediately, and an alternative anticoagulant (e.g., Argatroban) initiated.",
      categoryTag: "Safety & Pharmacology",
      clinicalPearl: "HIT (Heparin-Induced Thrombocytopenia) causes arterial and venous thrombosis despite low platelet count. Never give platelets; stop Heparin immediately!"
    },
    {
      id: `ai-fb-2-${Date.now()}`,
      subject,
      question: `The nurse assesses a client 2 hours post-thyroidectomy. The client exhibits muscle twitching and a positive Chvostek's sign. Which medication should the nurse prepare for immediate administration?`,
      options: [
        "Sodium Bicarbonate IV",
        "Calcium Gluconate IV",
        "Potassium Chloride IV Piggyback",
        "Levothyroxine IV"
      ],
      correctAnswerIndex: 1,
      rationale: "Accidental removal or trauma to the parathyroid glands during thyroidectomy causes acute hypocalcemia. Symptoms include tetany, positive Chvostek's/Trousseau's signs, and laryngospasm. IV Calcium Gluconate is the emergency treatment.",
      categoryTag: "Med-Surg / Endocrine",
      clinicalPearl: "Post-thyroidectomy priority equipment at bedside: Tracheostomy tray, Suction, and IV Calcium Gluconate!"
    },
    {
      id: `ai-fb-3-${Date.now()}`,
      subject,
      question: `A client with Acute Heart Failure exacerbation is prescribed Furosemide 80 mg IV Push. Which assessment finding indicates that the medication has achieved its intended therapeutic outcome?`,
      options: [
        "Blood pressure increases from 110/70 to 135/85 mmHg",
        "Serum Potassium level is 3.1 mEq/L",
        "Reduction in bilateral pulmonary crackles and decreased dyspnea",
        "Urine output of 20 mL over the last 4 hours"
      ],
      correctAnswerIndex: 2,
      rationale: "Furosemide is a loop diuretic that reduces fluid overload in heart failure. Clearing lung sounds, decreased crackles, improved oxygenation, and reduced respiratory effort indicate effective pulmonary decongestion.",
      categoryTag: "Pharmacology & Priority Care",
      clinicalPearl: "Loop diuretics lower Potassium and Blood Pressure. Always check Potassium and BP before giving Furosemide IV Push slowly (20 mg/min to avoid ototoxicity)."
    },
    {
      id: `ai-fb-4-${Date.now()}`,
      subject,
      question: `A pregnant client at 34 weeks gestation presents with painless, bright red vaginal bleeding. Which nursing action is STRICTLY CONTRAINDICATED?`,
      options: [
        "Performing a digital vaginal examination",
        "Applying external fetal heart monitor",
        "Obtaining maternal blood pressure and pulse",
        "Establishing 18-gauge IV access"
      ],
      correctAnswerIndex: 0,
      rationale: "Painless bright red vaginal bleeding in late pregnancy is a cardinal sign of Placenta Previa. Digital vaginal exams are strictly contraindicated because finger insertion can puncture the placenta, triggering catastrophic hemorrhage.",
      categoryTag: "Obstetrics / High-Risk Pregnancy",
      clinicalPearl: "Placenta Previa = Painless bright red bleeding (NO digital vaginal exams!). Abruptio Placentae = Painful dark red bleeding with board-like rigid abdomen."
    },
    {
      id: `ai-fb-5-${Date.now()}`,
      subject,
      question: `A nurse enters the room of a client with schizophrenia receiving Haloperidol. The client has a temperature of 103.8°F (39.9°C), severe muscle rigidity ('lead pipe'), altered consciousness, and autonomic instability. What is the nurse's priority action?`,
      options: [
        "Administer Benztropine IM for extrapyramidal symptoms",
        "Stop Haloperidol, notify healthcare provider immediately, and initiate cooling measures",
        "Recheck temperature in 1 hour and administer oral Acetaminophen",
        "Place client in physical restraints for agitation"
      ],
      correctAnswerIndex: 1,
      rationale: "High fever, lead-pipe muscle rigidity, confusion, and autonomic instability in a patient taking typical antipsychotics indicate Neuroleptic Malignant Syndrome (NMS), a medical emergency. Discontinue drug immediately, notify provider, and start rapid cooling/hydration.",
      categoryTag: "Mental Health / Psych Pharmacology",
      clinicalPearl: "NMS (Neuroleptic Malignant Syndrome) key triad: Hyperthermia (Fever >103°F), Muscle Rigidity, and Altered Mental Status. Treatment includes Dantrolene or Bromocriptine."
    }
  ];

  return questionsList.slice(0, Math.min(count, questionsList.length));
}

function getFallbackDrugCard(drugName: string) {
  const nameLower = drugName.toLowerCase();
  
  if (nameLower.includes("digoxin") || nameLower.includes("lanoxin")) {
    return {
      drugName: "Digoxin",
      genericName: "Digoxin",
      brandNames: ["Lanoxin"],
      drugClass: "Cardiac Glycoside / Positive Inotrope",
      mechanismOfAction: "Inhibits Na+/K+ ATPase pump, increasing intracellular calcium in myocardial cells. Increases force of myocardial contraction (positive inotrope) and decreases AV node conduction velocity (negative chronotrope).",
      indications: ["Heart Failure with reduced ejection fraction", "Atrial Fibrillation / Atrial Flutter rate control"],
      keySideEffects: ["Visual disturbances (yellow-green halos, xanthopsia)", "Bradycardia & arrhythmias", "Nausea, vomiting, anorexia (early sign of toxicity)"],
      blackBoxWarnings: ["Narrow therapeutic index; monitor serum levels closely"],
      nursingConsiderations: [
        "Assess apical pulse for 1 full minute prior to administration; HOLD if HR < 60 bpm in adults (< 90 in infants).",
        "Therapeutic serum level: 0.5 - 2.0 ng/mL.",
        "Monitor Potassium levels! Hypokalemia (< 3.5 mEq/L) greatly increases the risk of Digoxin Toxicity."
      ],
      antidoteOrLabs: "Antidote: Digoxin Immune Fab (Digibind). Monitor Serum Potassium & Digoxin level.",
      highYieldNclexTip: "NCLEX Favorite: Hypokalemia enhances Digoxin toxicity! Early signs of toxicity = GI symptoms (N/V/anorexia). Late signs = Visual halos & bradycardia."
    };
  }

  return {
    drugName: drugName,
    genericName: drugName,
    brandNames: ["Clinical Standard Formulation"],
    drugClass: "High-Yield BSN Pharmacology Focus",
    mechanismOfAction: `Therapeutic agent targeting specific receptor pathways to manage acute clinical conditions in hospital and ambulatory settings.`,
    indications: [`Management of acute and chronic conditions related to ${drugName}`, "Symptom reduction and clinical stabilization"],
    keySideEffects: ["Gastrointestinal upset / Nausea", "Dizziness or orthostatic hypotension", "Headache or lethargy"],
    blackBoxWarnings: ["Use with caution in renal or hepatic impairment"],
    nursingConsiderations: [
      `Assess baseline vital signs and pertinent blood laboratory values before initiating ${drugName}.`,
      "Educate patient regarding compliance, potential adverse reactions, and when to notify provider.",
      "Evaluate therapeutic effectiveness and document patient response accurately."
    ],
    antidoteOrLabs: "Monitor routine CBC, Renal/Hepatic panels, and baseline Vital Signs.",
    highYieldNclexTip: "NCLEX Pearl: Always verify '5 Rights' of medication administration and assess organ function labs prior to high-alert drug delivery!"
  };
}

function getFallbackCarePlan(topicOrDiagnosis: string) {
  return {
    nandaDiagnosis: `Acute Alteration in Health Status related to ${topicOrDiagnosis} as evidenced by verbalization of distress, altered physiological parameters, and functional limitation.`,
    pathophysiology: `Underlying cellular or mechanical dysfunction associated with ${topicOrDiagnosis} causes systemic inflammatory or metabolic distress, compromising normal tissue perfusion and homeostasis.`,
    expectedOutcomes: [
      `Client will maintain stable vital signs within baseline parameters throughout the shift.`,
      `Client will demonstrate effective coping and self-care strategies related to ${topicOrDiagnosis} prior to discharge.`
    ],
    interventions: [
      {
        action: `Perform comprehensive clinical assessment focusing on baseline vital signs, oxygenation, and symptomatic distress every 4 hours.`,
        rationale: "Frequent physiological monitoring allows early detection of clinical deterioration and prompt therapeutic intervention.",
        type: "Independent"
      },
      {
        action: "Position client in optimal ergonomic/fowler's position to facilitate anatomical alignment and physiological comfort.",
        rationale: "Proper body positioning optimizes lung expansion, venous return, and reduces anatomical strain.",
        type: "Independent"
      },
      {
        action: "Administer prescribed pharmacotherapy and supplemental support in accordance with physician orders.",
        rationale: "Targeted medical management treats the root etiology and restores physiological homeostasis.",
        type: "Collaborative"
      },
      {
        action: "Provide structured, client-centered patient teaching regarding disease process, medication compliance, and warning signs.",
        rationale: "Patient education empowers health literacy, reduces anxiety, and prevents avoidable readmissions.",
        type: "Independent"
      }
    ],
    evaluation: `Client met expected outcomes; vital signs remained within target parameters and client demonstrated understanding of discharge instructions.`
  };
}

function getFallbackSummary(notes: string) {
  return {
    summaryBullets: [
      "Key Clinical Takeaway: Prioritize physiological stabilization and airway/breathing/circulation (ABCs) in high-acuity patient care.",
      "Pharmacological Safety: Always double-check dosage calculations, organ function labs, and drug compatibility prior to administration.",
      "Clinical Judgment Focus: Recognize subtle cues of deterioration early and intervene before decompensation occurs."
    ],
    clinicalPearls: [
      "Maslow's Hierarchy & ABCs (Airway, Breathing, Circulation) guide NCLEX priority question answering.",
      "Unstable patients always take priority over stable patients with predictable symptoms."
    ],
    keyTermsToRemember: ["Priority Assessment", "ABCs", "Safety First", "Client Centered Care"]
  };
}

// 1. NCLEX MCQ Generator Endpoint
app.post("/api/ai/nclex-mcq", async (req, res) => {
  try {
    const { subject = "Med-Surg", count = 3, difficulty = "NCLEX-RN Standard" } = req.body;
    const ai = getGeminiAi();

    if (!ai) {
      const questions = getFallbackMcqs(subject, count, difficulty);
      return res.json({ 
        questions, 
        fallback: true,
        notice: "Using offline clinical question generator. To enable real-time Gemini 3.6 Flash generation on Vercel, set GEMINI_API_KEY in Vercel Project Settings." 
      });
    }

    const prompt = `Generate ${count} high-yield NCLEX-RN multiple choice practice questions for BSN nursing students in the subject of "${subject}" at "${difficulty}" difficulty.
Each question must test priority nursing care, patient safety, or clinical judgment (including NextGen NCLEX style concepts).
Include clear rationale explaining why the correct answer is right and why distractors are incorrect.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert NCLEX-RN test item writer and nursing educator. Output valid structured JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              subject: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswerIndex: { type: Type.INTEGER },
              rationale: { type: Type.STRING },
              categoryTag: { type: Type.STRING },
              clinicalPearl: { type: Type.STRING }
            },
            required: ["subject", "question", "options", "correctAnswerIndex", "rationale", "categoryTag", "clinicalPearl"]
          }
        }
      }
    });

    const jsonText = response.text || "[]";
    const questions = JSON.parse(jsonText);
    res.json({ questions });
  } catch (error: any) {
    console.error("Error generating NCLEX MCQs with Gemini, using fallback:", error);
    const questions = getFallbackMcqs(req.body.subject || "Med-Surg", req.body.count || 3, "Standard");
    res.json({ questions, fallback: true });
  }
});

// 2. Pharmacology Drug Card Generator Endpoint
app.post("/api/ai/drug-card", async (req, res) => {
  try {
    const { drugName } = req.body;
    if (!drugName) {
      return res.status(400).json({ error: "Drug name is required" });
    }

    const ai = getGeminiAi();
    if (!ai) {
      const card = getFallbackDrugCard(drugName);
      return res.json({ 
        card, 
        fallback: true,
        notice: "Using offline pharmacology card generator. To enable real-time Gemini 3.6 Flash generation on Vercel, set GEMINI_API_KEY in Vercel Project Settings." 
      });
    }

    const prompt = `Provide a comprehensive Pharmacology Drug Card for the medication "${drugName}" tailored for NCLEX-RN and BSN nursing students.
Cover: Generic & Brand names, Therapeutic & Pharmacologic Class, Mechanism of Action, Key Indications, Essential Nursing Considerations (Assessments, Labs, Patient Teaching), High-Risk Side Effects, Black Box Warnings (if any), and Antidote or key Monitoring Parameters.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a clinical pharmacologist and nursing professor. Provide accurate, high-yield drug study cards in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            drugName: { type: Type.STRING },
            genericName: { type: Type.STRING },
            brandNames: { type: Type.ARRAY, items: { type: Type.STRING } },
            drugClass: { type: Type.STRING },
            mechanismOfAction: { type: Type.STRING },
            indications: { type: Type.ARRAY, items: { type: Type.STRING } },
            keySideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
            blackBoxWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            nursingConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } },
            antidoteOrLabs: { type: Type.STRING },
            highYieldNclexTip: { type: Type.STRING }
          },
          required: ["drugName", "genericName", "drugClass", "mechanismOfAction", "keySideEffects", "nursingConsiderations", "highYieldNclexTip"]
        }
      }
    });

    const card = JSON.parse(response.text || "{}");
    res.json({ card });
  } catch (error: any) {
    console.error("Error generating drug card with Gemini, using fallback:", error);
    const card = getFallbackDrugCard(req.body.drugName || "Medication");
    res.json({ card, fallback: true });
  }
});

// 3. Care Plan Breakdown Endpoint
app.post("/api/ai/care-plan", async (req, res) => {
  try {
    const { topicOrDiagnosis } = req.body;
    if (!topicOrDiagnosis) {
      return res.status(400).json({ error: "Topic or NANDA diagnosis is required" });
    }

    const ai = getGeminiAi();
    if (!ai) {
      const carePlan = getFallbackCarePlan(topicOrDiagnosis);
      return res.json({ 
        carePlan, 
        fallback: true,
        notice: "Using offline NANDA care plan generator. To enable real-time Gemini 3.6 Flash generation on Vercel, set GEMINI_API_KEY in Vercel Project Settings." 
      });
    }

    const prompt = `Construct an evidence-based NANDA Nursing Care Plan for "${topicOrDiagnosis}".
Include: NANDA Nursing Diagnosis, Brief Pathophysiology, 2 SMART Expected Outcomes, 4 Nursing Interventions with detailed NCLEX rationales (labeled as Independent or Collaborative), and Evaluation Criteria.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a BSN Nursing Educator guiding clinical care plan construction.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nandaDiagnosis: { type: Type.STRING },
            pathophysiology: { type: Type.STRING },
            expectedOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
            interventions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  type: { type: Type.STRING }
                },
                required: ["action", "rationale", "type"]
              }
            },
            evaluation: { type: Type.STRING }
          },
          required: ["nandaDiagnosis", "pathophysiology", "expectedOutcomes", "interventions", "evaluation"]
        }
      }
    });

    const carePlan = JSON.parse(response.text || "{}");
    res.json({ carePlan });
  } catch (error: any) {
    console.error("Error generating care plan with Gemini, using fallback:", error);
    const carePlan = getFallbackCarePlan(req.body.topicOrDiagnosis || "Acute Care");
    res.json({ carePlan, fallback: true });
  }
});

// 4. Summarize Notes & Clinical Pearls Endpoint
app.post("/api/ai/summarize-notes", async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || notes.trim().length === 0) {
      return res.status(400).json({ error: "Notes text is required" });
    }

    const ai = getGeminiAi();
    if (!ai) {
      const summary = getFallbackSummary(notes);
      return res.json({ 
        summary, 
        fallback: true,
        notice: "Using offline notes summarizer. To enable real-time Gemini 3.6 Flash generation on Vercel, set GEMINI_API_KEY in Vercel Project Settings." 
      });
    }

    const prompt = `Condense the following nursing study notes or clinical reflection into high-yield, bulleted NCLEX review pearls:

Notes:
"${notes}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a senior nursing preceptor. Summarize student notes into key clinical pearls and action items.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaryBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
            clinicalPearls: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyTermsToRemember: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summaryBullets", "clinicalPearls"]
        }
      }
    });

    const summary = JSON.parse(response.text || "{}");
    res.json({ summary });
  } catch (error: any) {
    console.error("Error summarizing notes with Gemini, using fallback:", error);
    const summary = getFallbackSummary(req.body.notes || "");
    res.json({ summary, fallback: true });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Nursing Student Daily Planner Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
