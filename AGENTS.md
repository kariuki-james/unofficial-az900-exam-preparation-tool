# AGENTS.md

## Repo state

Working "AZ-900 Unofficial Study Tool": FastAPI backend + React 19/Vite frontend. The frontend has no router; `App.tsx` swaps `QuizPage` and `ResultsPage` via state, and "Retake Quiz" clears that state.

- The FastAPI app lives in `backend/app/api.py` (`app.api:app`). `backend/app/main.py` is only a local Uvicorn runner. Routes: `/`, `/questions`, `/answers`, `/progress`.
- Questions are 24 hardcoded dicts in `backend/app/questions.py`; keep `backend/app/schemas.py` and `frontend/src/types/index.ts` in sync when changing the shape.
- `/progress` is demo-only in-memory state keyed by hardcoded `USER_ID = "demo"`. Every `POST /answers` accumulates, including retakes; it resets when the backend restarts. No database, auth, or reset endpoint.
- `frontend/src/services/api.ts` uses `VITE_API_BASE_URL`, defaulting to `http://localhost:8000`.
- Tailwind v4 is configured via `@tailwindcss/vite` plus `@import "tailwindcss";` in `frontend/src/index.css`. Dark mode is class-based (`@custom-variant dark`, `.dark` on `<html>`, localStorage key `az900-theme`); preserve this when editing styles.
- No tests, CI, pre-commit, root `package.json`, or workspace config exist. `README.md` is hackathon-facing and has stale details (says React 18 and gives an invalid `app.main:app` command); trust `package.json` and code.

## Commands

Frontend (from `frontend/`):

- `npm install`
- `npm run dev` — Vite on 5173. Default backend CORS only permits `localhost`/`127.0.0.1:5173`; set `ALLOWED_ORIGINS` before using another port.
- `npm run lint`
- `npm run build` — `tsc -b && vite build`; this is the only typecheck. Run lint and build before finishing; both currently pass.

Backend (from `backend/`; the `app` package import requires this cwd):

- `.venv/bin/python -m app.main` — Uvicorn with reload on :8000
- `.venv/bin/uvicorn app.api:app --reload` — equivalent
- The untracked `.venv` (Python 3.14) already has dependencies; `backend/requirements.txt` is `fastapi[standard]`.
- No pytest suite: smoke-test routes with `fastapi.testclient` or `http://localhost:8000/docs`. Progress state persists for the life of the process, so use a fresh process for clean-state checks.

Deployment env:

- Backend: `ALLOWED_ORIGINS` (comma-separated; default `http://localhost:5173,http://127.0.0.1:5173`).
- Frontend: set `VITE_API_BASE_URL` at build time for the deployed API.

## Conventions

- TypeScript uses `verbatimModuleSyntax` and `erasableSyntaxOnly`: use `import type` for type-only imports. `noUnusedLocals`/`noUnusedParameters` are enabled, so unused symbols fail the build.
