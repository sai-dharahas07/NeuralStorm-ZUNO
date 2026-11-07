# ZUNO – Inclusive Adaptive Learning Platform

**NeuralStorm | Team BrainByte | Hackathon 2026**

* **Problem Statement Number:** HI-03 (Adaptive Learning for Students with Disabilities)
* **Live Website:** [https://neural-storm-zuno.vercel.app](https://neural-storm-zuno.vercel.app)
* **Backend API:** [https://zuno-backend-ahir.onrender.com](https://zuno-backend-ahir.onrender.com)
* **API Documentation:** [https://zuno-backend-ahir.onrender.com/docs](https://zuno-backend-ahir.onrender.com/docs)

---

## 1. About the Project

ZUNO is an inclusive, AI-powered adaptive learning platform designed to make education accessible, personalized, and engaging for everyone, especially learners with disabilities and different learning needs.

Traditional learning platforms often follow a one-size-fits-all approach. However, every learner has different abilities, learning speeds, preferences, and challenges. Students with visual, hearing, cognitive, and other learning difficulties may face additional barriers when using conventional educational platforms.

ZUNO aims to address these challenges by providing an adaptive learning experience that considers each learner's abilities, preferences, accessibility requirements, and learning progress.

**Our goal is simple:**  
To make learning accessible to everyone, regardless of their abilities or learning pace.

---

## 2. Problem Statement

Many existing digital learning platforms do not adequately accommodate learners with disabilities or different learning requirements.

Some common challenges include:
* Learning materials that are difficult to understand.
* Limited accessibility and personalization options.
* Fixed learning difficulty levels.
* Lack of individual learning recommendations.
* Difficulty identifying a student's strengths and weaknesses.
* Learning experiences that do not adapt to individual student progress.

ZUNO addresses these challenges through accessibility-oriented features, diagnostic assessments, adaptive difficulty, and personalized learning recommendations.

---

## 3. Our Solution

ZUNO provides an inclusive learning environment with adaptive and personalized educational support.

### Key Features
1. **Adaptive Learning:** Evaluates student performance through diagnostic assessments, identifies the learner's current learning level, recommends suitable difficulty levels, and provides personalized learning recommendations.
2. **Accessibility Support:** Simplified text support, high-contrast display options, clear formatting for improved readability, and accessibility preferences tailored to individual needs (designed to support visual, hearing, cognitive, and other disabilities).
3. **Diagnostic Assessment:** Machine Learning-based educational questions that evaluate student answers, identify correct/incorrect/unanswered questions, and determine current understanding.
4. **Personalized Recommendations:** Recommends learning activities and suggestions based on assessment results to support an individualized learning journey.
5. **Student Dashboard:** Access to learning activities, progress metrics, and assessment results.
6. **Teacher Dashboard:** Educational content and lesson management, test creation tools, and student tracking.
7. **Admin Dashboard:** Administrative management functionality supporting teachers and learning-content management.

---

## 4. How ZUNO Works – Project Workflow

1. **Learner Access:** The student enters the ZUNO learning platform.
2. **Accessibility Preferences:** The learner selects suitable learning and accessibility preferences.
3. **Diagnostic Assessment:** The learner answers Machine Learning assessment questions.
4. **AI Evaluation:** The backend processes the learner's answers and evaluates performance.
5. **Learning-Level Identification:** The system identifies the learner's current learning level.
6. **Adaptive Difficulty:** The platform recommends an appropriate difficulty level.
7. **Personalized Recommendations:** Learning recommendations are generated based on the assessment.
8. **Continuous Learning:** Students continue learning through lessons and practice activities.

---

## 5. System Architecture & Data Flow

```mermaid
graph TD
    subgraph Client Tier ["Frontend (React.js / Vite / Tailwind)"]
        UI[Student & Teacher Dashboards]
        Prefs[Accessibility Preferences]
        Quiz[Diagnostic Assessment UI]
    end

    subgraph Server Tier ["Backend Tier (Python / FastAPI / Pydantic)"]
        API[FastAPI REST Endpoints]
        Engine[AI / Adaptive Learning Engine]
    end

    subgraph Data Tier ["Storage & Persistence"]
        DB[(Supabase PostgreSQL)]
        ORM[SQLAlchemy ORM]
    end

    UI -->|HTTP Requests / JSON| API
    Prefs -->|Preferences Config| API
    Quiz -->|Assessment Answers| API
    API --> Engine
    Engine -->|Evaluation & Recommendations| API
    API --> ORM --> DB
