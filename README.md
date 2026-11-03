# ZUNO \| An Inclusive Adaptive Learning Platform

**Team:** BrainByte\
**Hackathon:** Neural Storm Hackathon 2026\
**Focus:** Accessible and personalized Machine Learning education

## Project Links

  ----------------------------------------------------------------------------------------
  Resource                            Link
  ----------------------------------- ----------------------------------------------------
  Live application                    \[Add frontend deployment URL\]

  Demo video                          \[Add Google Drive video URL\]

  GitHub repository                   https://github.com/sai-dharahas07/NeuralStorm-ZUNO
  ----------------------------------------------------------------------------------------

## 1. Problem Statement

Many digital learning platforms provide the same content, layout, pace,
and assessment methods to everyone. This can create barriers for persons
with disabilities and learners with different learning needs.

For example, learners with dyslexia may find dense text difficult to
follow; learners with visual or hearing impairments may need alternative
ways to access content; and learners with ADHD-related needs may benefit
from clearer presentation and manageable learning activities.

**The challenge is to make digital learning more accessible and
adaptable to each learner's abilities, preferences, and pace.**

## 2. Our Solution

**ZUNO** is an inclusive learning platform focused on Machine Learning
education. It brings together accessibility preferences, language
options, diagnostic assessment, practice quizzes, AI-supported
evaluation, and progress-related services.

ZUNO is designed to support: - Learners with dyslexia. - Learners with
visual or hearing accessibility needs. - Learners with ADHD-related
learning needs. - Learners with different knowledge levels and learning
speeds. - Multilingual learners through English, Telugu, and Hindi
language options.

The platform provides support options, not a replacement for assistive
technology or individual accommodations.

## 3. Key Features

-   **Accessibility preferences:** Options related to dyslexia, visual,
    hearing, and ADHD-related needs.
-   **Language selection:** English, Telugu, and Hindi options;
    translation coverage may vary.
-   **Diagnostic assessment:** Collects learner responses to understand
    current knowledge.
-   **Adaptive-learning components:** Backend modules support difficulty
    adjustment and personalized recommendations.
-   **Machine Learning practice:** Learning content and multiple-choice
    quizzes.
-   **AI evaluation:** Sends learner responses to the backend evaluation
    service.
-   **Progress services:** APIs for submitting and retrieving quiz
    attempts and student progress.
-   **Teacher and admin workspaces:** Interface workflows for managing
    learning activities.


## 4. Technology Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  React + Vite                        Frontend application

  Python + FastAPI                    Backend APIs

  Pydantic                            Data validation

  SQLAlchemy                          Database interaction

  Supabase PostgreSQL                 Database

  Python AI modules                   Diagnostic, adaptation,
                                      recommendation, and accessibility
                                      logic

  Git + GitHub                        Version control
  -----------------------------------------------------------------------

## 5. Project Structure

``` text
NeuralStorm-ZUNO/
├── backend/
│   ├── app/              # FastAPI application
│   ├── ai_engine/        # AI and adaptive-learning modules
│   ├── tests/            # Backend tests
│   └── requirements.txt
├── frontend/
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   └── package.json
└── .gitignore
```

## 6. Run Locally

**Requirements:** Git, Node.js, npm, Python, and a Supabase project if
using the hosted database.

Clone the project:

``` bash
git clone https://github.com/sai-dharahas07/NeuralStorm-ZUNO.git
cd NeuralStorm-ZUNO
```

Set up the backend (Windows PowerShell):

``` powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Configure your local backend environment using the example file. Start
the backend using the entry point configured in the project. For an app
exposed as `app` from `app/main.py`:

``` bash
uvicorn app.main:app --reload
```

In a second terminal, set up the frontend:

``` bash
cd frontend
npm install
npm run dev
```

Vite displays the local frontend address in the terminal. To create a
production build, run `npm run build` inside `frontend/`.







**ZUNO by Team BrainByte**\
*Making Machine Learning education more inclusive, accessible, and
adaptive.*
