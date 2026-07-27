APP NAME
AI Nursing Student Planner

AI Nursing Student Planner – High-Yield NCLEX Preparation & Clinical Study Suite
The AI Nursing Student Planner (BSN Clinical Dashboard) is an all-in-one workspace designed to streamline the academic and hospital workload for nursing students and NCLEX-RN candidates.

What it does/puurpose
Instead of juggling physical drug handbooks, spreadsheets for rotation hours, and separate test-prep apps, it unifies all clinical and study tools into a single, high-contrast dark dashboard.

Problem it solves
AI Care Plan Builder: Converts any diagnosis into structured, evidence-based NANDA care plans with SMART goals and intervention rationales.

NCLEX Prep Hub: Practice questions with detailed rationales, clinical pearls, and priority-based judgment testing.

Drug Card Generator: Quick-reference profiles detailing class, mechanism of action, nursing considerations, black box warnings, and antidotes.

Clinical Shift Tracker: Logs hospital rotation hours, skills, unit types (ICU, Med-Surg, OB/GYN), and progress toward graduation requirements.

Pomodoro & AI Summarizer: Built-in study timer paired with an AI tool that turns raw clinical shift notes into high-yield review notes.

Zero-Downtime Design: Built with a client-side backup engine so study sessions and reference tools stay available even without internet or active API keys.

Description

The AI Nursing Student Planner is a web application designed to help nursing students organize their studies and prepare for the NCLEX examination. The application combines AI-power
ed study tools with productivity features, allowing students to manage daily learning tasks, generate practice questions, review drug information, create nursing care plans, and stay focused using a built-in study timer.
The project aims to reduce study stress by providing multiple nursing learning resources in one platform, improving learning efficiency and helping students prepare for both academic exams and clinical practice.

LIVE deployed URL vercel
nursing-planner-vj2i-i1k3tuqrv-nawaz969s-projects.vercel.app

LIVE deployed URL github 
https://github.com/nawaz969/easy-nursing.git

LIVE deployed URL raikway.com
easy-nursing-production-407a.up.railway.app

Key Features
AI NCLEX Question Generator
Generates practice MCQs with explanations.
Supports different nursing subjects.
AI Drug Card Generator
Creates drug cards with:
Mechanism of Action
Side Effects
Black Box Warnings
Nursing Considerations


NCLEX Tips
AI Nursing Care Plan Builder
Generates NANDA nursing diagnoses.
Provides SMART goals.
Suggests nursing interventions with rationales.
Includes evaluation criteria.
Subject-wise Study Planner
Organizes daily study tasks by subject.
Allows students to track completed tasks.
Provides AI-generated summaries and clinical pearls.

Pomodoro Study Timer
25-minute focus sessions with 5-minute breaks.
Links study sessions to selected tasks.
Tracks completed study sessions.


Progress Dashboard
Daily question progress.
Study streak tracking.
NCLEX countdown.
Overall study progress.

Technologies Used
Google AI Studio
Gemini API
TypeScript
Vite
Node.js
GitHub
Railway (Deployment)

Benefits
Improves NCLEX preparation.
Organizes daily study activities.
Saves time by generating nursing content instantly.
Encourages consistent study habits.
Provides accurate clinical learning resources in one platform.

Conclusion
The AI Nursing Student Planner is an all-in-one study companion for nursing students. By integrating AI-powered learning tools with task
management and productivity features, 
it helps students study smarter, stay organized, and improve their readiness for nursing examinations and clinical practice

Screen 
Dashboard (First/Home Screen)
Operation Name: AI Nursing Student Dashboard
<img width="714" height="1599" alt="WhatsApp Image 2026-07-27 at 1 26 16 PM (1)" src="https://github.com/user-attachments/assets/492f609c-1d9b-4652-bcd1-31824df6dda4" />
AI-Powered Nursing Study Suite & NCLEX Question Bank
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/01a5dfc0-4362-4159-9b5e-a729b53fb65b" />

Integrated Pomodoro Focus Timer with Task Linking
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/61dae946-bfba-4271-a29e-599716ff26d9" />
AI Drug Card Generator with Black Box Warnings & Nursing Considerations
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/cc0c4270-42ec-4a7b-89d3-a51d691ee94c" />
Clinical Shift & Skills Tracker Dashboard
<img width="483" height="605" alt="image" src="https://github.com/user-attachments/assets/2c8cad27-c84a-4d0d-8c2e-0d17d598ffee" />
The application is structured as a full-stack Node.js project using React (with Vite) for the front-end, styled with a warm neutral Tailwind CSS scheme, and backed by a lightweight Express server to safely proxy AI endpoints.
To run this project locally, follow these steps:
1. Prerequisites
Ensure you have Node.js (v18 or higher) and npm installed on your machine.
2. Install Dependencies
Navigate to the root directory of the project in your terminal and install the required npm packages:
code
Bash
npm install
3. Configure the Environment
The application uses the Gemini API to generate real-time questions, care plans, and drug cards.
Create a .env file in the root directory of the project (you can copy the structure from .env.example).
Add your Google Gemini API key:
code
Env
GEMINI_API_KEY=your_actual_api_key_here
(Note: If you run the project without an API key, the application will seamlessly fall back to its internal offline clinical engines to keep all tools functional.)
4. Run the Development Server
Launch the full-stack development environment:
code
Bash
npm run dev
This boots the Express backend on port 3000 and mounts the Vite dev server. You can view the live application by opening http://localhost:3000 in your web browser.



