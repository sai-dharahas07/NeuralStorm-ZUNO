
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStudentProgress } from "../services/backendApi";
import "./ProgressTracking.css";
import {getLessons} from "../data/contract";

export default function ProgressTracking() {
  const navigate = useNavigate();
  const [backendProgress, setBackendProgress] = useState(null);
  const [backendStatus, setBackendStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    getStudentProgress()
      .then((data) => { if (active) { setBackendProgress(data); setBackendStatus("connected"); } })
      .catch(() => { if (active) setBackendStatus("offline"); });
    return () => { active = false; };
  }, []);

  const diagnostic = JSON.parse(sessionStorage.getItem("neuralstorm_diagnostic_result") || localStorage.getItem("neuralstorm_diagnostic_result") || "{}");

  const completedLessons = JSON.parse(sessionStorage.getItem("neuralstorm_completed_lessons") || localStorage.getItem("neuralstorm_completed_lessons") || "[]");
  const practice = JSON.parse(localStorage.getItem("neuralstorm_practice_result") || "null");

  const diagnosticScore = diagnostic.percentage ?? 0;
  const lessonCatalog=getLessons();
  const totalLessons = lessonCatalog.length;
  const lessonsCompleted = completedLessons.filter(id=>lessonCatalog.some(lesson=>lesson.id===id)).length;

  const lessonProgress = Math.round(
    (lessonsCompleted / totalLessons) * 100
  );

  return (
    <div className="progress-page">
      <header className="progress-header">
        
        <button onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
        <span> Progress</span>
      </header>

      <main className="progress-main">
        <section className="progress-welcome">
          <p className="progress-label">YOUR ACHIEVEMENTS</p>
          <h1>Your Learning Progress 📊</h1>
          <p>
            Every little step matters. Look how far you've come!
          </p>
        </section>

        <section className="progress-section" aria-live="polite">
          <h2>Saved learning progress</h2>
          {backendStatus === "loading" && <p>Loading your saved progress from the backend…</p>}
          {backendStatus === "offline" && <p>The backend is not available right now. Showing progress saved on this device.</p>}
          {backendStatus === "connected" && <p>
            Connected to the backend: {backendProgress.total_quizzes_attempted} quiz attempts saved,
            {" "}{backendProgress.total_correct_answers} correct answers out of {backendProgress.total_questions_answered},
            {" "}overall accuracy {backendProgress.overall_accuracy}%.
          </p>}
        </section>

        <section className="progress-summary">
          <article className="progress-stat">
            <span>🎯</span>
            <p>Diagnostic Score</p>
            <h2>{diagnosticScore}%</h2>
          </article>

          <article className="progress-stat">
            <span>✏️</span>
            <p>Practice Score</p>
            <h2>{practice ? `${practice.score}/${practice.total}` : "—"}</h2>
          </article>

          <article className="progress-stat">
            <span>📚</span>
            <p>Lessons Completed</p>
            <h2>{lessonsCompleted}/{totalLessons}</h2>
          </article>

          <article className="progress-stat">
            <span>🌱</span>
            <p>Lesson Progress</p>
            <h2>{lessonProgress}%</h2>
          </article>
        </section>

        <section className="progress-section">
          <h2>Learning Journey</h2>

          <div className="progress-item">
            <div className="progress-item-heading">
              <span>Lessons completed</span>
              <strong>{lessonProgress}%</strong>
            </div>

            <div
              className="progress-bar"
              role="progressbar"
              aria-label="Lesson completion"
              aria-valuenow={lessonProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar-fill"
                style={{ width: `${lessonProgress}%` }}
              />
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-item-heading">
              <span>Diagnostic assessment</span>
              <strong>{diagnosticScore}%</strong>
            </div>

            <div
              className="progress-bar"
              role="progressbar"
              aria-label="Diagnostic score"
              aria-valuenow={diagnosticScore}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar-fill diagnostic-fill"
                style={{ width: `${diagnosticScore}%` }}
              />
            </div>
          </div>
        </section>

        <section className="progress-section">
          <h2>My Achievements 🏆</h2>

          <div className="achievement-grid">
            <article className="achievement-card">
              <span>🌟</span>
              <h3>First Assessment</h3>
              <p>Completed your diagnostic quiz</p>
              <span className="achievement-status">
                {diagnostic.total ? "Unlocked" : "Not yet unlocked"}
              </span>
            </article>

            <article className="achievement-card">
              <span>📖</span>
              <h3>First Lesson</h3>
              <p>Completed your first learning lesson</p>
              <span className="achievement-status">
                {lessonsCompleted >= 1 ? "Unlocked" : "Not yet unlocked"}
              </span>
            </article>

            <article className="achievement-card">
              <span>🎓</span>
              <h3>Learning Champion</h3>
              <p>Completed all available lessons</p>
              <span className="achievement-status">
                {lessonsCompleted >= totalLessons
                  ? "Unlocked"
                  : "Keep learning!"}
              </span>
            </article>
          </div>
        </section>

        <section className="progress-encouragement">
          <span>💜</span>
          <div>
            <h3>You're doing amazing!</h3>
            <p>
              Learning is not a race. Keep exploring, practicing, and celebrating
              your progress.
            </p>
          </div>
        </section>

        <div className="progress-actions">
          <button
            className="progress-primary"
            onClick={() => navigate("/lessons")}
          >
            Continue Learning →
          </button>

          <button
            className="progress-secondary"
            onClick={() => navigate("/practice")}
          >
            Practice Again
          </button>
        </div>
      </main>
    </div>
  );
}

