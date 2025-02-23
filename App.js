import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import LandingPage from './components/LandingPage';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';
import Profile from './components/Profile';
import MentalHealthReport from './components/MentalHealthReport';

const App = () => {
  const { user } = useAuth();

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />\
        <Route path="/mentalhealthreport" element={<MentalHealthReport />} /> {/* Corrected self-closing tag */}
      </Routes>
    </div>
  );
};

export default App;