
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PracticeQuiz.css";

import { evaluateAnswer } from "../services/answerEvaluation";

import {
  getMLDiagnosticQuestions,
  evaluateMLDiagnostic,
  saveQuizAttempt,
} from "../services/backendApi";

export default function PracticeQuiz() {
  const navigate = useNavigate();

  // Teacher-created tests
  const [teacherTests] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("zuno_custom_tests") || "[]"
      );
    } catch {
      return [];
    }
  });

  // Empty selection means normal Machine Learning practice
  const [selectedTestId, setSelectedTestId] = useState("");

  const activeTest = teacherTests.find(
    (test) => String(test.id) === String(selectedTestId)
  );

  const teacherMode = Boolean(activeTest);

  // Machine Learning questions
  const [mlQuestions, setMlQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Quiz state
  const [current, setCurrent] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selected, setSelected] = useState("");
  const [written, setWritten] = useState("");

  const [feedback, setFeedback] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [aiResult, setAiResult] = useState(null);

  const [score, setScore] = useState(0);
  const [earned, setEarned] = useState(0);

  const [finished, setFinished] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Load Machine Learning questions from deployed backend
  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await getMLDiagnosticQuestions();

        if (!response?.questions?.length) {
          throw new Error("No Machine Learning questions were returned.");
        }

        if (!cancelled) {
          setMlQuestions(response.questions);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error.message || "Unable to load practice questions."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (!teacherMode) {
      loadQuestions();
    } else {
      setLoading(false);
      setLoadError("");
    }

    return () => {
      cancelled = true;
    };
  }, [teacherMode]);

  // Use teacher questions or backend questions
  const questions = teacherMode
    ? activeTest?.questions || []
    : mlQuestions;

  const question = questions[current];

  const maxMarks = questions.reduce(
    (total, item) => total + (Number(item.marks) || 1),
    0
  );

  const answeredCount = Object.keys(selectedAnswers).length;

  // Preferences expected by AIRequest
  function getAIRequestPreferences() {
    let preferences = {};
    let accessibility = {};

    try {
      preferences = JSON.parse(
        localStorage.getItem("neuralstorm_learning_preferences") || "{}"
      );
    } catch {
      preferences = {};
    }

    try {
      accessibility = JSON.parse(
        localStorage.getItem("neuralstorm_accessibility_preferences") || "{}"
      );
    } catch {
      accessibility = {};
    }

    const format = preferences.preferred_format ||
      preferences.learningStyle ||
      preferences.format ||
      "text";

    const pace = preferences.preferred_pace ||
      preferences.pace ||
      "normal";

    const language = preferences.language || "English";

    return {
      learning_preferences: {
        preferred_format: format,
        preferred_pace: pace,
        language,
      },

      accessibility: {
        disability_type: accessibility.disability_type || [],
        needs_simplified_text:
          accessibility.needs_simplified_text || false,
        needs_audio_support:
          accessibility.needs_audio_support || false,
        needs_high_contrast:
          accessibility.needs_high_contrast || false,
      },
    };
  }

  // Restart quiz
  function restart() {
    setCurrent(0);
    setSelectedAnswers({});
    setSelected("");
    setWritten("");
    setEvaluation(null);
    setAiResult(null);
    setFeedback(false);
    setScore(0);
    setEarned(0);
    setFinished(false);
    setSaveStatus("idle");
    setSubmitError("");
    setSubmitting(false);
  }

  // Check teacher-created question
  async function checkTeacherAnswer() {
    if (!written.trim()) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await evaluateAnswer({
        question: question.question,
        answer: written,
        expectedAnswer: question.answer,
        maxMarks: question.marks || 1,
        rubric: question.rubric || "",
      });

      setEvaluation(result);
      setEarned((value) => value + result.score);

      if (result.score >= (Number(question.marks) || 1)) {
        setScore((value) => value + 1);
      }

      setFeedback(true);
    } catch (error) {
      setSubmitError(error.message || "Answer evaluation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  // Store selected Machine Learning answer
  function selectMLAnswer(optionLetter) {
    if (feedback) return;

    setSelected(optionLetter);

    setSelectedAnswers((previous) => ({
      ...previous,
      [question.id]: optionLetter,
    }));
  }

  // Complete quiz and submit to AI
  async function finishQuiz() {
    setSubmitting(true);
    setSubmitError("");

    try {
      if (teacherMode) {
        const total = maxMarks;
        const value = earned;
        const percentage = Math.round((value / total) * 100);

        localStorage.setItem(
          "neuralstorm_practice_result",
          JSON.stringify({
            score: value,
            total,
            percentage,
          })
        );

        const previous = (() => {
          try {
            return JSON.parse(
              localStorage.getItem("zuno_test_submissions") || "[]"
            );
          } catch {
            return [];
          }
        })();

        localStorage.setItem(
          "zuno_test_submissions",
          JSON.stringify([
            {
              testId: activeTest.id,
              testTitle: activeTest.title,
              student: "Current browser learner",
              score: value,
              totalMarks: total,
              evaluator: evaluation?.evaluator || "Local rule-based evaluator",
              submittedAt: new Date().toISOString(),
            },
            ...previous,
          ])
        );

        setFinished(true);
        setSaveStatus("idle");
        return;
      }

      // Submit all selected answers to the actual AI engine
      const preferences = getAIRequestPreferences();

      const result = await evaluateMLDiagnostic({
        quiz_answers: selectedAnswers,
        ...preferences,
      });

      setAiResult(result);

      const diagnostic = result.diagnostic;

      const percentage = Math.round(
        diagnostic.score_percentage
      );

      // Save the evaluated result through existing backend API
      setSaveStatus("saving");

      try {
        await saveQuizAttempt({
          quiz_id: "practice-machine-learning-v1",
          score: percentage,
          total_questions: diagnostic.total_questions,
          correct_answers: diagnostic.correct_answers,
          difficulty_level:
            result.adaptive?.recommended_difficulty || "beginner",
          answers: Object.entries(selectedAnswers).map(
            ([questionId, answer]) => ({
              question_id: questionId,
              selected_answer: answer,
            })
          ),
        });

        setSaveStatus("saved");
      } catch (error) {
        console.error("Could not save practice attempt:", error);
        setSaveStatus("failed");
      }

      localStorage.setItem(
        "neuralstorm_practice_result",
        JSON.stringify({
          score: diagnostic.correct_answers,
          total: diagnostic.total_questions,
          percentage,
          learningLevel: diagnostic.learning_level,
        })
      );

      setFinished(true);
    } catch (error) {
      console.error("Practice test submission failed:", error);

      setSubmitError(
        error.message || "Unable to evaluate your answers."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Move to next question
  function next() {
    if (current < questions.length - 1) {
      setCurrent((value) => value + 1);
      setSelected("");
      setWritten("");
      setEvaluation(null);
      setFeedback(false);
      return;
    }

    finishQuiz();
  }

  // Previous question
  function previous() {
    if (current > 0) {
      setCurrent((value) => value - 1);

      if (!teacherMode) {
        const previousQuestion = questions[current - 1];
        setSelected(
          selectedAnswers[previousQuestion.id] || ""
        );
      } else {
        setWritten("");
        setEvaluation(null);
        setFeedback(false);
      }
    }
  }

  // Results page
  if (finished) {
    const diagnostic = aiResult?.diagnostic;

    const total = teacherMode
      ? maxMarks
      : diagnostic?.total_questions || questions.length;

    const value = teacherMode
      ? earned
      : diagnostic?.correct_answers || 0;

    const percent = teacherMode
      ? Math.round((value / total) * 100)
      : Math.round(diagnostic?.score_percentage || 0);

    return (
      <div className="practice-page">
        <main className="practice-result">
          <p className="practice-label">TEST COMPLETED</p>

          <h1>Well done!</h1>

          <p>
            You completed{" "}
            {activeTest?.title || "Machine Learning Practice"}.
          </p>

          <p role="status" aria-live="polite">
            {saveStatus === "saving"
              ? "Saving your result..."
              : saveStatus === "saved"
              ? "Your result has been saved to the backend."
              : saveStatus === "failed"
              ? "Your AI result is ready, but saving the practice attempt failed."
              : ""}
          </p>

          <div className="practice-score">
            <strong>{value}/{total}</strong>
            <span>{percent}% awarded</span>
          </div>

          {diagnostic && (
            <section className="practice-feedback">
              <h2>Your Learning Report</h2>

              <p>
                <b>Learning level:</b>{" "}
                {diagnostic.learning_level}
              </p>

              <p>
                <b>Answered:</b>{" "}
                {diagnostic.answered_questions}
              </p>

              <p>
                <b>Correct:</b>{" "}
                {diagnostic.correct_answers}
              </p>

              <p>
                <b>Incorrect:</b>{" "}
                {diagnostic.incorrect_answers}
              </p>

              <p>
                <b>Unanswered:</b>{" "}
                {diagnostic.unanswered_questions}
              </p>

              <p>
                <b>Recommended difficulty:</b>{" "}
                {aiResult.adaptive?.recommended_difficulty}
              </p>

              <p>{aiResult.adaptive?.reason}</p>

              <h3>Personalized Recommendations</h3>

              <ul>
                {aiResult.personalized_recommendations?.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </section>
          )}

          <button className="practice-primary" onClick={restart}>
            Try Again
          </button>

          <button
            className="practice-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </main>
      </div>
    );
  }

  // Loading screen
  if (!teacherMode && loading) {
    return (
      <div className="practice-page">
        <main className="practice-main">
          <h2>Loading Machine Learning questions...</h2>
          <p>Please wait while ZUNO prepares your practice test.</p>
        </main>
      </div>
    );
  }

  // API error screen
  if (!teacherMode && loadError) {
    return (
      <div className="practice-page">
        <main className="practice-main">
          <h1>Unable to load questions</h1>
          <p role="alert">{loadError}</p>

          <button
            className="practice-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

          <button
            className="practice-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </main>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="practice-page">
        <main className="practice-main">
          <h2>No questions available.</h2>

          <button
            className="practice-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </main>
      </div>
    );
  }

  const options = question.options
    ? Object.entries(question.options)
    : [];

  return (
    <div className="practice-page">
      {teacherTests.length > 0 && (
        <label className="teacher-test-select">
          Choose practice test

          <select
            value={selectedTestId}
            onChange={(event) => {
              setSelectedTestId(event.target.value);
              restart();
            }}
          >
            <option value="">Machine Learning Practice</option>

            {teacherTests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title}
              </option>
            ))}
          </select>
        </label>
      )}

      <header className="practice-header">
        <button
          className="practice-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <span>
          {teacherMode ? "Teacher Test" : "Machine Learning Practice"}
        </span>
      </header>

      <main className="practice-main">
        <section className="practice-intro">
          <p className="practice-label">
            LEARN BY PRACTICING
          </p>

          <h1>
            {teacherMode
              ? activeTest.title
              : "Let's Practice Machine Learning!"}
          </h1>

          <p>Take your time. You can do this!</p>
        </section>

        <section className="practice-card">
          <div className="practice-question-header">
            <span>
              Question {current + 1} of {questions.length}
            </span>

            <span>
              {teacherMode
                ? `Marks: ${earned}/${maxMarks}`
                : `Answered: ${answeredCount}/${questions.length}`}
            </span>
          </div>

          <div
            className="practice-progress-track"
            role="progressbar"
            aria-label="Quiz progress"
            aria-valuenow={current + 1}
            aria-valuemin={1}
            aria-valuemax={questions.length}
          >
            <div
              className="practice-progress-fill"
              style={{
                width: `${
                  ((current + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>

          {!teacherMode && (
            <p className="practice-label">
              Topic: {question.topic} | Difficulty: {question.difficulty}
            </p>
          )}

          <h2 className="practice-question">
            {question.question}
          </h2>

          {teacherMode ? (
            <label className="teacher-answer-field">
              Your answer

              <textarea
                rows="4"
                value={written}
                onChange={(event) => setWritten(event.target.value)}
                disabled={feedback || submitting}
                placeholder="Write your answer in your own words"
              />
            </label>
          ) : (
            <div className="practice-options">
              {options.map(([letter, optionText]) => (
                <button
                  key={letter}
                  className={`practice-option ${
                    selected === letter ? "selected" : ""
                  }`}
                  onClick={() => selectMLAnswer(letter)}
                  disabled={submitting}
                >
                  <b>{letter}.</b> {optionText}
                </button>
              ))}
            </div>
          )}

          {feedback && teacherMode && (
            <div className="practice-feedback" role="status">
              <h3>
                {evaluation?.score > 0
                  ? "Answer reviewed"
                  : "Needs teacher review"}
              </h3>

              <p>{question.explanation || ""}</p>

              {evaluation && (
                <p>
                  <b>
                    Score: {evaluation.score}/{evaluation.maxMarks}.
                  </b>{" "}
                  {evaluation.feedback}
                  <small>
                    {" "}Marked by: {evaluation.evaluator}
                  </small>
                </p>
              )}
            </div>
          )}

          {!teacherMode && (
            <p className="practice-support">
              Your answers will be evaluated by ZUNO's AI learning engine
              when you submit the test.
            </p>
          )}

          {submitError && (
            <p role="alert" className="practice-feedback">
              {submitError}
            </p>
          )}

          <div className="practice-navigation">
            <button
              className="practice-secondary"
              onClick={previous}
              disabled={current === 0 || submitting}
            >
              Previous
            </button>

            {teacherMode && !feedback ? (
              <button
                className="practice-primary"
                onClick={checkTeacherAnswer}
                disabled={!written.trim() || submitting}
              >
                {submitting ? "Checking..." : "Check Answer"}
              </button>
            ) : teacherMode ? (
              <button
                className="practice-primary"
                onClick={next}
                disabled={submitting}
              >
                {current + 1 === questions.length
                  ? "View Results"
                  : "Next Question →"}
              </button>
            ) : (
              <button
                className="practice-primary"
                onClick={next}
                disabled={!selected || submitting}
              >
                {submitting
                  ? "Evaluating..."
                  : current + 1 === questions.length
                  ? "Submit Test"
                  : "Next Question →"}
              </button>
            )}
          </div>
        </section>

        <p className="practice-support">
          Mistakes are part of learning. Keep going at your own pace.
        </p>
      </main>
    </div>
  );
}
