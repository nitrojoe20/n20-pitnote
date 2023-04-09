import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Welcome to PitNote</h1>
      <p>Track your team's performance and get real-time recommendations to improve your car's speed.</p>
      <div className="button-group">
        <button className="button">Race History</button>
        <button className="button">Performance Analysis</button>
        <button className="button">Car Settings</button>
        <button className="button">Weather Forecast</button>
        <button className="button">Strategy Planner</button>
        <button className="button">Team Communication</button>
        <button className="button">AI Recommendations</button>
      </div>
    </div>
  );
}

export default Dashboard;