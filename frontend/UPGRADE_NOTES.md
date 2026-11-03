# ZUNO / NeuralStorm upgrade notes

## Implemented in this frontend demo

- Admin dashboard: add/remove teacher roster entries; duplicate email checks; teacher records are included in JSON snapshot export/import.
- Teacher dashboard: create/delete tests; add/remove multiple open-response questions; set marks and optional keyword rubrics; keep teacher-created tests separate from the original practice quiz.
- Student test experience: write an answer for each teacher-created question, receive an immediate local evaluation and score, and save the result for teacher review.
- Teacher marks view: shows teacher-test name, learner label, marks awarded and evaluator. Existing CSV export remains available for the demo roster.
- Audio lessons: English, Telugu and Hindi lesson content; language selection; playback speed; pause/resume/stop. The browser's installed speech voices determine actual audio availability.
- Landing page: expanded feature section for multilingual audio, teacher tests, explainable support, step-by-step practice, personalized plans, reports, keyboard-friendly controls and saved progress.
- Existing three dashboards, role-gated staff routes, learner storage contract, lesson management and accessibility controls are retained.

## Important limits

1. **The current assessment fallback is not a generative AI model.** It uses exact/normalized answer checking and an optional simple keyword rubric to provide consistent local scoring. This is intentionally labelled as local rule-based evaluation.
2. To connect an actual AI model, deploy a secure backend endpoint and set `VITE_AI_EVALUATION_ENDPOINT`. The frontend sends `question`, `answer`, `expectedAnswer`, `maxMarks`, and `rubric`. The backend must authenticate the learner, call the model, validate/clamp the score, log model/version/confidence, and return `score` plus `feedback`. Never put an AI API key in the browser.
3. Teacher add/remove currently manages a local demo roster, not secure staff accounts. Real account creation, sign-in, role assignment and authorization must be implemented and enforced by the backend.
4. Student names and submissions are browser-local demo data. A shared classroom requires authenticated learner IDs and backend persistence.
5. Telugu/Hindi TTS depends on installed browser/operating-system voices. If a device has no voice for the selected language, the browser may use a fallback voice or may not speak that language correctly.
6. This update deliberately does not claim to implement camera/eye tracking, emotion recognition, sign-language avatars, Braille hardware, wearables or clinical diagnosis. These require specialist hardware, services, or expert validation.
7. A production offline-first application needs a service worker, IndexedDB queue, synchronization conflict handling and security review. The current app retains local browser progress but is not a complete offline sync system.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

For a production bundle:

```bash
npm run build
```

## AI endpoint contract

Request:
```json
{
  "question": "Explain how 3 groups of 4 make 12.",
  "answer": "4 + 4 + 4 is 12",
  "expectedAnswer": "12",
  "maxMarks": 5,
  "rubric": "equal groups repeated addition total"
}
```

Response:
```json
{
  "score": 4,
  "feedback": "The reasoning is correct; the final total needs clearer notation."
}
```

The teacher should retain final review authority, especially for open-ended or ambiguous responses.
