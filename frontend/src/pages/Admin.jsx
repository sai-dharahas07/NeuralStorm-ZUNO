
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Workspace.css";

const keys = [
  "zuno_teachers",
  "zuno_test_submissions",
  "neuralstorm_disabilities",
  "neuralstorm_learning_preferences",
  "neuralstorm_diagnostic_result",
  "neuralstorm_practice_result",
  "neuralstorm_completed_lessons",
  "neuralstorm_reading_settings",
  "zuno_large_text",
  "zuno_high_contrast",
  "zuno_visual_mode",
  "zuno_language",
  "zuno_custom_lessons",
  "zuno_custom_tests",
  "zuno_learner_plans"
];

const lessons = [
  {
    title: "Introduction to Machine Learning",
    body: "Machine Learning is a branch of Artificial Intelligence. It allows computers to learn patterns from data and make predictions.",
    visual: "Step 1 · Collect data. Step 2 · Find patterns. Step 3 · Make predictions.",
    interactive: "Your turn: explain how a computer could learn to identify spam emails."
  },
  {
    title: "Types of Machine Learning",
    body: "Supervised learning uses labelled data. Unsupervised learning finds patterns in unlabelled data. Reinforcement learning learns through rewards and penalties.",
    visual: "Explore three approaches: Supervised Learning, Unsupervised Learning and Reinforcement Learning.",
    interactive: "Your turn: identify which learning type uses labelled examples."
  },
  {
    title: "Understanding Training Data",
    body: "Training data is information used to teach a Machine Learning model. The model identifies patterns and uses them to make predictions on new data.",
    visual: "Training data → Learning patterns → Trained model → Prediction.",
    interactive: "Your turn: give an example of data that could train an image recognition model."
  },
  {
    title: "Introduction to Model Evaluation",
    body: "Model evaluation measures how well a Machine Learning model performs. Accuracy measures the proportion of predictions that are correct.",
    visual: "Predictions → Compare with actual results → Measure performance.",
    interactive: "Your turn: why should we test a model using data it has not seen before?"
  }
];

