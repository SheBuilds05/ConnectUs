import React, { useState } from 'react';

const ImageUpload = ({ onUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file); // For future cloud storage integration
    }
  };

  return (
    <div style={{ border: '2px dashed #7EA00E', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
      {preview ? (
        <img src={preview} alt="Preview" style={{ maxWidth: '100%', height: '150px', borderRadius: '4px' }} />
      ) : (
        <p style={{ color: '#213502' }}>Upload or Capture Product Image</p>
      )}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        onChange={handleFile}
        style={{ marginTop: '10px', color: '#213502' }}
      />
    </div>
  );
};

export default ImageUpload;