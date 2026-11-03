# ZUNO inclusive learning roadmap

This roadmap separates what is now present in the frontend demo from future work. It is intentionally balanced between learner impact, delivery effort, privacy and technical risk.

## Delivered in this frontend update

| Capability | Current implementation | Boundary to understand |
|---|---|---|
| English, Telugu and Hindi | Language selector on the main learning and staff screens; localized support selection, preference labels, diagnostic prompts, practice prompts, core student navigation and the four standard lesson bodies; speech locale follows language | Teacher-authored lesson/test content remains in the language in which it was entered. Admin/teacher copy is only partly localized. Complete translation review is a next release task. |
| Teacher lesson management | Add and remove lessons in Teacher > Lessons; student lesson library reads the shared lesson catalogue | Content is local to this browser until synced through the backend. |
| Teacher test management | Create/delete tests; add/remove questions; select an available teacher-created test in Practice | Question editor currently uses a simple answer/options scaffold. A full test builder with question types, per-question marks, timer and draft/publish workflow is future work. |
| Student marks | Teacher > Student marks reads current-browser diagnostic/practice results and includes clearly labelled synthetic demo classmates; CSV export | Demo classmates are illustrative, not real student records. Real roster and marks must come from the authenticated backend. |
| Personal learning plan | Teacher can save notes and suggested style, pace and difficulty. Student sees the plan and explicitly chooses whether to apply the suggestion. | One browser learner profile in this demo. Production needs a learner identifier, consent, plan history and server authorization. |
| Staff route separation | `/teacher` and `/admin` are guarded by a demo role; student dashboard navigation does not expose staff dashboards; `/staff-access` selects a demo role | A localStorage role is not security. Production must enforce roles on the backend and obtain staff identity from a trusted login session. |
| Existing accessibility settings | Existing global and reading settings remain wired, with student controls retained | A real accessibility conformance claim requires assistive-technology testing and disabled-user research. |

## Product principles

1. Learners control their support preferences. A support choice is not a diagnosis and must never be used as a risk score.
2. Every audio, visual, drag, timed or colour-based interaction needs an equivalent accessible route.
3. Adaptive suggestions are explainable, optional and reversible.
4. Store the minimum personal data needed. Never collect medical details for learning-format selection.
5. Do not expose student marks or support preferences to a parent/teacher without appropriate authorization and consent.
6. Preserve the current contract keys and diagnostic thresholds. New keys must begin with `neuralstorm_` or `zuno_`.

## Prioritized implementation plan

### Phase 1: Core learning quality (P0, next release)

#### 1. Smart Explanation Engine
- Define a versioned content model: concept, objective, prerequisites, short explanation, worked steps, common misconceptions, examples, practice prompts and accessible text descriptions.
- Create a deterministic explanation service first. It should choose a presentation template from the learner's selected style, pace and requested support settings.
- Visual: diagram plus short text; reading: complete explanation; audio: transcript plus user-triggered speech; interactive: one step and a check.
- Keep the transcript visible during audio. Never autoplay for slow pace or when hearing support is selected.
- Add a learner control to switch format and a plain-language “Why this format?” explanation.
- If an AI provider is added later, call it through the backend, validate its output against the content schema, and retain teacher-approved fallback explanations.
- Acceptance: same problem can be rendered in all four styles; mathematical values and answer are identical; keyboard and screen-reader users can complete every step.

#### 2. Interactive Maths Laboratory
- Start with four manipulatives: counters, number line, multiplication arrays and equal-sharing groups.
- Support mouse, touch, keyboard and switch access. Provide “add one”, “remove one”, “move left/right” and “make a group” buttons so dragging is never required.
- Keep a text description synchronized with the visual model, e.g. “3 groups with 4 counters each; 12 counters total”.
- Add fraction strips/circles only after the initial four are tested.
- Acceptance: all models have accessible names and text equivalents; a student can complete the activity without dragging or relying on colour.

#### 3. Misconception Detection
- Build a teacher-reviewed rule library for common arithmetic misconceptions: counting-on errors, place-value confusion, operation confusion, unequal grouping and division-as-subtraction.
- Match only when response evidence supports a hint. Ask the learner a clarifying question when evidence is ambiguous.
- Show a helpful next step, not a label about the learner. Example: “Try a number line and count backwards.”
- Record only the question, response, hint shown and whether the learner improved, subject to the platform's retention policy.
- Teacher view shows “possible concept to revisit” and lets the teacher dismiss or correct it.
- Acceptance: no diagnosis inference, no disability risk score, and every hint can be ignored.

### Phase 2: Disability-specific interaction (P1)

#### 4. Advanced Dyslexia Mode
- Add optional readable fonts, adjustable text measure, word spacing, line spacing, reading ruler and focus highlighting.
- Provide syllable/word highlighting only when synchronized with accurate text-to-speech; never animate by default.
- Offer multiple backgrounds and font choices rather than declaring one font universally dyslexia-friendly.
- Acceptance: all settings persist, can be independently disabled, and are tested with dyslexic learners.

#### 5. ADHD Focus Mode
- One task or explanation step per view, optional short-session timer, pause/resume, break prompts and saved position.
- Timer is optional, does not penalize slower learners and is not shown as a performance metric.
- Reduce decorative motion and support reduced-motion preferences.
- Acceptance: user can stop, resume and leave without losing work; no autoplay.

