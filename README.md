# ZUNO – Inclusive Adaptive Learning Platform

### NeuralStorm | Team BrainByte | Hackathon 2026

**Problem Statement Number:** HI-03 (Adaptive Learning for Students with Disabilities)

**Live Website:** [https://neural-storm-zuno.vercel.app](https://neural-storm-zuno.vercel.app)

**Backend API:** [https://zuno-backend-ahir.onrender.com](https://zuno-backend-ahir.onrender.com)

**API Documentation:** [https://zuno-backend-ahir.onrender.com/docs](https://zuno-backend-ahir.onrender.com/docs)

---

## 1. About the Project

**ZUNO** is an inclusive, AI-powered adaptive learning platform designed to make education accessible, personalized, and engaging for everyone, especially learners with disabilities and different learning needs.

Traditional learning platforms often follow a one-size-fits-all approach. However, every learner has different abilities, learning speeds, preferences, and challenges. Students with visual, hearing, cognitive, and other learning difficulties may face additional barriers when using conventional educational platforms.

ZUNO aims to address these challenges by providing an adaptive learning experience that considers each learner's abilities, preferences, accessibility requirements, and learning progress.

Our goal is simple:

**To make learning accessible to everyone, regardless of their abilities or learning pace.**

## 2. Problem Statement

Many existing digital learning platforms do not adequately accommodate learners with disabilities or different learning requirements.

Some common challenges include:

- Learning materials that are difficult to understand.
- Limited accessibility and personalization options.
- Fixed learning difficulty levels.
- Lack of individual learning recommendations.
- Difficulty identifying a student's strengths and weaknesses.
- Learning experiences that do not adapt to individual student progress.

ZUNO addresses these challenges through accessibility-oriented features, diagnostic assessments, adaptive difficulty, and personalized learning recommendations.

## 3. Our Solution

ZUNO provides an inclusive learning environment with adaptive and personalized educational support.

### Key Features

**1. Adaptive Learning**

- Evaluates student performance through diagnostic assessments.
- Identifies the learner's current learning level.
- Recommends suitable difficulty levels.
- Provides personalized learning recommendations.

**2. Accessibility Support**

- Simplified text support.
- High-contrast display options.
- Clear formatting for improved readability.
- Accessibility preferences based on individual learner needs.
- Designed to support learners with visual, hearing, cognitive, and other disabilities.

**3. Diagnostic Assessment**

- Machine Learning-based educational questions.
- Evaluates student answers.
- Identifies correct, incorrect, and unanswered questions.
- Helps determine the learner's current understanding.

**4. Personalized Recommendations**

- Recommends learning activities based on assessment results.
- Provides suggestions according to the learner's performance.
- Supports an individualized learning journey.

**5. Student Dashboard**

- Provides access to learning activities.
- Displays learning progress and assessment results.
- Helps students understand their learning journey.

**6. Teacher Dashboard**

- Supports educational content and lesson management.
- Allows teachers to create and manage learning tests.
- Helps teachers support students' learning activities.

**7. Admin Dashboard**

- Provides administrative management functionality.
- Supports teacher and learning-content management.

## 4. How ZUNO Works – Project Workflow

1. **Learner Access:** The student enters the ZUNO learning platform.
2. **Accessibility Preferences:** The learner selects suitable learning and accessibility preferences.
3. **Diagnostic Assessment:** The learner answers Machine Learning assessment questions.
4. **AI Evaluation:** The backend processes the learner's answers and evaluates performance.
5. **Learning-Level Identification:** The system identifies the learner's current learning level.
6. **Adaptive Difficulty:** The platform recommends an appropriate difficulty level.
7. **Personalized Recommendations:** Learning recommendations are generated based on the assessment.
8. **Continuous Learning:** Students continue learning through lessons and practice activities.

## 5. Technology Stack

| Component            | Technologies        |
| -------------------- | ------------------- |
| Frontend             | React.js            |
| Build Tool           | Vite                |
| Styling              | CSS                 |
| Backend              | Python, FastAPI     |
| AI / Adaptive Engine | Python              |
| API Validation       | Pydantic            |
| Database             | Supabase PostgreSQL |
| Database Integration | SQLAlchemy          |
| Frontend Deployment  | Vercel              |
| Backend Deployment   | Render              |
| Version Control      | Git and GitHub      |

### Why We Chose This Technology Stack

- **React.js:** Builds interactive and reusable user interfaces.
- **Vite:** Provides a fast frontend development and production build process.
- **Python:** Supports AI-related logic and adaptive learning functionality.
- **FastAPI:** Provides a lightweight and efficient backend API.
- **Pydantic:** Validates API request and response data.
- **SQLAlchemy:** Supports database interaction.
- **Supabase PostgreSQL:** Stores structured application data.
- **Vercel:** Hosts the frontend application.
- **Render:** Hosts the backend API.

## 6. Project Architecture

The application follows a frontend, backend, AI engine, and database architecture.

```text
                  ZUNO LEARNING PLATFORM
                           |
             +-------------+-------------+
             |                           |
        React Frontend               User Interface
             |
          FastAPI Backend
             |
       +-----+----------------+
       |                      |
   AI Engine             Database Layer
       |                      |
 Diagnostic              SQLAlchemy
 Evaluation                  |
 Adaptive Logic          Supabase
 Recommendations         PostgreSQL
       |
   Personalized
   Learning Support
```

## 7. Project Structure

The project is organized into separate frontend and backend components.

```text
NeuralStorm_ZUNO/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── ...
│   ├── requirements.txt
│   └── ...
│
├── ai_engine/
│   └── ...
│
└── README.md
```

## 8. Installation and Setup Instructions

Follow these steps to run ZUNO locally.

### Prerequisites

Install the following:

- Node.js and npm
- Python
- Git
- A Supabase project with PostgreSQL configured

### Step 1: Clone the Repository

```bash
git clone https://github.com/sai-dharahas07/NeuralStorm-ZUNO.git
cd NeuralStorm-ZUNO
```

### Step 2: Set Up the Frontend

Open a terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

The frontend will generally be available at:

```text
http://localhost:5173
```

### Step 3: Set Up the Backend

Open another terminal from the project root:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Configure the backend environment variables in the backend `.env` file.

Example configuration:

```env
DATABASE_URL=your_supabase_database_connection_string
FRONTEND_ORIGINS=http://localhost:5173
```

**Important:** Use your own Supabase database connection string. Never commit `.env` files, database passwords, API keys, or other secrets to GitHub.

Start the backend:

```bash
uvicorn app.main:app --reload
```

The backend will generally be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Step 4: Run the Application

Ensure both frontend and backend terminals are running.

Open:

```text
http://localhost:5173
```

The frontend communicates with the backend through the configured API URL.

## 9. Live Deployment

ZUNO is deployed using the following services:

| Service  | Deployment          |
| -------- | ------------------- |
| Frontend | Vercel              |
| Backend  | Render              |
| Database | Supabase PostgreSQL |

**Live Application:**
[https://neural-storm-zuno.vercel.app](https://neural-storm-zuno.vercel.app)

**Backend Service:**
[https://zuno-backend-ahir.onrender.com](https://zuno-backend-ahir.onrender.com)

**API Documentation:**
[https://zuno-backend-ahir.onrender.com/docs](https://zuno-backend-ahir.onrender.com/docs)

Github Link:

[https://github.com/sai-dharahas07/NeuralStorm-ZUNO](https://github.com/sai-dharahas07/NeuralStorm-ZUNO)



## 10. Project Demo Video

Watch our project demonstration to understand the ZUNO platform, its features, dashboards, and adaptive learning workflow.

**&#x20;Watch ZUNO Project Demo:**

[▶ Watch ZUNO Demo Video](https://drive.google.com/file/d/13RhNzMrjDgtPCKRQ9J0mGmWTs8ukD4Mc/edit)

Make sure the Google Drive sharing permission is set to **Anyone with the link – Viewer**.

###

## 12. Model Performance and Evaluation Metrics

ZUNO uses diagnostic evaluation and adaptive learning logic to assess student performance.

The evaluation includes:

- Total questions.
- Number of answered questions.
- Correct answers.
- Incorrect answers.
- Unanswered questions.
- Score percentage.
- Identified learning level.
- Recommended difficulty.

The platform uses student assessment results to provide personalized learning recommendations.

**Note:** We have not published a scientifically validated model accuracy percentage or benchmark score. The diagnostic score displayed by the application represents student assessment performance, not machine-learning model accuracy.

## 13. AI Tools Used

The development process used AI-assisted tools to support implementation, debugging, and project development.

- **ChatGPT:** Assistance with project planning, architecture, coding, debugging, API integration, documentation, and development guidance.

AI-assisted tools were used during development. ZUNO's actual application functionality is implemented through its frontend, backend, database, and adaptive learning components.

## 14. Social Impact and Accessibility

ZUNO is designed with inclusivity at its core.

We believe that every student deserves equal opportunities to learn, regardless of physical abilities, learning difficulties, or individual learning speed.

The platform aims to support:

- Learners with visual disabilities.
- Learners with hearing-related accessibility needs.
- Learners with cognitive and learning difficulties.
- Students who benefit from simplified educational content.
- Students who require different learning speeds and difficulty levels.

Our mission is to reduce learning barriers and make digital education more inclusive, accessible, and personalized.

**ZUNO: Learning at your own pace, in your own way.**

## 15. Future Enhancements

We plan to improve ZUNO through:

- More comprehensive screen-reader compatibility.
- Expanded text-to-speech and audio learning support.
- Improved multilingual support.
- More personalized AI learning recommendations.
- Expanded subject coverage.
- Enhanced student progress analytics.
- Improved teacher-student interaction.
- More comprehensive accessibility testing.

## 16. Team BrainByte

**Project:** ZUNO
**Team:** NeuralStorm / BrainByte
**Hackathon:** Neural Storm Hackathon 2026

### Team Members

1. Sai Dharahas Thatipamula
2. Sai Eshwari Yardam
3. Poorna Swapna Thota

---

## 17. Acknowledgement

We developed ZUNO with the vision of making digital education more inclusive and accessible.

We believe technology should adapt to learners, not force learners to adapt to technology.

**Thank you for exploring ZUNO!**

### ZUNO – Inclusive Learning. Personalized Growth. Equal Opportunities.
