import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="dashboard-nav">
      <div className="nav-container">
        <div className="nav-brand">
          Health Insurance
        </div>
        <div className="nav-menu">
          <Link to="/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/profile" className="nav-item">Profile</Link>
          <Link to="/mentalhealthreport" className="nav-item">Mental Health</Link>
          <button 
            onClick={handleLogout}
            className="hero-button hero-button-primary logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;