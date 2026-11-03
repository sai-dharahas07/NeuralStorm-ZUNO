
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DiagnosticQuiz.css";
import { useLanguage, t } from "../i18n";

import {
  getStudentId,
  getMLDiagnosticQuestions,
  evaluateMLDiagnostic,
  saveQuizAttempt,
} from "../services/backendApi";

export default function DiagnosticQuiz() {
  const navigate = useNavigate();
  const lang = useLanguage();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load ML questions from the backend
  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      try {
        setLoading(true);
        setError("");

        const response = await getMLDiagnosticQuestions();

        if (!response.questions || response.questions.length === 0) {
          throw new Error("No Machine Learning questions were returned.");
        }

        if (!cancelled) {
          setQuestions(response.questions);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load questions.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAnswer = (option) => {
    const question = questions[currentQuestion];

    setAnswers((previous) => ({
      ...previous,
      [question.id]: option,
    }));
  };

  // Convert the selected frontend preferences into backend values
  const getLearningPreferences = () => {
    let preferences = {};

    try {
      preferences = JSON.parse(
        localStorage.getItem("neuralstorm_learning_preferences") || "{}"
      );
    } catch {
      preferences = {};
    }

    const formatMap = {
      visual: "visual",
      reading: "text",
      audio: "audio",
      interactive: "visual",
    };

    const languageMap = {
      en: "English",
      te: "Telugu",
      hi: "Hindi",
    };

    const selectedLanguage = localStorage.getItem("zuno_language") || "en";

    return {
      preferred_format: formatMap[preferences.learningStyle] || "visual",
      preferred_pace: ["slow", "normal", "fast"].includes(preferences.pace)
        ? preferences.pace
        : "normal",
      language: languageMap[selectedLanguage] || "English",
    };
  };

  // Convert accessibility selections into backend requirements
  const getAccessibilityRequirements = () => {
    let disabilities = [];

    try {
      disabilities = JSON.parse(
        localStorage.getItem("neuralstorm_disabilities") || "[]"
      );
    } catch {
      disabilities = [];
    }

    return {
      disability_type: disabilities.filter(
        (item) => item !== "none"
      ),
      needs_simplified_text: disabilities.includes("dyslexia"),
      needs_audio_support: false,
      needs_high_contrast: disabilities.includes("visual"),
    };
  };

  const handleNext = async () => {
    const question = questions[currentQuestion];

    if (!answers[question.id]) {
      alert(t("selectAnswer"));
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      return;
    }

    // Prevent repeated submissions
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setError("");

    try {
      const aiResponse = await evaluateMLDiagnostic({
        student_id: getStudentId(),
        topic: "Machine Learning",
        quiz_answers: answers,
        learning_preferences: getLearningPreferences(),
        accessibility: getAccessibilityRequirements(),
      });

      const diagnostic = aiResponse.diagnostic;
      const adaptive = aiResponse.adaptive;

      const finalResult = {
        score: diagnostic.correct_answers,
        total: diagnostic.total_questions,
        percentage: diagnostic.score_percentage,
        level: diagnostic.learning_level,
        recommendedDifficulty: adaptive.recommended_difficulty,
        reason: adaptive.reason,
        recommendations: aiResponse.personalized_recommendations,
        accessibilitySupport: aiResponse.accessibility_support,
      };

      // Preserve existing frontend result storage
      localStorage.setItem(
        "neuralstorm_diagnostic_result",
        JSON.stringify(finalResult)
      );

      sessionStorage.setItem(
        "neuralstorm_diagnostic_result",
        JSON.stringify(finalResult)
      );

      setResult(finalResult);

      // Preserve existing quiz history and progress integration
      try {
        await saveQuizAttempt({
          quiz_id: "diagnostic-machine-learning-v1",
          score: diagnostic.score_percentage,
          total_questions: diagnostic.total_questions,
          correct_answers: diagnostic.correct_answers,
          difficulty_level: adaptive.recommended_difficulty,
          answers: questions.map((item) => ({
            question_id: item.id,
            selected_answer: answers[item.id] || null,
          })),
        });

        setSaveStatus("saved");
      } catch (saveError) {
        console.error("Supabase quiz history save failed:", saveError);
        setSaveStatus("failed");
      }
    } catch (err) {
      console.error("AI evaluation failed:", err);
      setError(err.message || "AI evaluation failed. Please try again.");
      setSaveStatus("idle");
    }
  };

  // Loading screen
  if (loading) {
    return (
      <main className="diagnostic-page">
        <section className="diagnostic-card">
          <h1>Machine Learning Assessment</h1>
          <p>Loading your questions...</p>
        </section>
      </main>
    );
  }

  // Error screen
  if (error && questions.length === 0) {
    return (
      <main className="diagnostic-page">
        <section className="diagnostic-card">
          <h1>Unable to load assessment</h1>
          <p role="alert">{error}</p>
          <button
            className="diagnostic-next"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  // Assessment completed screen
  if (result) {
    return (
      <main className="diagnostic-page">
        <section className="diagnostic-card">
          <h1>🎉 {t("assessmentDone")}</h1>

          <h2>
            {t("score")}: {result.score}/{result.total}
          </h2>

          <p>
            {result.percentage}% {t("correctAnswers")}
          </p>

          <p>
            {t("recommendedLevel")}: <strong>{result.level}</strong>
          </p>

          <p>
            Recommended difficulty:{" "}
            <strong>{result.recommendedDifficulty}</strong>
          </p>

          <p>{result.reason}</p>

          <h3>Personalized recommendations</h3>

          <ul>
            {result.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>

          <h3>Accessibility support</h3>

          <ul>
            {Object.entries(result.accessibilitySupport).map(
              ([key, value]) => (
                <li key={key}>
                  {key.replaceAll("_", " ")}:{" "}
                  {value ? "Enabled" : "Disabled"}
                </li>
              )
            )}
          </ul>

          <p role="status" aria-live="polite">
            {saveStatus === "saving" && "Saving your result..."}
            {saveStatus === "saved" && "Your result has been saved."}
            {saveStatus === "failed" &&
              "AI evaluation succeeded, but quiz history could not be saved separately."}
          </p>

          <button
            className="diagnostic-next"
            onClick={() => navigate("/dashboard")}
          >
            {t("goDashboard")} →
          </button>
        </section>
      </main>
    );
  }

  const question = questions[currentQuestion];

  if (!question) return null;

  return (
    <main className="diagnostic-page">
      <section className="diagnostic-card">
        <h1>🧠 Machine Learning Assessment</h1>

        <p>
          {t("question")} {currentQuestion + 1} / {questions.length}
        </p>

        <div className="diagnostic-progress">
          <div
            style={{
              width: `${
                ((currentQuestion + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>

        <p>
          Difficulty: <strong>{question.difficulty}</strong>
        </p>

        <h2>{question.question}</h2>

        <div className="diagnostic-options">
          {Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              className={answers[question.id] === key ? "selected" : ""}
              onClick={() => handleAnswer(key)}
              aria-pressed={answers[question.id] === key}
            >
              <strong>{key}.</strong> {value}
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="diagnostic-error">
            {error}
          </p>
        )}

        <button
          className="diagnostic-next"
          onClick={handleNext}
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving"
            ? "Evaluating..."
            : currentQuestion === questions.length - 1
              ? t("finishAssessment")
              : `${t("nextQuestion")} →`}
        </button>
      </section>
    </main>
  );
}
