import React, { useState } from 'react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [isRunner, setIsRunner] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#213502' }}>Account Settings</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Push Notifications</label>
        <button 
          onClick={() => setNotifications(!notifications)}
          style={{ backgroundColor: notifications ? '#7EA00E' : '#ccc', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
        >
          {notifications ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      <div>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Switch Role</label>
        <select 
          value={isRunner ? 'runner' : 'customer'} 
          onChange={(e) => setIsRunner(e.target.value === 'runner')}
          style={{ padding: '10px', width: '100%', border: '2px solid #213502', borderRadius: '5px' }}
        >
          <option value="customer">Customer</option>
          <option value="runner">Runner</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;