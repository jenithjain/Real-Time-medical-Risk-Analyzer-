import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import '../App.css';

const LandingPage = () => (
  <>
    <div className="landing-background"></div>
    <div className="nav-buttons">
      <div className='logo'></div>
      <Link to="/login" className="nav-button nav-button-secondary">Login</Link>
      <Link to="/signup" className="nav-button nav-button-primary">Sign Up</Link>
    </div>
    <section className="hero">
      <h1 className="hero-title">
        Smart Health Insurance
        <span className="hero-highlight">
          <span className="hero-highlight-text">Made Simple</span>
          <div className="hero-highlight-bg"></div>
        </span>
      </h1>

      <p className="hero-description">
        Join thousands of users who trust our platform for their health insurance needs. Experience seamless coverage and powerful benefits.
      </p>

      <div className="feature-boxes">
        <div className="feature-box">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h3>Smart Coverage Tracking</h3>
          <p>Real-time policy tracking with instant updates and personalized coverage recommendations.</p>
          <button className="feature-link">Learn More</button>
        </div>

        <div className="feature-box">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3>Health Benefits</h3>
          <p>Comprehensive health benefits with rewards and wellness program integration.</p>
          <button className="feature-link">Join Benefits</button>
        </div>

        <div className="feature-box">
          <div className="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <h3>Smart Recommendations</h3>
          <p>AI-powered suggestions for the best coverage options and health plans for your needs.</p>
          <button className="feature-link">Explore Plans</button>
        </div>
      </div>

    </section>

    <div className="features-background">
      <div className="features-pattern"></div>
      <div className="features-decoration-1"></div>
      <div className="features-decoration-2"></div>
    </div>
  </>
);

export default LandingPage;