
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LearningPreferences.css";
import {useLanguage,t} from "../i18n";
export default function LearningPreferences() {
  const navigate = useNavigate();
  const lang=useLanguage();

  const [preferences, setPreferences] = useState({
    learningStyle: "visual",
    difficulty: "beginner",
    pace: "normal",
    sound: false,
  });

  const updatePreference = (key, value) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const continueToQuiz = () => {
    localStorage.setItem(
      "neuralstorm_learning_preferences",
      JSON.stringify(preferences)
    );

    navigate("/diagnostic-quiz");
  };

  return (
    <main className="preferences-page" data-language={lang}>
      <header>
        
        <h1>{t("customize")}</h1>
        <p>{t("chooseExperience")}</p>
      </header>

      <section className="preference-card">
        <h2>{t("learningStyle")}</h2>

        <select
          value={preferences.learningStyle}
          onChange={(e) => updatePreference("learningStyle", e.target.value)}
        >
          <option value="visual">{t("visualLearning")}</option>
          <option value="reading">{t("readingLearning")}</option>
          <option value="audio">{t("audioLearning")}</option>
          <option value="interactive">{t("interactiveLearning")}</option>
        </select>
      </section>

      <section className="preference-card">
        <h2>{t("preferredDifficulty")}</h2>

        <select
          value={preferences.difficulty}
          onChange={(e) => updatePreference("difficulty", e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </section>

      <section className="preference-card">
        <h2>{t("learningPace")}</h2>

        <select
          value={preferences.pace}
          onChange={(e) => updatePreference("pace", e.target.value)}
        >
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
      </section>

      <section className="preference-card">
        <label>
          <input
            type="checkbox"
            checked={preferences.sound}
            onChange={(e) => updatePreference("sound", e.target.checked)}
          />
          {t("enableSound")}
        </label>
      </section>

      <button className="preferences-continue" onClick={continueToQuiz}>
        {t("continueDiagnostic")} →
      </button>
    </main>
  );
}

