
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { t, useLanguage } from '../i18n';
import { KEYS, getLessons, writeJSON } from '../data/contract';
import './Workspace.css';

export default function Teacher() {
  const lang = useLanguage();

  const [lessons, setLessons] = useState(getLessons);
  const [tests, setTests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zuno_custom_tests') || '[]');
    } catch {
      return [];
    }
  });

  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonBody, setLessonBody] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [appendTestId, setAppendTestId] = useState('');
  const [appendQuestion, setAppendQuestion] = useState('');
  const [appendAnswer, setAppendAnswer] = useState('');
  const [questionMarks, setQuestionMarks] = useState('1');
  const [questionRubric, setQuestionRubric] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const [plan, setPlan] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.learnerPlans) || '{}');
    } catch {
      return {};
    }
  });

  const [planText, setPlanText] = useState('');
  const [planStyle, setPlanStyle] = useState('visual');
  const [planPace, setPlanPace] = useState('normal');
  const [planDifficulty, setPlanDifficulty] = useState('beginner');

  useEffect(() => writeJSON(KEYS.lessons, lessons), [lessons]);

  useEffect(() => {
    localStorage.setItem('zuno_custom_tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem(KEYS.learnerPlans, JSON.stringify(plan));
  }, [plan]);

  const learner = useMemo(() => {
    const read = (key) => {
      try {
        return JSON.parse(localStorage.getItem(key) || 'null');
      } catch {
        return null;
      }
    };

    const name = localStorage.getItem('zuno_student_name');

    if (!name) return null;

    const preferences = read(KEYS.preferences) || {};
    const diagnostic = read(KEYS.diagnostic) || {};
    const practice = read(KEYS.practice);

    return {
      name,
      style: preferences.learningStyle || 'visual',
      pace: preferences.pace || 'normal',
      level: diagnostic.level || 'Beginner',
      pct: diagnostic.percentage ?? 0,
      practice: practice?.score ?? null,
      practicePct: practice?.percentage ?? null,
      practiceTotal: practice?.total ?? 5,
      supports: read(KEYS.disabilities) || []
    };
  }, []);

  const rows = learner ? [learner] : [];

  const needs = (student) =>
    student.pct < 40 ||
    student.practice === null ||
    (student.practicePct ?? 0) < 40;

  const averageDiagnostic = rows.length
    ? Math.round(rows.reduce((total, student) => total + student.pct, 0) / rows.length)
    : 0;

  const addLesson = () => {
    if (!lessonTitle.trim() || !lessonBody.trim()) return;

    setLessons((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((item) => Number(item.id) || 0)) + 1,
        title: lessonTitle.trim(),
        description: lessonBody.trim().slice(0, 130),
        body: lessonBody.trim(),
        level: 'Beginner',
        duration: 15,
        teacherCreated: true
      }
    ]);

    setLessonTitle('');
    setLessonBody('');
  };

  const removeLesson = (id) => {
    setLessons((current) => current.filter((lesson) => lesson.id !== id));
  };

  const addTest = () => {
    if (!testTitle.trim() || !question.trim() || !answer.trim()) return;

    setTests((current) => [
      ...current,
      {
        id: Date.now(),
        title: testTitle.trim(),
        questions: [
          {
            question: question.trim(),
            options: [],
            answer: answer.trim(),
            marks: Number(questionMarks) || 1,
            rubric: questionRubric,
            explanation: `Correct answer: ${answer.trim()}`
          }
        ]
      }
    ]);

    setTestTitle('');
    setQuestion('');
    setAnswer('');
  };

  const removeTest = (id) => {
    setTests((current) => current.filter((test) => test.id !== id));
  };

  const addQuestionToTest = () => {
    if (!appendTestId || !appendQuestion.trim() || !appendAnswer.trim()) return;

    setTests((current) =>
      current.map((test) =>
        String(test.id) === String(appendTestId)
          ? {
              ...test,
              questions: [
                ...test.questions,
                {
                  question: appendQuestion.trim(),
                  options: [],
                  answer: appendAnswer.trim(),
                  marks: Number(questionMarks) || 1,
                  rubric: questionRubric,
                  explanation: `Correct answer: ${appendAnswer.trim()}`
                }
              ]
            }
          : test
      )
    );

    setAppendQuestion('');
    setAppendAnswer('');
  };

  const removeQuestion = (testId, index) => {
    setTests((current) =>
      current.map((test) =>
        test.id === testId
          ? {
              ...test,
              questions: test.questions.filter((_, i) => i !== index)
            }
          : test
      )
    );
  };

  const exportMarks = () => {
    const exportRows = [
      ['Learner', 'Type', 'Diagnostic %', 'Practice score', 'Practice %', 'Level', 'Style', 'Pace'],
      ...rows.map((student) => [
        student.name,
        'Connected learner',
        student.pct,
        student.practice ?? 'Not attempted',
        student.practicePct ?? '',
        student.level,
        student.style,
        student.pace
      ])
    ];

    const csv = exportRows
      .map((row) =>
        row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'zuno-student-marks.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  const savePlan = () => {
    setPlan((current) => ({
      ...current,
      current: {
        ...current.current,
        notes: planText,
        style: planStyle,
        pace: planPace,
        difficulty: planDifficulty,
        updatedAt: new Date().toISOString()
      }
    }));
  };

  const learnerStyle = learner?.style || 'Not available';
  const learnerPace = learner?.pace || 'Not available';
  const learnerLevel = learner?.level || 'Not available';

  return (
    <div className="workspace" data-language={lang}>
      <aside className="work-side">
        <Link className="work-brand" to="/">
          ZUNO<span></span>
        </Link>

        <p className="side-caption">TEACHER SPACE</p>

        <nav>
          <button
            className={activeTab === 'overview' ? 'nav-active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Class overview
          </button>

          <button
            className={activeTab === 'content' ? 'nav-active' : ''}
            onClick={() => setActiveTab('content')}
          >
            Lessons
          </button>

          <button
            className={activeTab === 'tests' ? 'nav-active' : ''}
            onClick={() => setActiveTab('tests')}
          >
            Tests & questions
          </button>

          <button
            className={activeTab === 'marks' ? 'nav-active' : ''}
            onClick={() => setActiveTab('marks')}
          >
            Student marks
          </button>

          <button
            className={activeTab === 'plans' ? 'nav-active' : ''}
            onClick={() => setActiveTab('plans')}
          >
            Learning plans
          </button>
        </nav>

        <div className="side-note">
          Format follows learner choices and learning evidence.
        </div>
      </aside>

      <main className="work-main">
        <header className="work-top">
          <div>
            <span className="kicker">CLASSROOM INSIGHTS</span>
            <h1>{t('teacher')}</h1>
            <p>Manage content, review progress and personalize instruction.</p>
          </div>
        </header>

        {activeTab === 'overview' && (
          <>
            <section className="teacher-metrics">
              <article>
                <small>LEARNERS IN VIEW</small>
                <strong>{rows.length}</strong>
                <span>Connected learner records</span>
              </article>

              <article>
                <small>AVERAGE DIAGNOSTIC</small>
                <strong>{averageDiagnostic}%</strong>
                <span>Across connected learners</span>
              </article>

              <article>
                <small>NEEDS ANOTHER LOOK</small>
                <strong>{rows.filter(needs).length}</strong>
                <span>Diagnostic or practice below 40%, or no practice</span>
              </article>
            </section>

            <section className="work-panel">
              <div className="panel-heading">
                <div>
                  <span className="kicker">MACHINE LEARNING TEACHING EXAMPLE</span>
                  <h2>How Machine Learning works</h2>
                </div>
              </div>

              <div className="proof-grid">
                <article>
                  <span className="format-label">VISUAL FORMAT</span>
                  <h3>Learning from data</h3>

                  <div className="dot-groups">
                    {[0, 1, 2].map((item) => (
                      <div key={item}>
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    ))}
                  </div>

                  <p>Data → Training → Model</p>
                  <b>Learn patterns from examples.</b>
                </article>

                <article>
                  <span className="format-label">READING FORMAT</span>
                  <h3>Making predictions</h3>

                  <p>
                    Machine Learning is a branch of Artificial Intelligence.
                    A model learns patterns from training data and uses those
                    patterns to make predictions about new information.
                  </p>
                </article>
              </div>

              <p className="fairness-note">
                Format follows what the learner chose and how they scored,
                not a diagnosis.
              </p>
            </section>
          </>
        )}

        {activeTab === 'content' && (
          <section className="work-panel">
            <h2>{t('lessonLibrary')}</h2>

            <p>
              Add new Machine Learning lessons or remove lessons from the
              learner library. Changes are saved in this browser.
            </p>

            <div className="teacher-form">
              <label>
                Lesson title
                <input
                  value={lessonTitle}
                  onChange={(event) => setLessonTitle(event.target.value)}
                  placeholder="e.g. Introduction to Neural Networks"
                />
              </label>

              <label>
                Lesson explanation
                <textarea
                  value={lessonBody}
                  onChange={(event) => setLessonBody(event.target.value)}
                  placeholder="Explain the Machine Learning concept clearly and accessibly."
                />
              </label>

              <button className="btn-primary" onClick={addLesson}>
                {t('add')} lesson
              </button>
            </div>

            <div className="teacher-managed-list">
              {lessons.map((lesson) => (
                <article key={lesson.id}>
                  <div>
                    <b>{lesson.title}</b>
                    <small>{lesson.level} · {lesson.duration} minutes</small>
                    <p>{lesson.description || lesson.body}</p>
                  </div>

                  <button
                    className="btn-danger"
                    onClick={() => removeLesson(lesson.id)}
                  >
                    {t('delete')}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'tests' && (
          <section className="work-panel">
            <h2>{t('tests')}</h2>

            <p>
              Create Machine Learning assessments with an initial question,
              then add more questions. Tests can be removed at any time.
            </p>

            <div className="teacher-form">
              <label>
                Test name
                <input
                  value={testTitle}
                  onChange={(event) => setTestTitle(event.target.value)}
                  placeholder="e.g. Machine Learning Fundamentals"
                />
              </label>

              <label>
                First question
                <input
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="What is Machine Learning?"
                />
              </label>

              <label>
                Correct answer
                <input
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="A system that learns patterns from data"
                />
              </label>

              <label>
                Marks
                <input
                  type="number"
                  min="1"
                  value={questionMarks}
                  onChange={(event) => setQuestionMarks(event.target.value)}
                />
              </label>

              <label>
                Optional rubric
                <input
                  value={questionRubric}
                  onChange={(event) => setQuestionRubric(event.target.value)}
                  placeholder="Key ideas for partial credit"
                />
              </label>

              <button className="btn-primary" onClick={addTest}>
                Create test
              </button>
            </div>

            <div className="teacher-form">
              <label>
                Choose test
                <select
                  value={appendTestId}
                  onChange={(event) => setAppendTestId(event.target.value)}
                >
                  <option value="">Select a test</option>
                  {tests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                New question
                <input
                  value={appendQuestion}
                  onChange={(event) => setAppendQuestion(event.target.value)}
                  placeholder="Write another Machine Learning question"
                />
              </label>

              <label>
                Correct answer
                <input
                  value={appendAnswer}
                  onChange={(event) => setAppendAnswer(event.target.value)}
                  placeholder="Enter the expected answer"
                />
              </label>

              <label>
                Marks
                <input
                  type="number"
                  min="1"
                  value={questionMarks}
                  onChange={(event) => setQuestionMarks(event.target.value)}
                />
              </label>

              <label>
                Optional rubric / key ideas
                <input
                  value={questionRubric}
                  onChange={(event) => setQuestionRubric(event.target.value)}
                  placeholder="Key ideas separated by spaces"
                />
              </label>

              <button className="btn-secondary" onClick={addQuestionToTest}>
                Add question to selected test
              </button>
            </div>

            {tests.map((test) => (
              <article className="managed-test" key={test.id}>
                <div>
                  <b>{test.title}</b>
                  <small>{test.questions.length} question(s)</small>

                  {test.questions.map((item, index) => (
                    <p key={index}>
                      {index + 1}. {item.question}{' '}
                      <strong>
                        Expected: {item.answer} · {item.marks || 1} mark(s)
                      </strong>{' '}
                      <button
                        className="text-button"
                        onClick={() => removeQuestion(test.id, index)}
                      >
                        Remove question
                      </button>
                    </p>
                  ))}
                </div>

                <button
                  className="btn-danger"
                  onClick={() => removeTest(test.id)}
                >
                  Delete test
                </button>
              </article>
            ))}

            <p className="soft-note">
              Teacher-created tests are stored separately from the original
              five Machine Learning practice questions.
            </p>
          </section>
        )}

        {activeTab === 'marks' && (
          <section className="work-panel">
            <h2>{t('marks')}</h2>

            <button className="btn-secondary" onClick={exportMarks}>
              Export marks CSV
            </button>

            <p>
              Learner records and test results will appear here when the
              backend is connected.
            </p>

            {(() => {
              let items = [];

              try {
                items = JSON.parse(
                  localStorage.getItem('zuno_test_submissions') || '[]'
                );
              } catch {
                // Ignore malformed local data.
              }

              return items.length ? (
                <div className="table-scroll">
                  <table className="learner-table">
                    <thead>
                      <tr>
                        <th>Test</th>
                        <th>Learner</th>
                        <th>Marks</th>
                        <th>Evaluator</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id || index}>
                          <td>{item.testTitle}</td>
                          <td>{item.student}</td>
                          <td>{item.score}/{item.totalMarks}</td>
                          <td>{item.evaluator}</td>
                          <td>{new Date(item.submittedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No teacher-test submissions yet.</p>
              );
            })()}

            <div className="table-scroll">
              <table className="learner-table">
                <thead>
                  <tr>
                    <th>Learner</th>
                    <th>Type</th>
                    <th>Diagnostic</th>
                    <th>Practice</th>
                    <th>Level</th>
                    <th>Learning style</th>
                    <th>Signal</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan="8">
                        No learner records are connected yet. Connect the
                        student API to display marks here.
                      </td>
                    </tr>
                  )}

                  {rows.map((student) => (
                    <tr key={student.name}>
                      <td>{student.name}</td>
                      <td>Connected learner</td>
                      <td>{student.pct}%</td>
                      <td>
                        {student.practice === null
                          ? 'Not attempted'
                          : `${student.practice}/${student.practiceTotal || 5} (${student.practicePct ?? 0}%)`}
                      </td>
                      <td>{student.level}</td>
                      <td>{student.style}</td>
                      <td>
                        {needs(student) ? 'Needs another look' : 'On track'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'plans' && (
          <section className="work-panel">
            <h2>{t('personalize')}</h2>

            <p>
              Current learner preference: <b>{learnerStyle}</b> style,
              <b> {learnerPace}</b> pace, <b>{learnerLevel}</b> level.
              This plan records teacher guidance without overriding learner
              choice.
            </p>

            <div className="teacher-form">
              <label>
                Suggested learning style
                <select
                  value={planStyle}
                  onChange={(event) => setPlanStyle(event.target.value)}
                >
                  {['visual', 'reading', 'audio', 'interactive'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Suggested pace
                <select
                  value={planPace}
                  onChange={(event) => setPlanPace(event.target.value)}
                >
                  {['slow', 'normal', 'fast'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Suggested difficulty
                <select
                  value={planDifficulty}
                  onChange={(event) => setPlanDifficulty(event.target.value)}
                >
                  {['beginner', 'intermediate', 'advanced'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Learning support plan
                <textarea
                  value={planText}
                  onChange={(event) => setPlanText(event.target.value)}
                  placeholder="Goals, strengths, helpful teaching approaches and next steps"
                />
              </label>
            </div>

            <button className="btn-primary" onClick={savePlan}>
              {t('save')} plan
            </button>

            {plan.current?.notes && (
              <p className="soft-note">
                Saved plan: {plan.current.notes}
              </p>
            )}
          </section>
        )}

        <footer className="work-footer">
          ZUNO · Teacher workspace <span></span>
        </footer>
      </main>
    </div>
  );
}
