import React, { useState } from 'react';
import './Profile.css';

// Tab configuration for easy maintenance
const TABS = [
  { id: 'basic', label: 'Basic Info', icon: '👤' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
  { id: 'medical', label: 'Medical History', icon: '🏥' },
  { id: 'stats', label: 'Activity Stats', icon: '📊' }
];

const ProfileContent = () => {
  const [activeTab, setActiveTab] = useState('basic');

  const profile = {
    avatar: "https://via.placeholder.com/150",
    name: "John Doe",
    designation: "Software Engineer",
    bio: "Health enthusiast focused on maintaining a balanced lifestyle. Passionate about technology and innovation.",
    age: 32,
    gender: "Male",
    contact: {
      email: "john.doe@example.com",
      phone: "+1 234 567 8900",
      address: "123 Main St, Anytown, USA",
      emergencyContact: "Jane Doe (+1 987 654 3210)"
    },
    lifestyle: {
      smoker: "No",
      alcohol: "Occasional",
      exercise: "2-3 times/week",
      diet: "Balanced, includes a variety of fruits and vegetables",
      sleep: "7-8 hours/day",
      stress: "Moderate, managed through yoga and meditation",
      hobbies: "Cycling, Reading, Hiking, Painting, Traveling, Cooking",
      favoriteCuisine: "Italian, enjoys experimenting with new recipes"
    },
    medicalHistory: {
      chronicDiseases: ["None"],
      pastSurgeries: ["Appendectomy (2018)", "Knee Surgery (2020)"],
      familyHistory: ["Diabetes (Father)", "Hypertension (Mother)", "Heart Disease (Grandfather)"],
      allergies: ["None"],
      medications: ["None"],
      vaccinations: ["COVID-19", "Flu", "Hepatitis B"],
      recentCheckup: "2023-01-15"
    },
    activityStats: {
      weeklyExercise: 3,
      avgSteps: 8000,
      avgSleep: 7.5,
      waterIntake: 2.5,
      caloriesBurned: 2000,
      activeMinutes: 150
    }
  };

  const renderProfileHeader = () => (
    <div className="profile-hero">
      <div className="profile-hero-content">
        <div className="profile-avatar">
          <img src={profile.avatar} alt={profile.name} />
        </div>
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <h3>{profile.designation}</h3>
          <p>{profile.bio}</p>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="profile-tabs">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderBasicInfo = () => (
    <div className="info-grid">
      <InfoCard label="Age" value={profile.age} />
      <InfoCard label="Gender" value={profile.gender} />
      <InfoCard label="Email" value={profile.contact.email} />
      <InfoCard label="Phone" value={profile.contact.phone} />
      <InfoCard label="Address" value={profile.contact.address} />
      <InfoCard label="Emergency Contact" value={profile.contact.emergencyContact} />
    </div>
  );

  const renderLifestyle = () => (
    <div className="lifestyle-grid">
      {Object.entries(profile.lifestyle).map(([key, value]) => (
        <StatusCard
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          icon={getLifestyleIcon(key)}
        />
      ))}
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="medical-grid">
      <HistoryCard
        title="Chronic Diseases"
        items={profile.medicalHistory.chronicDiseases}
      />
      <HistoryCard
        title="Past Surgeries"
        items={profile.medicalHistory.pastSurgeries}
      />
      <HistoryCard
        title="Family History"
        items={profile.medicalHistory.familyHistory}
      />
      <HistoryCard
        title="Allergies"
        items={profile.medicalHistory.allergies}
      />
      <HistoryCard
        title="Medications"
        items={profile.medicalHistory.medications}
      />
      <HistoryCard
        title="Vaccinations"
        items={profile.medicalHistory.vaccinations}
      />
      <InfoCard label="Recent Checkup" value={profile.medicalHistory.recentCheckup} />
    </div>
  );

  const renderActivityStats = () => (
    <div className="stats-grid">
      <StatCard
        label="Weekly Exercise"
        value={profile.activityStats.weeklyExercise}
        unit="days"
        icon="🏃‍♂️"
      />
      <StatCard
        label="Average Steps"
        value={profile.activityStats.avgSteps}
        unit="steps"
        icon="👣"
      />
      <StatCard
        label="Sleep"
        value={profile.activityStats.avgSleep}
        unit="hours"
        icon="😴"
      />
      <StatCard
        label="Water Intake"
        value={profile.activityStats.waterIntake}
        unit="L"
        icon="💧"
      />
      <StatCard
        label="Calories Burned"
        value={profile.activityStats.caloriesBurned}
        unit="kcal"
        icon="🔥"
      />
      <StatCard
        label="Active Minutes"
        value={profile.activityStats.activeMinutes}
        unit="minutes"
        icon="⏱️"
      />
    </div>
  );

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'lifestyle':
        return renderLifestyle();
      case 'medical':
        return renderMedicalHistory();
      case 'stats':
        return renderActivityStats();
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      {renderProfileHeader()}
      <div className="profile-content">
        {renderTabs()}
        <div className="tab-content">
          {renderActiveTabContent()}
        </div>
      </div>
    </div>
  );
};

// Reusable components
const InfoCard = ({ label, value }) => (
  <div className="info-card">
    <label>{label}</label>
    <span>{value}</span>
  </div>
);

const StatusCard = ({ label, value, icon }) => (
  <div className="status-card">
    <span className="status-icon">{icon}</span>
    <div className="status-content">
      <label>{label}</label>
      <span>{value}</span>
    </div>
  </div>
);

const HistoryCard = ({ title, items }) => (
  <div className="history-card">
    <h3>{title}</h3>
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const StatCard = ({ label, value, unit, icon }) => (
  <div className="stat-card">
    <span className="stat-icon">{icon}</span>
    <div className="stat-content">
      <label>{label}</label>
      <span className="stat-value">{value} {unit}</span>
    </div>
  </div>
);

const getLifestyleIcon = (type) => {
  const icons = {
    smoker: '🚭',
    alcohol: '🍷',
    exercise: '🏃‍♂️',
    diet: '🥗',
    sleep: '😴',
    stress: '🧘‍♂️',
    hobbies: '🎨'
  };
  return icons[type] || '❓';
};

export default ProfileContent;