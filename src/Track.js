import React from 'react';
import './Track.css'; // Assuming you'll add custom styles here

const Track = () => {
  return (
    <div className="track-container">
      <h2>Track</h2>
      <p>Finish task in Project 3 <span>Today</span></p>
      <div className="calendar">
        {/* Add a calendar component or library here */}
        <p>Calendar Placeholder</p>
      </div>
    </div>
  );
};

export default Track;
