# Neural Storm 2026 API Contract

Status: Initial draft, version 0.1.0

## Base URL

Local development:
http://127.0.0.1:8000

API version prefix for application endpoints:
`/api/v1`

## 1. Health check

GET /health

Success response (200):

{
  "status": "ok",
  "service": "neural-storm-backend",
  "message": "Backend is running"
}

## 2. Root information

GET /

Returns the application name, version, documentation URL,
and health-check URL.

## 3. Planned application endpoints

These are planned contracts, not implemented endpoints yet.
All three teammates must agree on the final schemas before use.

POST /api/v1/adaptive/next-activity

Purpose:
Request a suitable next learning activity.

POST /api/v1/quiz/attempts

Purpose:
Save a completed quiz attempt.

GET /api/v1/students/{student_id}/progress

Purpose:
Retrieve persisted learning progress for an authorized student.

## Integration rules

- JSON is the default request and response format.
- Use snake_case for JSON field names.
- Validate request bodies using Pydantic models.
- Use consistent HTTP status codes and error responses.
- The frontend must call the backend, not the database directly.
- The adaptive engine must document its input and output schemas.
- Quiz attempts and progress must be persisted in PostgreSQL.
- Student progress must not be publicly accessible without
  appropriate access controls.
- Never commit secrets or real database credentials to GitHub.

Before implementation, agree on field names, types, required fields,
and error behavior with the frontend and adaptive-engine teammates.