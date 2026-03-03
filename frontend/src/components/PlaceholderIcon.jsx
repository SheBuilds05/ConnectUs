// src/components/PlaceholderIcon.jsx
import React from 'react';

export const PlaceholderIcon = ({ text = "C", size = 40, className = "" }) => {
  const displayText = String(text).charAt(0).toUpperCase();
  
  return (
    <div
      className={`flex items-center justify-center font-bold ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: '#e0e0e0',
        borderRadius: '50%',
        color: '#666',
        fontSize: size * 0.4
      }}
    >
      {displayText}
    </div>
  );
};