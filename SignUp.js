import React from 'react';
import { Link } from'react-router-dom';
import './Auth.css';

const SignUp = () => (
  <div className="auth-page">
    <div className="feature-card" style={{maxWidth: '400px'}}>
      <h2 className="feature-title text-center">Create Account</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <input
            type="text"
            className="newsletter-input"
            placeholder="Full Name"
            style={{width: '92%', marginBottom: '1rem'}}
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Email Address"
            style={{width: '92%', marginBottom: '1rem'}}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="newsletter-input"
            placeholder="Password"
            style={{width: '92%', marginBottom: '1rem'}}
          />
        </div>
        <button className="hero-button hero-button-primary" style={{width: '100%'}}>
          Sign Up
        </button>
        <div className="auth-switch" style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: 'var(--text-color)'
          }}>
            Already have an account? <Link to="/login" style={{
              color: 'var(--text-color)',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
            >Login</Link>
          </div>
      </form>
    </div>
  </div>
);

export default SignUp;