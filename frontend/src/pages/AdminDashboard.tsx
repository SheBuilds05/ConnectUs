import React from 'react';
import { logoutUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => { logoutUser(); navigate('/login'); };

  return (
    <div style={{ backgroundColor: '#0D330E', minHeight: '100vh', color: '#fff', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>🛡️ Admin Dashboard</h1>
        <button onClick={handleLogout}
          style={{ backgroundColor: '#477023', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '50px', cursor: 'pointer', fontWeight: '600' }}>
          Logout
        </button>
      </div>
      <p style={{ opacity: 0.8 }}>Welcome, Admin. More features coming soon.</p>
    </div>
  );
};

export default AdminDashboard;