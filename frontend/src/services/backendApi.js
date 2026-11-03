
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

export function getStudentId() {
  const key = "zuno_student_id";
  let studentId = localStorage.getItem(key);

  if (!studentId) {
    studentId =
      globalThis.crypto?.randomUUID?.() ||
      `student-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    localStorage.setItem(key, studentId);
  }

  return studentId;
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot reach the backend. Check that FastAPI is running and the API URL is correct."
    );
  }

  if (!response.ok) {
    let detail = `Backend request failed (${response.status}).`;

    try {
      const payload = await response.json();
      if (payload.detail) {
        detail =
          typeof payload.detail === "string" ? payload.detail : detail;
      }
    } catch {
      // Keep fallback error.
    }

    throw new Error(detail);
  }

  return response.status === 204 ? null : response.json();
}

export function checkBackendHealth() {
  return request("/health");
}

// Get all 20 Machine Learning questions
export function getMLDiagnosticQuestions() {
  return request("/api/ai/questions");
}

// Submit answers to the adaptive AI engine
export function evaluateMLDiagnostic(payload) {
  return request("/api/ai/evaluate", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      student_id: getStudentId(),
      topic: "Machine Learning",
    }),
  });
}

// Save quiz attempt in Supabase
export function saveQuizAttempt(attempt) {
  return request("/api/v1/quiz/attempts", {
    method: "POST",
    body: JSON.stringify({
      student_id: getStudentId(),
      ...attempt,
    }),
  });
}

// Retrieve student progress
export function getStudentProgress() {
  return request(
    `/api/v1/students/${encodeURIComponent(getStudentId())}/progress`
  );
}
