# Smart Quiz Builder - Unofficial AZ-900 Exam Prep

> **⚠️ IMPORTANT DISCLAIMER:** This is an **unofficial** study tool created for the Power Learn Project (PLP) #1MillionDevs Hackathon. It is **not affiliated with, endorsed by, or sponsored by Microsoft**. All questions are original and written based on the public AZ-900 skills outline available on Microsoft Learn.

A Smart Quiz Builder and Readiness Tracker designed to help learners prepare for the Microsoft Azure Fundamentals (AZ-900) exam. Built from my own learning journey, it focuses on explaining the _"why"_ behind every answer and telling learners exactly what to study next.

## 🔗 Live Links

- **Live Application:** [link](https://github.com/kariuki-james/unofficial-az900-exam-preparation-tool)
- **Backend API (Render):** [link](https://unofficial-az900-exam-preparation-tool.onrender.com)
- **API Documentation (Swagger UI):** [link](https://unofficial-az900-exam-preparation-tool.onrender.com/docs)

## ✨ Features

- **Smart Quiz Builder:** Instant visual feedback (green/red) with clear explanations for every answer.
- **Readiness Tracker:** An animated dashboard that breaks down scores by AZ-900 topic (Cloud Concepts, Architecture, Governance).
- **Actionable Next Steps:** The app automatically identifies the learner's weakest topic and recommends what to study next.
- **"Vibe" UI:** A clean, mobile-friendly interface built with Tailwind CSS, featuring smooth transitions, dark mode, and a confetti celebration upon completion.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Canvas Confetti
- **Backend:** Python 3, FastAPI, Uvicorn, Pydantic
- **Deployment:** Vercel (Frontend) & Render (Backend)
- **AI Coding Tools Used:** Opencode, DeepSeek coding agent

---

## 🧠 Prompt Engineering Strategy (20% Judging Criteria)

I did not rely on vague, one-sentence prompts. Instead, I treated the AI as a junior developer, using a strict **"Role → Context → Exact Task → Constraints → Output Format"** framework. This ensured the AI generated production-ready code that fit the specific architecture.

Here is a breakdown of how I engineered the four core prompts that built this app:

### Prompt 1: Backend Scaffold & Content Generation

- **The Goal:** Create the FastAPI backend and generate 24 original AZ-900 questions.
- **The Strategy:** I assigned the AI the role of a "Senior Python Backend Developer" and provided the exact topic weightings from the Microsoft Learn outline.
- **Key Constraints Used:**
  - _"Do NOT add a database."_ (Prevented over-engineering).
  - _"Do NOT copy real exam questions."_ (Ensured compliance).
- **Result:** A fully functional FastAPI backend with zero manual debugging required.

### Prompt 2: Interactive Quiz UI (The "Wow" Factor)

- **The Goal:** Build the React frontend with instant green/red feedback.
- **The Strategy:** I specified the exact state management required using TypeScript (`state: "idle" | "correct" | "wrong"`).
- **Key Constraints Used:**
  - _"Use Tailwind CSS classes for all styling."_
  - _"Every clickable card must have a `transition-all duration-300` class."_
- **Result:** A highly responsive, polished UI that felt like a native app.

### Prompt 3: Data-Driven Readiness Dashboard

- **The Goal:** Build the results page with an animated progress ring.
- **The Strategy:** I told the AI to use SVG for the progress ring and calculate bar colors based on conditional logic (green > 75%, red < 50%).
- **Key Constraints Used:**
  - _"All numbers must come from the backend API. Do not hard-code percentages."_
  - _"Fire canvas-confetti when ResultsPage first loads."_
- **Result:** A dynamic, celebratory dashboard that instantly communicates learning value.

### Prompt 4: Production Polish & Edge Cases

- **The Goal:** Harden the app for deployment and add loading states.
- **The Strategy:** I asked the AI to "do a final quality pass before a hackathon submission" and listed specific edge cases.
- **Key Constraints Used:**
  - _"Add a visible banner: Unofficial study tool. Not affiliated with Microsoft."_
  - _"If the backend is unreachable, show a friendly message with a Try Again button."_
- **Result:** A resilient application that handles network failures gracefully.

---

## 💻 How to Run Locally

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- Git

### 1. Clone the Repository

Open your terminal and run:
`git clone https://github.com/kariuki-james/unofficial-az900-exam-preparation-tool.git`
`cd unofficial-az900-exam-preparation-tool`

### 2. Setup the Backend (FastAPI)

Open a terminal and run the following commands:

Navigate to the backend folder:
`cd backend`

Create a virtual environment:
`python -m venv venv`

Activate the virtual environment:
On Windows: `venv\Scripts\activate`
On Mac/Linux: `source venv/bin/activate`

Install dependencies:
`pip install -r requirements.txt`

Run the development server:
`uvicorn app.main:app --reload --port 8000`
_The backend will run at http://localhost:8000_

### 3. Setup the Frontend (React)

Open a **new terminal window** and run:

Navigate to the frontend folder:
`cd frontend`

Install dependencies:
`npm install`

Start the Vite development server:
`npm run dev`
_The frontend will run at http://localhost:5173_

---

## ⚙️ Environment Variables

If you are deploying this yourself, you must set the following environment variables:

**On Render (Backend):**
`ALLOWED_ORIGINS`: Your Vercel URL (e.g., https://your-app.vercel.app,http://localhost:5173)

**On Vercel (Frontend):**
`VITE_API_BASE_URL`: Your Render backend URL (e.g., https://your-api.onrender.com)
