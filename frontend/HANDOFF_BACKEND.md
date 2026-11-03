# Backend handoff

This frontend is prepared for backend integration. It contains no synthetic teacher-class roster or seeded teacher test submissions.

## Integration points
- `src/data/contract.js`: existing frontend storage keys, learning preferences and starter lesson content.
- `src/services/answerEvaluation.js`: answer-evaluation adapter. Configure a secure backend endpoint; never expose model API keys in the browser.
- `src/pages/Teacher.jsx`: teacher content/test management UI and learner marks view. Replace localStorage reads/writes with authenticated API calls.
- `src/pages/Admin.jsx`: teacher roster management UI. Connect it to role-protected teacher-management endpoints.
- `src/pages/PracticeQuiz.jsx`: student test-taking flow and submission UI. Submit responses to the backend and retrieve server-evaluated marks.
- `src/i18n/domTranslations.js`: shared interface translation dictionary for English, Telugu and Hindi. Add new exact source-text keys here when new interface copy is introduced.

## Clean handoff behaviour
On the first launch of this handoff build, old local `neuralstorm_*` and `zuno_*` test records are cleared once. The selected language, theme and role preference are retained. The app does not generate fake learner records.

The four starter maths lessons and the standard practice questions remain as actual starter learning content, not fabricated student or teacher records. Replace or extend them through the connected content API when the backend is ready.

## Important
The role switcher is a frontend preview control, not authentication. All teacher/admin endpoints must enforce authentication and authorization on the server. Student marks and AI evaluation must be computed or verified server-side.
