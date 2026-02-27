import React, { useState } from 'react';
import Home from './pages/Home';
import Settings from './pages/Settings';
import RunnerProfile from './pages/RunnerProfile';
import './App.css';

function App() {
  // This state acts as a temporary navigator until we add React Router
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="App">
      {/* Temporary Navigation Bar to test your designs */}
      <nav style={{ 
        padding: '10px', 
        backgroundColor: '#213502', 
        display: 'flex', 
        gap: '15px',
        justifyContent: 'center' 
      }}>
        <button onClick={() => setCurrentPage('home')} style={navBtnStyle}>Home</button>
        <button onClick={() => setCurrentPage('profile')} style={navBtnStyle}>Runner Profile</button>
        <button onClick={() => setCurrentPage('settings')} style={navBtnStyle}>Settings</button>
      </nav>

      {/* Logic to swap the page being displayed */}
      <main>
        {currentPage === 'login' && <LoginPage />}
      </main>
    </div>
  );
}

// Simple style for your temporary buttons using your brand colors
const navBtnStyle = {
  backgroundColor: '#7EA00E',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default App;