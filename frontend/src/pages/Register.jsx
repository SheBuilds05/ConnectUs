import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed via 'npm install axios'

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: '',
    adminSecret: '' // Added for admin verification
  });

  const [selectedType, setSelectedType] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Your exact color palette
  const colors = {
    forest: '#0D330E',
    leaf: '#2D531A',
    moss: '#477023',
    sage: '#6E8649',
    canvas: '#D3D3D3',
    white: '#FFFFFF',
    text: '#1F2E2A'
  };

  const handleRegister = async () => {
    try {
      const payload = { name, email, password, role, adminSecret };
    console.log("Sending to server:", payload); // Look at your Browser Console (F12)
        const response = await fetch('http://localhost:5002/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, 
                email, 
                password, 
                role, // Make sure this variable is defined and matches 'admin', 'customer', or 'runner'
                adminSecret 
            })
        });
       
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        alert('Registration successful!');
    } catch (err) {
        alert(err.message);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.accountType && !isAdminMode) {
      alert('Please select whether you want to register as a Customer or a Runner');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Prepare data for backend
      const registrationData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: isAdminMode ? 'admin' : formData.accountType,
        adminSecret: formData.adminSecret // Verified by backend
      };

      const response = await axios.post('http://localhost:5000/api/auth/register', registrationData);

      if (response.data.success) {
        // Save session
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // SMART REDIRECT LOGIC
        if (response.data.user.role === 'admin') {
          navigate('/admin'); // Direct to Admin Dashboard
        } else {
          // If customer/runner, send to their respective home/dashboard
          navigate('/home'); 
        }
      }
    }catch (err) {
      alert(err.response?.data?.message || "Registration failed. Check your details.");
    }
  };

  const selectAccountType = (type) => {
    setFormData({...formData, accountType: type});
    setSelectedType(type);
    setIsAdminMode(false);
  };

  // Professional SVG Icons
  const CustomerIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke={selectedType === 'customer' ? colors.moss : colors.forest} strokeWidth="1.5"/>
      <path d="M5 18V17C5 14.2386 7.23858 12 10 12H14C16.7614 12 19 14.2386 19 17V18" stroke={selectedType === 'customer' ? colors.moss : colors.forest} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const RunnerIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3" stroke={selectedType === 'runner' ? colors.moss : colors.forest} strokeWidth="1.5"/>
      <path d="M5 18L7 15L10 18L14 13L17 16L19 14" stroke={selectedType === 'runner' ? colors.moss : colors.forest} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={{ backgroundColor: colors.canvas, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'auto' }}>
      
      {/* Decorative Circles */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: `linear-gradient(135deg, ${colors.moss}20, ${colors.sage}20)`, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: `linear-gradient(135deg, ${colors.forest}20, ${colors.leaf}20)`, zIndex: 0 }} />

      <div style={{ backgroundColor: colors.white, borderRadius: '24px', padding: '3rem', maxWidth: '500px', width: '90%', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', margin: '2rem 0' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: colors.forest, width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: `0 10px 20px ${colors.forest}30` }}>
            <span style={{ color: colors.white, fontSize: '2rem', fontWeight: '600' }}>C</span>
          </div>
          <h2 style={{ color: colors.forest, fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {isAdminMode ? 'Admin Registration' : 'Create Account'}
          </h2>
          <p style={{ color: colors.leaf, fontSize: '1rem', opacity: 0.9 }}>
            {isAdminMode ? 'Secure access for ConnectUs managers' : 'Join ConnectUs and start your journey'}
          </p>
        </div>

        {/* Account Selection (Hidden if in Admin Mode) */}
        {!isAdminMode && (
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ color: colors.forest, display: 'block', marginBottom: '1rem', fontWeight: '600' }}>I want to register as:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div onClick={() => selectAccountType('customer')} style={{ padding: '2rem 1rem', borderRadius: '16px', border: `2px solid ${selectedType === 'customer' ? colors.moss : `${colors.sage}30`}`, textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}>
                <CustomerIcon /><br/><b>Customer</b>
              </div>
              <div onClick={() => selectAccountType('runner')} style={{ padding: '2rem 1rem', borderRadius: '16px', border: `2px solid ${selectedType === 'runner' ? colors.moss : `${colors.sage}30`}`, textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}>
                <RunnerIcon /><br/><b>Runner</b>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        {(formData.accountType || isAdminMode) && (
          <form onSubmit={handleSubmit}>
            <input 
              type="text" placeholder="Full Name" required 
              style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30` }}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
            <input 
              type="email" placeholder="Email Address" required 
              style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30` }}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            {/* Admin Secret Field - ONLY in Admin Mode */}
            {isAdminMode && (
              <input 
                type="password" placeholder="Admin Secret Code" required 
                style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '12px', border: `2px solid ${colors.moss}`, backgroundColor: `${colors.moss}05` }}
                onChange={(e) => setFormData({...formData, adminSecret: e.target.value})}
              />
            )}

            <input 
              type="password" placeholder="Password" required 
              style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30` }}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <input 
              type="password" placeholder="Confirm Password" required 
              style={{ width: '100%', padding: '1rem', marginBottom: '2rem', borderRadius: '12px', border: `1px solid ${colors.sage}30` }}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />

            <button type="submit" style={{ backgroundColor: colors.forest, color: colors.white, width: '100%', padding: '1rem', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
              Register as {isAdminMode ? 'Admin' : (formData.accountType === 'customer' ? 'Customer' : 'Runner')}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: colors.leaf }}>Already have an account? <Link to="/login" style={{ color: colors.moss, fontWeight: '600' }}>Sign in</Link></p>
          
          <button 
            onClick={() => { setIsAdminMode(!isAdminMode); setFormData({...formData, accountType: ''}); setSelectedType(null); }}
            style={{ marginTop: '1rem', background: 'none', border: 'none', color: colors.sage, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            {isAdminMode ? "← Back to User Registration" : "Admin Access →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;