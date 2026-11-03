
import { Link } from "react-router-dom";
import "../App.css";

export default function LandingPage() {
  return (
    <div className="landing-page">

      {/* Navigation */}
      <header className="navbar">
        <Link to="/" className="logo">
          <><strong>ZUNO</strong></>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/staff-access">Educator access</Link>
          
          <Link to="/disability-selection" className="primary-button">
            Start Learning
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero">
          <div className="hero-content">

            <span className="hero-badge">
              Learning made personal
            </span>

            <h1>
              Learn at your own pace.
              <br />
              <span>Your way.</span>
            </h1>

            <p>
              A learning experience that understands your needs,
              adapts to your pace, and helps you grow with confidence.
            </p>

            <div className="hero-buttons">
              <Link
                to="/disability-selection"
                className="primary-button"
              >
                Start Learning →
              </Link>

              <a href="#features" className="secondary-button">
                Explore Features
              </a>
            </div>

            <div className="hero-note">
              ✨ Your learning journey. Your choices. Your progress.
            </div>
          </div>

          <div className="hero-visual">
            <div className="learning-card">
              <div className="learning-card-top">
                <span className="learning-label">YOUR LEARNING SPACE</span>
                <span className="learning-dot">●</span>
              </div>

              <h3>Small steps, big progress.</h3>

              <p>Every learner has their own way of learning.</p>

              <div className="learning-progress">
                <div className="learning-progress-fill"></div>
              </div>

              <div className="learning-progress-text">
                <span>Keep going</span>
                <span>At your pace</span>
              </div>

              <div className="learning-card-bottom">
                <span>📖 Learn</span>
                <span>🎯 Practice</span>
                <span>🌱 Grow</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="features-section">
          <div className="section-heading">
            <span>WHAT MAKES US DIFFERENT</span>
            <h2>Learning that works for you</h2>
            <p>
              A flexible learning environment designed around individual needs.
            </p>
          </div>

          <div className="features-grid">

            <article className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Adaptive Learning</h3>
              <p>
                Learning activities adjust according to your understanding
                and progress.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">♿</div>
              <h3>Accessible by Design</h3>
              <p>
                Comfortable learning with accessibility options
                and flexible content formats.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Your Own Pace</h3>
              <p>
                Learn, practice, and improve without unnecessary pressure.
              </p>
            </article> 
            <article className="feature-card"><div className="feature-icon">🗣️</div><h3>3-language Audio Lessons</h3><p>Listen in English, Telugu or Hindi with adjustable speed, pause and resume controls.</p></article>
            <article className="feature-card"><div className="feature-icon">📝</div><h3>Teacher-Created Tests</h3><p>Teachers can build multi-question tests, set marks and review learner answers.</p></article>
            <article className="feature-card"><div className="feature-icon">🤝</div><h3>Explainable Learning Support</h3><p>Understand why a lesson format or next step is suggested, and change it whenever you need.</p></article>
            <article className="feature-card"><div className="feature-icon">🧩</div><h3>Step-by-Step Practice</h3><p>Get worked examples, hints and supportive feedback when an answer needs another try.</p></article>
            <article className="feature-card"><div className="feature-icon">🎯</div><h3>Personal Learning Plans</h3><p>Teachers can suggest a style, pace and goal while learners remain in control.</p></article>
            <article className="feature-card"><div className="feature-icon">📊</div><h3>Progress & Marks Reports</h3><p>Track diagnostic results, practice scores and teacher-test marks in clear summaries.</p></article>
            <article className="feature-card"><div className="feature-icon">⌨️</div><h3>Keyboard-Friendly Controls</h3><p>Navigate learning activities with visible focus and alternatives to dragging.</p></article>
            <article className="feature-card"><div className="feature-icon">💾</div><h3>Saved Learning Progress</h3><p>Previously saved lessons and browser progress remain available on the same device.</p></article>

          </div>
        </section>

        {/* About */}
        <section id="about" className="about-section">
          <div className="about-content">
            <span>OUR PURPOSE</span>
            <h2>Every student deserves a learning experience that fits.</h2>
            <p>
              ZUNO helps students learn through personalized,
              accessible, and adaptive educational experiences.
              Our goal is to make learning more inclusive and empowering
              for everyone.
            </p>

            <Link to="/disability-selection" className="primary-button">
              Begin Your Journey →
            </Link>
          </div>
        </section>
      </main>



    </div>
  );
}
