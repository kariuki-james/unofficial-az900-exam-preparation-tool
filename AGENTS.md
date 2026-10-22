# AGENTS.md

## Repo state

Scaffold for an "AZ-900 Unofficial Study Tool": FastAPI backend + React/Vite frontend. Many files are intentionally empty placeholders (`frontend/src/App.tsx`, `index.css`, everything under `components/`, `pages/`, `types/`). Build the app; don't assume it works.

- `frontend/src/services/api.ts` fetches `http://localhost:8000/questions`, but `backend/app/api.py` only defines `GET /`. Add the endpoint when implementing.
- `backend/requirements.txt` is empty; the untracked `backend/.venv` (Python 3.14) has FastAPI/Uvicorn installed. Do not infer dependencies from `requirements.txt`.
- Tailwind v4 is installed but not wired up: `vite.config.ts` lacks the `@tailwindcss/vite` plugin and `index.css` lacks `@import "tailwindcss";`.
- No tests, CI, pre-commit, root `package.json`, or workspace config exist.

## Commands

Frontend (from `frontend/`):

- `npm install`
- `npm run dev` — Vite on port 5173. Backend CORS only allows 5173, so don't let Vite fall back to another port.
- `npm run lint`
- `npm run build` — runs `tsc -b && vite build`; currently fails because `App.tsx` has no default export.

Backend (from `backend/`; the `app` package import requires this cwd):

- `.venv/bin/python -m app.main` — Uvicorn with reload on port 8000
- `.venv/bin/uvicorn app.api:app --reload` — equivalent
- Verify routes at `http://localhost:8000/docs`.

## Conventions

- Question data lives in `backend/app/questions.py` as dicts with `id`, `topic`, `question`, `options`, `correct_index`, `explanation`; keep the API response shape in sync with `frontend/src/types/index.ts`.
- TypeScript uses `verbatimModuleSyntax` and `erasableSyntaxOnly`: use `import type` for type-only imports. `noUnusedLocals`/`noUnusedParameters` are enabled, so build fails on unused symbols.
