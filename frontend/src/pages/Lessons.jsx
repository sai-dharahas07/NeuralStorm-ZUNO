
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Lessons.css";
import {getLocalizedLessons} from "../data/contract";
import {useLanguage} from "../i18n";

export default function Lessons() {
  const navigate = useNavigate();
  const lang = useLanguage();
  const lessons = getLocalizedLessons(lang);

  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioLanguage,setAudioLanguage]=useState(lang);
  const [speechRate,setSpeechRate]=useState(0.95);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speakLesson = (lesson) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry! Your browser does not support Read Aloud.");
      return;
    }

    window.speechSynthesis.cancel();

    const spokenLesson = getLocalizedLessons(audioLanguage).find(item => String(item.id) === String(lesson.id)) || lesson;
    const text = `${spokenLesson.title}. ${(spokenLesson.body || spokenLesson.description)}. Level: ${spokenLesson.level}. Duration: ${spokenLesson.duration}.`;

    const speech = new SpeechSynthesisUtterance(text);

    const locale = ({en:"en-IN",te:"te-IN",hi:"hi-IN"})[audioLanguage] || "en-IN";
    speech.lang = locale;
    speech.rate = speechRate;
    const availableVoices = window.speechSynthesis.getVoices();
    const preferredVoice = availableVoices.find(v => v.lang.toLowerCase() === locale.toLowerCase()) || availableVoices.find(v => v.lang.toLowerCase().startsWith(audioLanguage));
    if (preferredVoice) speech.voice = preferredVoice;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };

    speech.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };

    speech.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    window.speechSynthesis.speak(speech);
  };

  const pauseSpeech = () => {
    window.speechSynthesis.pause();
    setPaused(true);
  };

  const resumeSpeech = () => {
    window.speechSynthesis.resume();
    setPaused(false);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  const markLessonComplete = (id) => {
    const read = (store) => { try { return JSON.parse(store.getItem("neuralstorm_completed_lessons") || "[]"); } catch { return []; } };
    const completed = [...new Set([...read(localStorage), ...read(sessionStorage), id])];
    localStorage.setItem("neuralstorm_completed_lessons", JSON.stringify(completed));
    sessionStorage.setItem("neuralstorm_completed_lessons", JSON.stringify(completed));
  };

  return (
    <main className="lessons-page">
      <header className="lessons-header">
        
        <div>
          <h1>📚 Your Learning Lessons</h1>
          <p>Learn at your own pace with personalized content.</p>
        </div>

        <button
          className="lessons-back-button"
          onClick={() => {
            stopSpeech();
            navigate("/dashboard");
          }}
        >
          ← Dashboard
        </button>
      </header>

      {/* Voice Accessibility Controls */}
      <section className="voice-controls" aria-label="Voice accessibility controls">
        <h2>🔊 Voice Learning</h2>
        <p>Listen in English, Telugu or Hindi. Voice availability depends on the browser and installed system voices.</p><div className="teacher-form"><label>Audio language<select value={audioLanguage} onChange={e=>setAudioLanguage(e.target.value)}><option value="en">English</option><option value="te">తెలుగు (Telugu)</option><option value="hi">हिन्दी (Hindi)</option></select></label><label>Playback speed<select value={speechRate} onChange={e=>setSpeechRate(Number(e.target.value))}><option value="0.7">0.7× Slow</option><option value="0.85">0.85×</option><option value="0.95">0.95× Normal</option><option value="1.1">1.1× Fast</option><option value="1.3">1.3×</option></select></label></div>

        {speaking && !paused && (
          <button onClick={pauseSpeech} className="voice-button">
            ⏸ Pause
          </button>
        )}

        {speaking && paused && (
          <button onClick={resumeSpeech} className="voice-button">
            ▶ Resume
          </button>
        )}

        {speaking && (
          <button onClick={stopSpeech} className="voice-button voice-stop">
            ⏹ Stop
          </button>
        )}
      </section>

      <section className="lessons-grid">
        {lessons.map((lesson) => (
          <article className="lesson-card" key={lesson.id}>
            <div className="lesson-icon">{lesson.icon}</div>

            <span className="lesson-level">{lesson.level}</span>

            <h2>{lesson.title}</h2>

            <p>{lesson.description}</p>

            <div className="lesson-footer">
              <span>⏱ {lesson.duration}</span>

              <button
                className="lesson-start-button"
                onClick={() => {
                  stopSpeech();
                  navigate("/practice");
                }}
              >
                Start Lesson →
              </button>
            </div>

            <button
              className="lesson-read-button"
              onClick={() => speakLesson(lesson)}
              aria-label={`Read aloud ${lesson.title}`}
            >
              🔊 Read Aloud
            </button>

            <button
              className="lesson-read-button"
              onClick={() => markLessonComplete(lesson.id)}
            >
              Mark lesson complete
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

