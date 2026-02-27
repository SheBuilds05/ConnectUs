import React from 'react';

const RunnerProfile = ({ runnerData }) => {
  // Mock data based on Vision
  const data = runnerData || {
    name: "Alex Runner",
    bio: "Fast and reliable community runner for local groceries.",
    rating: 4.8,
    completed: 124
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #7EA00E' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '60px', height: '60px', backgroundColor: '#213502', borderRadius: '50%' }}></div>
        <div>
          <h2 style={{ color: '#213502', margin: 0 }}>{data.name}</h2>
          <span style={{ color: '#7EA00E', fontWeight: 'bold' }}>⭐ {data.rating} Avg Rating</span>
        </div>
      </div>
      <p style={{ color: '#444', fontStyle: 'italic' }}>"{data.bio}"</p>
      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#213502', color: 'white', borderRadius: '5px', textAlign: 'center' }}>
        <strong>{data.completed} Missions Completed</strong>
      </div>
    </div>
  );
};

export default RunnerProfile;