# ZUNO frontend handoff

## Dashboards and routes
- `/dashboard` and `/student`: student home and personalized learning summary.
- `/teacher`: classroom comparison board, synthetic classmates labelled as demo data, same-problem 3 × 4 proof.
- `/admin`: JSON snapshot import/export, content preview, adaptation rules, accessibility status, learner-selected support counts and demo reset.
- `/lessons`, `/practice`, `/progress`: connected learning path.
- `/disability-selection` → `/learning-preferences` → `/diagnostic-quiz` → `/dashboard`: onboarding flow.
- `/`: ZUNO landing page. Unknown routes redirect to `/`.

## Shared browser contract
- `neuralstorm_disabilities`: JSON array of selected ids (`dyslexia`, `adhd`, `visual`, `hearing`, `none`).
- `neuralstorm_learning_preferences`: `{ learningStyle, difficulty, pace, sound }`.
- `neuralstorm_diagnostic_result`: `{ score, total, percentage, level }`, stored in localStorage and sessionStorage.
- `neuralstorm_practice_result`: `{ score, total, percentage }`.
- `neuralstorm_completed_lessons`: array of lesson ids `[1,2,3,4]`, stored in both localStorage and sessionStorage.
- `neuralstorm_reading_settings`: `{ dyslexiaFont, letterSpacing, lineSpacing, readingBackground }`.
- `zuno_large_text`, `zuno_high_contrast`, `zuno_visual_mode`: `"true"` / `"false"` values.
- Admin exports and imports the same ZUNO/NeuralStorm contract values. Import validates support ids and preference/reading enums before writing.

## Adaptation rules
- Diagnostic >= 80%: Advanced.
- Diagnostic >= 40% and < 80%: Intermediate.
- Diagnostic < 40%: Beginner.
- Pace speech rates: slow 0.8, normal 0.95, fast 1.1.
- Format follows what the learner chose and how they scored, not a diagnosis.

## Integration notes
- Student dashboard links to lessons, practice and progress.
- Teacher workspace links to student and lesson views.
- Admin is local-demo only; JSON snapshot is the handoff boundary for backend integration.
- `src/utils/accessibility.js` owns global accessibility initialization and controls.
- `src/utils/readingAccessibility.js` owns reading settings.
- `src/main.jsx` imports `src/index.css`; do not remove that import.
- `src/App.jsx` mounts global accessibility controls and registers the dashboard routes.

## Expanded feature roadmap (balanced priority)
This roadmap distinguishes existing demo foundations from new work. Items below are proposed implementation stages unless explicitly marked implemented in this ZIP.

### Implemented in this update
- **English, Telugu and Hindi language selection:** `zuno_language` stores `en`, `te` or `hi`. Core dashboard navigation and learner-facing lesson titles, descriptions, bodies and speech locale switch with the selected language. Teacher-authored content remains exactly as authored until translated by the teacher/content team.
- **Teacher lesson management:** teachers can add and remove lessons. The student lesson library reads `zuno_custom_lessons` and displays the shared catalogue.
- **Teacher test management:** teachers can create/delete tests and add/remove questions. Tests are stored in `zuno_custom_tests`. The learner practice flow uses the first available teacher-created test, falling back to the original five-question practice quiz.
- **Marks and personalization:** teacher workspace displays current-browser diagnostic/practice marks and clearly marked synthetic demo classmates. A teacher support plan can be saved in `zuno_learner_plans`; learner-selected style/pace remain the default and the plan does not infer a disability.
- **Staff route separation:** `/teacher` and `/admin` are role-gated. `/staff-access` is the demo role selector. Student navigation contains no teacher/admin links. In production, replace the demo role selector with authenticated backend roles and server-side authorization; localStorage roles are not security.

