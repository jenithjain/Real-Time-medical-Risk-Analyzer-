import React, { useState, useEffect } from 'react';
import DashboardContent from './DashboardContent';
import NavBar from './NavBar';
// import LoadingSpinner from './LoadingSpinner'; // Ensure this line is removed if not using LoadingSpinner
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(false); // Ensure loading is set to false

  useEffect(() => {
    // Simulate a network request
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <NavBar />
      {/* Remove the conditional rendering for LoadingSpinner */}
      <DashboardContent />
    </div>
  );
};

export default Dashboard;