const allowedDisabilities = ["dyslexia", "adhd", "visual", "hearing", "none"];

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function Admin() {
  const nav = useNavigate();

  const [lesson, setLesson] = useState(0);
  const [style, setStyle] = useState("visual");
  const [difficulty, setDifficulty] = useState("beginner");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [raw, setRaw] = useState("");

  const [teachers, setTeachers] = useState(() =>
    readArray("zuno_teachers")
  );

  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("Machine Learning");

  const supports = readArray("neuralstorm_disabilities");
  const count = id => supports.filter(x => x === id).length;

  const saveTeachers = next => {
    setTeachers(next);
    localStorage.setItem("zuno_teachers", JSON.stringify(next));
  };

  const addTeacher = () => {
    if (!teacherName.trim() || !teacherEmail.trim()) {
      setError("Enter the teacher name and email.");
      return;
    }

    if (
      teachers.some(
        t => t.email.toLowerCase() === teacherEmail.trim().toLowerCase()
      )
    ) {
      setError("A teacher with this email already exists.");
      return;
    }

    saveTeachers([
      ...teachers,
      {
        id: Date.now(),
        name: teacherName.trim(),
        email: teacherEmail.trim(),
        subject: teacherSubject,
        createdAt: new Date().toISOString()
      }
    ]);

    setTeacherName("");
    setTeacherEmail("");
    setError("");
    setNotice("Teacher added to this teacher roster.");
  };

  const removeTeacher = id => {
    if (window.confirm("Remove this teacher from the teacher roster?")) {
      saveTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const snapshot = () =>
    Object.fromEntries(
      keys
        .filter(k => localStorage.getItem(k) !== null)
        .map(k => {
          const value = localStorage.getItem(k);
          try {
            return [k, JSON.parse(value)];
          } catch {
            return [k, value];
          }
        })
    );

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify(snapshot(), null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "zuno-project-snapshot.json";
    a.click();

    URL.revokeObjectURL(url);
    setNotice("Project data exported.");
  };

  const valid = o => {
    if (!o || typeof o !== "object" || Array.isArray(o)) {
      return false;
    }

    const isObject = value =>
      value === undefined ||
      (value !== null && typeof value === "object" && !Array.isArray(value));

    const enumFields = (obj, allowed) => {
      if (obj === undefined) return true;
      if (!isObject(obj)) return false;

      return Object.entries(obj).every(
        ([key, value]) =>
          !allowed[key] || allowed[key].includes(value)
      );
    };

    const teachersData = o.zuno_teachers;
    const submissions = o.zuno_test_submissions;
    const disabilities = o.neuralstorm_disabilities;
    const preferences = o.neuralstorm_learning_preferences;
    const diagnostic = o.neuralstorm_diagnostic_result;
    const practice = o.neuralstorm_practice_result;
    const completed = o.neuralstorm_completed_lessons;
    const reading = o.neuralstorm_reading_settings;

    if (
      disabilities !== undefined &&
      (
        !Array.isArray(disabilities) ||
        disabilities.some(x => !allowedDisabilities.includes(x))
      )
    ) return false;

    if (
      !enumFields(preferences, {
        learningStyle: ["visual", "reading", "audio", "interactive"],
        difficulty: ["beginner", "intermediate", "advanced"],
        pace: ["slow", "normal", "fast"],
        sound: [true, false]
      })
    ) return false;

    if (
      !enumFields(reading, {
        dyslexiaFont: [true, false],
        letterSpacing: ["normal", "wide", "extra-wide"],
        lineSpacing: ["normal", "comfortable", "relaxed"],
        readingBackground: ["normal", "cream", "soft-blue"]
      })
    ) return false;

    if (
      diagnostic !== undefined &&
      (
        !isObject(diagnostic) ||
        !Number.isFinite(diagnostic.score) ||
        !Number.isFinite(diagnostic.total) ||
        !Number.isFinite(diagnostic.percentage) ||
        !["Beginner", "Intermediate", "Advanced"].includes(diagnostic.level)
      )
    ) return false;

    if (
      practice !== undefined &&
      (
        !isObject(practice) ||
        !Number.isFinite(practice.score) ||
        !Number.isFinite(practice.total) ||
        !Number.isFinite(practice.percentage)
      )
    ) return false;

    if (
      completed !== undefined &&
      (
        !Array.isArray(completed) ||
        completed.some(x => ![1, 2, 3, 4].includes(x))
      )
    ) return false;

    if (
      o.zuno_language !== undefined &&
      !["en", "te", "hi"].includes(o.zuno_language)
    ) return false;

    if (
      o.zuno_large_text !== undefined &&
      ![true, false, "true", "false"].includes(o.zuno_large_text)
    ) return false;

    if (
      o.zuno_high_contrast !== undefined &&
      ![true, false, "true", "false"].includes(o.zuno_high_contrast)
    ) return false;

    if (
      o.zuno_visual_mode !== undefined &&
      ![true, false, "true", "false"].includes(o.zuno_visual_mode)
    ) return false;

    if (
      o.zuno_custom_lessons !== undefined &&
      (
        !Array.isArray(o.zuno_custom_lessons) ||
        o.zuno_custom_lessons.some(
          x => !x || typeof x.title !== "string" || typeof x.body !== "string"
        )
      )
    ) return false;

    if (
      o.zuno_custom_tests !== undefined &&
      (
        !Array.isArray(o.zuno_custom_tests) ||
        o.zuno_custom_tests.some(
          x => !x || typeof x.title !== "string" || !Array.isArray(x.questions)
        )
      )
    ) return false;

    if (
      teachersData !== undefined &&
      (
        !Array.isArray(teachersData) ||
        teachersData.some(
          x => !x || typeof x.name !== "string" || typeof x.email !== "string"
        )
      )
    ) return false;

    if (
      submissions !== undefined &&
      (
        !Array.isArray(submissions) ||
        submissions.some(
          x =>
            !x ||
            typeof x.testTitle !== "string" ||
            !Number.isFinite(Number(x.score))
        )
      )
    ) return false;

    return true;
  };

  const importData = () => {
    try {
      const o = JSON.parse(raw);

      if (!valid(o)) {
        throw Error("Snapshot contains unsupported data or preference values.");
      }

      Object.entries(o).forEach(([k, v]) => {
        if (keys.includes(k)) {
          const value = k === "zuno_language"
            ? String(v)
            : JSON.stringify(v);

          localStorage.setItem(k, value);

          if (
            k === "neuralstorm_diagnostic_result" ||
            k === "neuralstorm_completed_lessons"
          ) {
            sessionStorage.setItem(k, value);
          }
        }
      });

      setError("");
      setNotice("Snapshot imported successfully.");
    } catch (e) {
      setError(e.message || "Invalid JSON. Nothing was changed.");
      setNotice("");
    }
  };

  const restore = () => {
    if (
      !window.confirm(
        "Clear locally stored project data and return to the landing page?"
      )
    ) return;

    [...Array(localStorage.length)]
      .map((_, i) => localStorage.key(i))
      .filter(k => k && (k.startsWith("neuralstorm_") || k.startsWith("zuno_")))
      .forEach(k => localStorage.removeItem(k));

    [...Array(sessionStorage.length)]
      .map((_, i) => sessionStorage.key(i))
      .filter(k => k && (k.startsWith("neuralstorm_") || k.startsWith("zuno_")))
      .forEach(k => sessionStorage.removeItem(k));

    document.documentElement.classList.remove(
      "large-text",
      "high-contrast",
      "visual-accessibility"
    );

    document.body.classList.remove("high-contrast");
    document.documentElement.removeAttribute("data-dyslexia-font");
    document.documentElement.removeAttribute("data-letter-spacing");
    document.documentElement.removeAttribute("data-line-spacing");
    document.documentElement.removeAttribute("data-reading-background");

    nav("/");
  };

  const flags = [
    [
      "Large text",
      document.documentElement.classList.contains("large-text") ||
        localStorage.getItem("zuno_large_text") === "true"
    ],
    [
      "High contrast",
      document.body.classList.contains("high-contrast") ||
        localStorage.getItem("zuno_high_contrast") === "true"
    ],
    [
      "Visual mode",
      document.documentElement.classList.contains("visual-accessibility") ||
        localStorage.getItem("zuno_visual_mode") === "true"
    ],
    ["Dyslexia font", document.documentElement.dataset.dyslexiaFont === "true"],
    [
      "Wide spacing",
      ["wide", "extra-wide"].includes(
        document.documentElement.dataset.letterSpacing
      )
    ],
    [
      "Reading background",
      !!document.documentElement.dataset.readingBackground
    ],
    ["Transcript", true]
  ];

  const currentLesson = lessons[lesson];

  return (
    <div className="workspace">
      <aside className="work-side">
        <Link className="work-brand" to="/">
          ZUNO<span></span>
        </Link>

        <p className="side-caption">ADMIN SPACE</p>

        <nav>
          <Link to="/admin" className="active">Control room</Link>
          <Link to="/dashboard">Student view</Link>
          <Link to="/lessons">Lesson library</Link>
        </nav>

        <div className="side-note">
          A clear view of the learning system.
        </div>
      </aside>

      <main className="work-main">
        <header className="work-top">
          <div>
            <span className="kicker">SYSTEM OVERVIEW</span>
            <h1>Admin control room</h1>
            <p>
              Manage platform settings, inspect content and check accessibility.
            </p>
          </div>

          <span className="pill">Backend integration workspace</span>
        </header>

        <section className="work-panel">
          <div className="panel-heading">
            <div>
              <span className="kicker">STAFF MANAGEMENT</span>
              <h2>Add or remove teachers</h2>
              <p>
                Teacher roster integration is ready for authenticated backend
                administration.
              </p>
            </div>
          </div>

          <div className="teacher-form">
            <label>
              Teacher name
              <input
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                placeholder="Teacher name"
              />
            </label>

            <label>
              Teacher email
              <input
                type="email"
                value={teacherEmail}
                onChange={e => setTeacherEmail(e.target.value)}
                placeholder="teacher@school.edu"
              />
            </label>

            <label>
              Subject / department
              <input
                value={teacherSubject}
                onChange={e => setTeacherSubject(e.target.value)}
              />
            </label>

            <button className="btn-primary" onClick={addTeacher}>
              Add teacher
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="teacher-managed-list">
            {teachers.length === 0 ? (
              <p>No teachers added yet.</p>
            ) : (
              teachers.map(t => (
                <article key={t.id}>
                  <div>
                    <b>{t.name}</b>
                    <small>{t.email} · {t.subject}</small>
                  </div>

                  <button
                    className="btn-danger"
                    onClick={() => removeTeacher(t.id)}
                  >
                    Remove
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="admin-grid">
          <article className="admin-tile">
            <small>SUPPORT CHOICES</small>
            <strong>{supports.length}</strong>
            <span>Chosen by the learner in this browser</span>
          </article>

          <article className="admin-tile">
            <small>LESSON LIBRARY</small>
            <strong>{lessons.length.toString().padStart(2, "0")}</strong>
            <span>Machine Learning learning modules</span>
          </article>

          <article className="admin-tile">
            <small>DATA CONTRACT</small>
            <strong>{keys.length}</strong>
            <span>Supported storage keys</span>
          </article>
        </section>

        <section className="work-panel">
          <div className="panel-heading">
            <div>
              <span className="kicker">DATA HANDOFF</span>
              <h2>Snapshot import & export</h2>
              <p>
                Export or import the current locally stored project
                configuration.
              </p>
            </div>
          </div>

          <div className="admin-actions">
            <button className="btn-primary" onClick={exportData}>
              Export JSON snapshot
            </button>

            <label className="btn-secondary">
              Import JSON file
              <input
                type="file"
                accept=".json,application/json"
                onChange={e => {
                  const f = e.target.files?.[0];

                  if (f) {
                    const r = new FileReader();
                    r.onload = () => setRaw(String(r.result));
                    r.readAsText(f);
                  }
                }}
              />
            </label>

            <button className="btn-secondary" onClick={importData}>
              Validate & import
            </button>
          </div>

          <textarea
            className="json-input"
            value={raw}
            onChange={e => setRaw(e.target.value)}
            placeholder="Choose a JSON file or paste a snapshot here..."
            aria-label="JSON snapshot contents"
          />

          {error && <p className="error-text">{error}</p>}
          {notice && <p className="success-text">{notice}</p>}
        </section>

        <section className="work-panel">
          <div className="panel-heading">
            <div>
              <span className="kicker">CONTENT STUDIO</span>
              <h2>Preview a lesson in different formats</h2>
              <p>
                Explore Machine Learning lessons using different learning
                styles and difficulty settings.
              </p>
            </div>
          </div>

          <div className="studio-controls">
            <label>
              Lesson
              <select
                value={lesson}
                onChange={e => setLesson(Number(e.target.value))}
              >
                {lessons.map((item, i) => (
                  <option key={item.title} value={i}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Learning style
              <select
                value={style}
                onChange={e => setStyle(e.target.value)}
              >
                {["visual", "reading", "audio", "interactive"].map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </label>

            <label>
              Difficulty
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                {["beginner", "intermediate", "advanced"].map(x => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="content-preview">
            <span className="format-label">
              {style} FORMAT · {difficulty}
            </span>

            <h3>{currentLesson.title}</h3>

            <p>
              {style === "visual"
                ? currentLesson.visual
                : style === "interactive"
                ? currentLesson.interactive
                : style === "audio"
                ? `Read-along transcript: ${currentLesson.body}`
                : currentLesson.body}
            </p>
          </div>

          <div className="style-matrix">
            {["visual", "reading", "audio", "interactive"].map(x => (
              <button
                className={style === x ? "chosen" : ""}
                key={x}
                onClick={() => setStyle(x)}
              >
                {x}
              </button>
            ))}
          </div>
        </section>

        <section className="work-panel">
          <div className="panel-heading">
            <div>
              <span className="kicker">ADAPTATION RULES</span>
              <h2>Decision rules</h2>
              <p>Read-only reference for the current learning rules.</p>
            </div>
          </div>

          <div className="rules-grid">
            <div>
              <b>80% and above</b>
              <span>Advanced level</span>
            </div>

            <div>
              <b>40% to 79%</b>
              <span>Intermediate level</span>
            </div>

            <div>
              <b>Below 40%</b>
              <span>Beginner level</span>
            </div>

            <div>
              <b>Speech pace</b>
              <span>Slow 0.8 · Normal 0.95 · Fast 1.1</span>
            </div>

            <div>
              <b>Layout support</b>
              <span>
                Dyslexia: font and spacing · ADHD: one idea · Visual:
                large text and contrast · Hearing: transcript
              </span>
            </div>
          </div>
        </section>

        <section className="work-panel">
          <div className="panel-heading">
            <div>
              <span className="kicker">ACCESSIBILITY AUDIT</span>
              <h2>Live document status</h2>
              <p>
                Current page settings and available transcript support.
              </p>
            </div>
          </div>

          <div className="status-list">
            {flags.map(([name, on]) => (
              <div key={name}>
                <span>{name}</span>
                <b className={on ? "status-on" : "status-off"}>
                  {on ? "Active" : "Not active"}
                </b>
              </div>
            ))}
          </div>
        </section>

        <section className="work-panel">
          <div className="panel-heading">
            <div>
              <span className="kicker">LEARNER CHOICES</span>
              <h2>Self-selected support counts</h2>
              <p>
                Chosen by the learner. These are preferences, not diagnoses.
              </p>
            </div>
          </div>

          <div className="support-counts">
            {allowedDisabilities.map(x => (
              <div key={x}>
                <span>{x}</span>
                <strong>{count(x)}</strong>
              </div>
            ))}
          </div>

          <p className="fairness-note">
            Format follows what the learner chose and how they scored,
            not a diagnosis.
          </p>
        </section>

        <section className="work-panel danger-panel">
          <div>
            <span className="kicker">LOCAL DATA RESET</span>
            <h2>Clear local project data</h2>
            <p>
              Clears only keys beginning with neuralstorm_ or zuno_
              from local and session storage.
            </p>
          </div>

          <button className="btn-danger" onClick={restore}>
            Clear local data & return home
          </button>
        </section>
      </main>
    </div>
  );
}
