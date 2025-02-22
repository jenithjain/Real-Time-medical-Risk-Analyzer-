import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Email validation
    if (!email) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      alert('Please enter a valid email address');
      return;
    }

    // Password validation
    if (!password) {
      setError('Password is required');
      alert('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        // Show error message if email or password is incorrect
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="feature-card" style={{maxWidth: '400px'}}>
        <h2 className="feature-title text-center">Welcome Back!</h2>
        {error && (
          <div className="error-message" style={{ 
            backgroundColor: '#fee2e2', 
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        {/* Rest of the form remains the same */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{width: '92%', marginBottom: '1rem'}}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="newsletter-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{width: '92%', marginBottom: '1rem'}}
            />
          </div>
          <button type="submit" className="hero-button hero-button-primary" style={{width: '100%'}}>
            Login
          </button>
          <div className="auth-switch" style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: 'var(--text-color)'
          }}>
            Don't have an account? <Link to="/signup" style={{
              color: 'var(--text-color)',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-color)'}
            >Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;   