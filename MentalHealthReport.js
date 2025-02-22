import React, { useState, useEffect } from 'react';
import './MentalHealthReport.css';
import NavBar from './NavBar';

const questions = [
  "What’s the first word that comes to your mind when you hear ‘flowers’?",
  "Complete the sentence: ‘Life is…’",
  "You’re walking alone at night, and you hear footsteps behind you. What’s your immediate reaction?",
  "You find a wallet full of money on the street. What do you do?",
  "A friend cancels on you last minute. What’s your immediate thought?",
  "A stranger smiles at you. How do you interpret it?",
  "If your mind was a weather condition, what would it be?",
  "Describe your reflection in a mirror, but not physically."
];

const MentalHealthReport = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showResults, setShowResults] = useState(false); // ✅ Ensure UI updates

  const handleResponse = async () => {
    if (!currentResponse.trim()) {
      console.warn('Response is empty. Please enter a response.');
      return;
    }

    setResponses(prevResponses => [...prevResponses, currentResponse]); // ✅ Functional update
    setCurrentResponse('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      try {
        console.log('Sending responses to the server:', [...responses, currentResponse]);
        const result = await fetch('http://localhost:8000/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responses: [...responses, currentResponse] }) // ✅ Send updated responses
        });

        if (!result.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await result.json();
        console.log('Received data from server:', data);

        setRiskScores(data.riskScores);
        setOverallScore(data.overallScore);
        setShowResults(true); // ✅ Show results
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const riskLevel =
    overallScore <= 3 ? 'Low risk - Healthy mental state.' :
    overallScore <= 6 ? 'Moderate risk - Consider self-care and mindfulness.' :
    'High risk - Consider professional support.';

  return (
    <div className='mentalhealthreport'>
      <NavBar />
    <div className="mental-health-report">
      <h2>Mental Health Report</h2>
      {!showResults ? (
        <div className="question-section">
          <h3>Question {currentQuestionIndex + 1}</h3>
          <p>{questions[currentQuestionIndex]}</p>
          <input
            type="text"
            placeholder="Your response"
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
          />
          <button className='submit-button' onClick={handleResponse}>Submit</button>
        </div>
      ) : (
        <div className="report-content">
          {responses.map((response, index) => (
            <div key={index} className="response-item">
              <h3>Question {index + 1}</h3>
              <p><strong>Response:</strong> {response}</p>
              <p><strong>Risk Score:</strong> {riskScores[index]}/10</p>
            </div>
          ))}
          <div className="overall-score">
            <h3>Overall Mental Health Risk Score: {overallScore}/10</h3>
            <p>{riskLevel}</p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default MentalHealthReport;