### Balanced roadmap for the next releases
1. **Smart Explanation Engine (P0):** define a content schema with concept, worked steps, misconception hints and examples. Render the same explanation as visual, reading, audio transcript and interactive steps. Start with deterministic templates; add an AI provider only behind a backend service, with teacher review and safe fallbacks.
2. **Interactive Maths Laboratory (P0):** build keyboard-operable number lines, counters, equal-group arrays and fraction models. Every object needs text alternatives, labelled controls and a non-drag alternative. Instrument only learning interactions needed for feedback.
3. **Misconception Detection (P0):** map common wrong-answer patterns to concept-level hints, not disability labels. Store question, selected response, hint shown and outcome. Let teachers correct the suggested interpretation; avoid high-stakes learner scoring.
4. **Advanced Dyslexia Mode (P1):** selectable readable fonts, line focus/ruler, syllable/word highlighting, adjustable measure and spacing, reduced visual clutter. Test with dyslexic learners; do not claim one font works for everyone.
5. **ADHD Focus Mode (P1):** one task per screen, optional timer, pause/resume, break prompts, reduced motion and saved position. Timers must be optional and never penalize slower learners.
6. **Low Vision and Screen Reader Support (P0):** complete keyboard path, semantic landmarks, accessible names, visible focus, zoom/reflow, contrast checks, text alternatives and MathML/linear math speech. Test NVDA, VoiceOver and TalkBack with users.
7. **Deaf and Hard-of-Hearing Support (P1):** captions and transcripts for all media, visual notifications and optional reviewed sign-language content. Never make audio the only channel.
8. **Telugu and Hindi Support (P0):** extend the current interface/lesson translations to every quiz, validation message, teacher/admin screen, help article and generated report. Add reviewed glossary terms for maths and locale-aware text-to-speech. Use human review before production release.
9. **Individual Learning Support Plan (P1):** learner/teacher co-authored goals, preferred accommodations, strengths, strategies, review date and consent. Learners can view and challenge the plan. Keep sensitive data minimal.
10. **Offline Learning (P1):** service-worker cache for approved lesson assets, IndexedDB queue for progress, conflict-safe sync and clear offline status. Never cache private reports on shared devices without consent.
11. **Parent Progress Portal (P2):** optional guardian invitation, verified consent, scoped progress summaries and revocation. No access to disability/support details by default.
12. **Accessible Reports (P1):** export tagged PDF/CSV with plain-language summaries, accessible tables, date ranges and learner consent. Include scores and learning evidence, never diagnostic or medical inference.

### Release gates
- WCAG 2.2 AA audit plus keyboard-only and screen-reader testing.
- Test with disabled learners and specialist educators; document issues and fixes.
- Backend owns authentication, authorization, learner identity, data validation and audit logs. Do not trust localStorage role values for production access control.
- Obtain consent for teacher/guardian access; provide data export/deletion and retention controls.
- Keep existing storage keys and the agreed diagnostic/practice JSON shapes unchanged. New keys must use `neuralstorm_` or `zuno_` prefixes.


## Additional keys introduced for the teacher and language workflows
- `zuno_language`: `en | te | hi` (English, Telugu, Hindi).
- `zuno_custom_lessons`: JSON array of teacher-managed lesson objects.
- `zuno_custom_tests`: JSON array of `{ id, title, questions: [{ question, options, answer, explanation }] }`.
- `zuno_learner_plans`: object with a `current` plan containing `notes`, `style`, `pace`, `difficulty`, and `updatedAt`.
- `zuno_user_role`: demo role selector value `student | teacher | admin`; production must use authenticated backend authorization instead.

Teacher-managed lessons are shared with the student lesson library. Teacher-created tests appear in student practice (first saved test is the default; learners can choose among available tests). The original five practice questions remain the fallback when no teacher test exists.

## Backend handoff note
The ZIP supplied for this update contained the frontend project only; it did not contain backend source or API specifications. This update therefore preserves the frontend's existing localStorage/sessionStorage contract and documents the data needed for integration, but does not invent backend endpoints or claim live server persistence. Connect teacher lesson/test CRUD, marks, learner plans and role checks to the existing backend APIs when the backend package/API contract is available. Production role authorization must be enforced server-side.