#### 6. Low Vision and Screen Reader Support
- Audit semantic landmarks, headings, labels, reading order, error announcements, keyboard focus, 200–400% zoom and responsive reflow.
- Use MathML where supported and provide a tested linear speech alternative for expressions.
- Support NVDA/Firefox, VoiceOver/Safari and TalkBack/Chrome. Add switch navigation and avoid hover-only controls.
- Acceptance: core learner journey can be completed using keyboard only and at least one screen reader per target platform. Run WCAG 2.2 AA checks; document exceptions rather than claiming automatic compliance.

#### 7. Deaf and Hard-of-Hearing Support
- Captions and transcripts for all instructional media, visual alerts instead of sound-only alerts and no required audio steps.
- Add optional sign-language clips only with qualified translators and review by Deaf educators/community members.
- Acceptance: all lessons and assessments remain complete without sound.

### Phase 3: Language, school and family workflows (P1/P2)

#### 8. Complete Telugu and Hindi localization
- Extend reviewed translations to every onboarding step, quiz, validation/error message, dashboard, teacher/admin screen, reports, captions and help text.
- Maintain a maths glossary for operation names, place value, fractions and word problems. Use native-language reviewers and educators.
- Add language-specific speech voice selection and a clear fallback if a browser voice is unavailable.
- Preserve numeric notation and answer values when changing language. Keep teacher-authored content labelled with its language.
- Acceptance: end-to-end student journey can be completed in Telugu and Hindi without English-only blockers; content reviewed by fluent educators.

#### 9. Individual Learning Support Plan
- Learner and teacher co-author goals, strengths, preferred supports, strategies, next steps and review date.
- Learner can view, accept, edit or decline suggestions. Keep an audit trail of who changed a plan and when.
- Do not add medical diagnosis fields. Store consent and visibility scope separately.
- Acceptance: a learner can revoke sharing and see who has access.

#### 10. Offline Learning
- Cache public lesson content and approved static assets with a service worker. Queue progress events in IndexedDB and sync after reconnect.
- Handle duplicate/conflicting updates with timestamps and clear conflict resolution. Show offline/last-synced status.
- Do not cache private teacher/parent reports on shared devices by default.
- Acceptance: lesson and practice can run offline after first visit; progress syncs once online without duplicating scores.

#### 11. Parent Progress Portal
- Guardian invitation with verified identity and explicit learner/guardian consent.
- Share plain-language progress summaries, goals and suggested at-home activities. Do not expose disability support choices by default.
- Allow consent revocation and access history.
- Acceptance: guardian sees only the learner records they are authorized to view.

#### 12. Accessible Reports
- Generate tagged PDF and CSV with proper headings, table headers, readable chart descriptions and plain-language summaries.
- Include selected date range, score definitions, lesson completion and next steps. Do not include diagnosis or inferred disability risk.
- Provide teacher and learner versions with appropriate access scopes.
- Acceptance: PDF is screen-reader navigable and CSV has stable column headers.

## Suggested delivery sequence

| Sprint | Deliverable | Validation |
|---|---|---|
| Sprint 1 | Smart Explanation Engine + first two maths manipulatives | Teacher review and keyboard test |
| Sprint 2 | Misconception hints + advanced dyslexia and focus settings | Learner usability sessions |
| Sprint 3 | Screen reader/low vision fixes + captions and transcripts | WCAG audit and AT testing |
| Sprint 4 | Complete Telugu/Hindi localization + teacher plan workflow | Native-language educator review |
| Sprint 5 | Offline queue + accessible report export | Offline/reconnect and PDF accessibility tests |
| Sprint 6 | Parent portal with consent and backend roles | Security/privacy review |

## Backend integration requirements

- Backend must authenticate staff and guardians; frontend route guards are only a user-experience layer.
- API should return role-scoped learners, lessons, tests, marks and support plans. Never trust a client-supplied learner ID or role.
- Validate every teacher content mutation server-side and keep author/timestamp metadata.
- Keep current `neuralstorm_*` contract values unchanged. New data should use prefixed keys and documented schemas.
- Add audit logs for staff access and content edits, data retention controls, consent and export/deletion endpoints.


## Additional features in this upgrade

| Feature | Current implementation | Boundary |
|---|---|---|
| Admin teacher roster | Add/remove teacher entries, duplicate-email validation, local persistence and snapshot support | Demo roster only. Secure accounts and authorization require a backend. |
| Multi-question tests | Create/delete tests, add/remove open-response questions, assign marks and optional keyword rubric | Browser-local authoring until API persistence is connected. |
| Student answer marking | Exact/normalized answer checking and simple rubric keyword partial marks; records marks for teacher review | This is local rule-based marking, not a generative AI model. |
| Teacher marks | Test name, learner label, awarded marks, evaluator and timestamp | Current browser only. Real class rosters require authenticated backend data. |
| Multilingual audio | English (`en-IN`), Telugu (`te-IN`) and Hindi (`hi-IN`) speech locales, adjustable playback speed and browser voice matching | The device/browser must provide a compatible voice. |
| Expanded feature section | Multilingual audio, test creation, learning plans, feedback, reports, keyboard-friendly controls and saved progress | Describes implemented frontend functionality, not hardware-dependent integrations. |

### Connecting a real AI answer evaluator

Set `VITE_AI_EVALUATION_ENDPOINT` to a secure backend endpoint. The frontend sends `question`, `answer`, `expectedAnswer`, `maxMarks` and `rubric` as JSON. The endpoint should return `{"score":3,"feedback":"..."}`. Keep API keys server-side, authenticate the learner, validate and clamp scores, record model/version and confidence, and flag uncertain answers for teacher review. Without this endpoint the app deliberately uses transparent local marking.
