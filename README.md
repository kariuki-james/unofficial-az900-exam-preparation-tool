# AZ-900 Unofficial Study Tool

An unofficial AZ-900 exam preparation app with an original 24-question practice quiz covering Cloud Concepts, Azure Architecture and Services, and Azure Management and Governance. The quiz gives instant answer feedback and explanations, then shows a readiness score with a topic-by-topic breakdown and a suggestion for what to study next. Progress is stored in memory on the backend and resets when the server restarts.

## Tech stack

- **Backend:** Python, FastAPI, Pydantic, Uvicorn
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, canvas-confetti
- **Data:** In-memory Python dictionary (no database)

## How to run locally

1. **Start the backend** in one terminal:
   ```bash
   cd backend
   python -m venv .venv
   .venv/bin/pip install fastapi uvicorn
   .venv/bin/python -m app.main
   ```

2. **Start the frontend** in a second terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open the app** at [http://localhost:5173](http://localhost:5173). The API runs at [http://localhost:8000](http://localhost:8000), and interactive API docs are available at [http://localhost:8000/docs](http://localhost:8000/docs).

The backend allows requests from port 5173 by default, so keep Vite on that port.

## Screenshots

| Quiz | Results |
| --- | --- |
| _Placeholder: add `docs/screenshots/quiz.png`_ | _Placeholder: add `docs/screenshots/results.png`_ |

## Unofficial notice

This project is unofficial and is not affiliated with, endorsed by, or sponsored by Microsoft. All quiz questions are original and were written for this project; they are based only on the publicly available AZ-900 skills outline. Microsoft, Azure, and AZ-900 are trademarks of Microsoft Corporation. No Microsoft logos are used in this project.
