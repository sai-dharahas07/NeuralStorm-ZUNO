# ZUNO + NeuralStorm Backend: Stage 1 Integration

This package connects the existing ZUNO React frontend to the existing FastAPI backend for:
- backend health status on the student dashboard;
- saving completed diagnostic and practice quiz attempts to PostgreSQL through FastAPI;
- retrieving persisted quiz progress on the Progress page.

It does not add authentication. The generated `zuno_student_id` is a browser-local pseudonymous identifier for the hackathon integration test only. Do not treat it as proof of identity or expose these endpoints publicly without authentication and authorization.

## 1. Start the backend

Open a terminal in `backend/`:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and set `DATABASE_URL` to your Supabase PostgreSQL connection string. Keep `.env` private and never commit it.

Run:

```powershell
python -m uvicorn app.main:app --reload
```

Check:
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/health/database`
- `http://127.0.0.1:8000/docs`

## 2. Start the frontend

Open another terminal in `frontend/`:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The frontend `.env` defaults to:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If the backend is hosted elsewhere, change this value to the backend base URL and restart Vite.

## 3. Stage 1 API contract

| Method | Endpoint | Used by |
|---|---|---|
| GET | `/health` | Dashboard backend status |
| POST | `/api/v1/quiz/attempts` | Diagnostic quiz and practice quiz completion |
| GET | `/api/v1/students/{student_id}/progress` | Progress page |

Quiz attempts use the existing backend schema:
- `student_id`
- `quiz_id`
- `score` (percentage from 0 to 100)
- `total_questions`
- `correct_answers`
- `difficulty_level`
- `answers` (JSON array)

The student identifier is generated once per browser and stored in `localStorage` as `zuno_student_id`.

## 4. Manual integration test

1. Start FastAPI and confirm `/health` returns HTTP 200.
2. Start the frontend and open the student dashboard. It should show `Backend: connected`.
3. Complete the diagnostic quiz.
4. Open FastAPI Swagger at `/docs`, or inspect Supabase `quiz_attempts`, to confirm a `diagnostic-maths-v1` record was saved.
5. Complete the Practice Zone quiz and confirm a `practice-maths-v1` record was saved.
6. Open ZUNO's Progress page. It should show the number of attempts and accuracy retrieved from the backend.
7. Stop the backend and refresh the dashboard. It should show `Backend: offline`; the frontend's local progress display remains available.

## 5. Important boundaries

- The Machine Learning AI evaluation endpoint is intentionally not connected to the Maths diagnostic. The frontend's current diagnostic uses five Maths questions, while the AI engine question bank is Machine Learning.
- Teacher-created tests, teacher marks, lesson completion, and admin/teacher management remain local to the browser in this stage.
- The current student endpoints do not authenticate users. Before public deployment, add authentication, enforce student ownership, and enable appropriate Supabase Row Level Security.
- For a deployed frontend, add its exact origin to `FRONTEND_ORIGINS` in the backend environment, separated by commas. Do not use `*` for a credentialed production setup.
