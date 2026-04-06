import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer, registerRunner, registerAdmin } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Customer form state
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    idNumber: ''
  });
  //Admin form state
  const [adminData, setAdminData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  secretCode: ''
});

  // Runner form state
  const [runnerData, setRunnerData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    idNumber: '',
    bio: ''
  });

  const colors = {
    forest: '#0D330E',
    leaf: '#2D531A',
    moss: '#477023',
    sage: '#6E8649',
    canvas: '#D3D3D3',
    white: '#FFFFFF',
    text: '#1F2E2A'
  };

  // Validate SA ID number (13 digits)
  const validateSAID = (id: string) => {
    const saIDRegex = /^\d{13}$/;
    return saIDRegex.test(id);
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (customerData.password !== customerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (customerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!customerData.firstName || !customerData.lastName) {
      setError('Please enter your full name');
      return;
    }

    if (!validateSAID(customerData.idNumber)) {
      setError('Please enter a valid 13-digit SA ID number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userData = {
        firstName: customerData.firstName.trim(),
        lastName: customerData.lastName.trim(),
        email: customerData.email.trim().toLowerCase(),
        password: customerData.password,
        id_num: customerData.idNumber
      };

      console.log('Sending customer registration data:', userData);
      
      const response = await registerCustomer(userData);
      
      console.log('Customer registration successful:', response);
      setSuccess('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (adminData.password !== adminData.confirmPassword) {
    setError('Passwords do not match'); return;
  }
  if (adminData.secretCode !== '1875') {
    setError('Invalid secret code'); return;
  }
  setLoading(true); setError(''); setSuccess('');
  try {
    await registerAdmin({
      firstName: adminData.firstName.trim(),
      lastName: adminData.lastName.trim(),
      email: adminData.email.trim().toLowerCase(),
      password: adminData.password,
      secretCode: adminData.secretCode
    });
    setSuccess('Admin account created! Redirecting...');
    setTimeout(() => navigate('/admin'), 2000);
  } catch (err: any) {
    setError(err.message || 'Registration failed.');
  } finally {
    setLoading(false);
  }
};

  const handleRunnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (runnerData.password !== runnerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (runnerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!runnerData.username) {
      setError('Username is required');
      return;
    }

    if (!validateSAID(runnerData.idNumber)) {
      setError('Please enter a valid 13-digit SA ID number');
      return;
    }

    if (!runnerData.phone) {
      setError('Phone number is required');
      return;
    }

    if (!runnerData.address || !runnerData.city) {
      setError('Address and city are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userData = {
        username: runnerData.username.trim(),
        email: runnerData.email.trim().toLowerCase(),
        password: runnerData.password,
        phone: runnerData.phone,
        address: runnerData.address,
        city: runnerData.city,
        postalCode: runnerData.postalCode,
        id_number: runnerData.idNumber,
        bio: runnerData.bio
      };

      console.log('Sending runner registration data:', userData);
      
      const response = await registerRunner(userData);
      
      console.log('Runner registration successful:', response);
      setSuccess('Runner registration successful! Your profile is pending verification. You will be notified once verified.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectAccountType = (type: string) => {
    setSelectedType(type);
    setError('');
  };

  const CustomerIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke={selectedType === 'customer' ? colors.moss : colors.forest} strokeWidth="1.5"/>
      <path d="M5 18V17C5 14.2386 7.23858 12 10 12H14C16.7614 12 19 14.2386 19 17V18" stroke={selectedType === 'customer' ? colors.moss : colors.forest} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 9L18 6M18 6L21 9M18 6L18 12" stroke={colors.sage} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const RunnerIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3" stroke={selectedType === 'runner' ? colors.moss : colors.forest} strokeWidth="1.5"/>
      <path d="M5 18L7 15L10 18L14 13L17 16L19 14" stroke={selectedType === 'runner' ? colors.moss : colors.forest} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 21L15 18L12 20L9 18L6 21" stroke={colors.sage} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={{ 
      backgroundColor: colors.canvas, 
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'auto'
    }}>
      {/* Background Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.moss}20, ${colors.sage}20)`,
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${colors.forest}20, ${colors.leaf}20)`,
        zIndex: 0
      }} />

      {/* Register Card */}
      <div style={{ 
        backgroundColor: colors.white,
        borderRadius: '24px',
        padding: '3rem',
        maxWidth: selectedType ? '600px' : '500px',
        width: '90%',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        margin: '2rem auto',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Logo Section */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            backgroundColor: colors.forest, 
            width: '64px', 
            height: '64px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem',
            boxShadow: `0 10px 20px ${colors.forest}30`
          }}>
            <span style={{ color: colors.white, fontSize: '2rem', fontWeight: '600' }}>C</span>
          </div>
          <h2 style={{ 
            color: colors.forest, 
            fontSize: '2rem', 
            fontWeight: '700',
            marginBottom: '0.5rem',
            letterSpacing: '-0.5px'
          }}>
            {selectedType === 'customer' ? 'Create Customer Account' : 
             selectedType === 'runner' ? 'Become a Runner' : 
             'Create Account'}
          </h2>
          <p style={{ 
            color: colors.leaf, 
            fontSize: '1rem',
            opacity: 0.9
          }}>
            {selectedType === 'customer' ? 'Join as a customer and start ordering' : 
             selectedType === 'runner' ? 'Start earning by delivering items' : 
             'Join ConnectUs and start your journey'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            backgroundColor: '#e6ffe6',
            color: '#2d531a',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            border: '1px solid #b3ffb3'
          }}>
            {success}
          </div>
        )}

        {/* Account Type Selection - Only show if no type selected */}
        {!selectedType && (
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ 
              color: colors.forest, 
              display: 'block', 
              marginBottom: '1rem', 
              fontWeight: '600', 
              fontSize: '1rem' 
            }}>
              I want to register as:
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Customer Card */}
              <div
                onClick={() => !loading && selectAccountType('customer')}
                style={{
                  padding: '2rem 1rem',
                  borderRadius: '16px',
                  border: `2px solid ${colors.sage}30`,
                  backgroundColor: colors.white,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = colors.moss;
                    e.currentTarget.style.backgroundColor = `${colors.moss}05`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = `${colors.sage}30`;
                    e.currentTarget.style.backgroundColor = colors.white;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <CustomerIcon />
                </div>
                <h3 style={{ 
                  color: colors.forest, 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1.2rem'
                }}>
                  Customer
                </h3>
                <p style={{ 
                  color: colors.leaf, 
                  fontSize: '0.85rem',
                  lineHeight: '1.5'
                }}>
                  I need items delivered to me
                </p>
              </div>

              {/* Runner Card */}
              <div
                onClick={() => !loading && selectAccountType('runner')}
                style={{
                  padding: '2rem 1rem',
                  borderRadius: '16px',
                  border: `2px solid ${colors.sage}30`,
                  backgroundColor: colors.white,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = colors.moss;
                    e.currentTarget.style.backgroundColor = `${colors.moss}05`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = `${colors.sage}30`;
                    e.currentTarget.style.backgroundColor = colors.white;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <RunnerIcon />
                </div>
                <h3 style={{ 
                  color: colors.forest, 
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  fontSize: '1.2rem'
                }}>
                  Runner
                </h3>
                <p style={{ 
                  color: colors.leaf, 
                  fontSize: '0.85rem',
                  lineHeight: '1.5'
                }}>
                  I want to deliver items to others
                </p>
              </div>
            </div>
          </div>
        )}
{/* Admin Card */}
<div
  onClick={() => !loading && selectAccountType('admin')}
  style={{
    padding: '2rem 1rem',
    borderRadius: '16px',
    border: `2px solid ${colors.sage}30`,
    backgroundColor: colors.white,
    cursor: loading ? 'not-allowed' : 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    opacity: loading ? 0.6 : 1
  }}
  onMouseEnter={(e) => {
    if (!loading) {
      e.currentTarget.style.borderColor = colors.moss;
      e.currentTarget.style.backgroundColor = `${colors.moss}05`;
      e.currentTarget.style.transform = 'translateY(-2px)';
    }
  }}
  onMouseLeave={(e) => {
    if (!loading) {
      e.currentTarget.style.borderColor = `${colors.sage}30`;
      e.currentTarget.style.backgroundColor = colors.white;
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }}
>
  <div style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>🛡️</div>
  <h3 style={{ color: colors.forest, marginBottom: '0.5rem', fontWeight: '600', fontSize: '1.2rem' }}>
    Admin
  </h3>
  <p style={{ color: colors.leaf, fontSize: '0.85rem', lineHeight: '1.5' }}>
    Platform administrator access
  </p>
</div>

        {/* Admin Registration Form */}
{selectedType === 'admin' && (
  <form onSubmit={handleAdminSubmit}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
      <div>
        <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>First Name</label>
        <input type="text" value={adminData.firstName}
          onChange={(e) => setAdminData({...adminData, firstName: e.target.value})}
          style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
          placeholder="First name" required disabled={loading} />
      </div>
      <div>
        <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>Last Name</label>
        <input type="text" value={adminData.lastName}
          onChange={(e) => setAdminData({...adminData, lastName: e.target.value})}
          style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
          placeholder="Last name" required disabled={loading} />
      </div>
    </div>

    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>Email Address</label>
      <input type="email" value={adminData.email}
        onChange={(e) => setAdminData({...adminData, email: e.target.value})}
        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
        placeholder="Admin email" required disabled={loading} />
    </div>

    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>Secret Code</label>
      <input type="password" value={adminData.secretCode}
        onChange={(e) => setAdminData({...adminData, secretCode: e.target.value})}
        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
        placeholder="Enter admin secret code" required disabled={loading} />
    </div>

    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>Password</label>
      <input type="password" value={adminData.password}
        onChange={(e) => setAdminData({...adminData, password: e.target.value})}
        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
        placeholder="Create a password" required disabled={loading} minLength={6} />
    </div>

    <div style={{ marginBottom: '2rem' }}>
      <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>Confirm Password</label>
      <input type="password" value={adminData.confirmPassword}
        onChange={(e) => setAdminData({...adminData, confirmPassword: e.target.value})}
        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
        placeholder="Confirm your password" required disabled={loading} />
    </div>

    <button type="submit"
      style={{ backgroundColor: colors.forest, color: colors.white, width: '100%', padding: '1rem', borderRadius: '50px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '1rem', marginBottom: '1.5rem', opacity: loading ? 0.7 : 1 }}
      disabled={loading}>
      {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
    </button>
  </form>
)}

        {/* Runner Registration Form */}
        {selectedType === 'runner' && (
          <form onSubmit={handleRunnerSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                Username
              </label>
              <input
                type="text"
                value={runnerData.username}
                onChange={(e) => setRunnerData({...runnerData, username: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                placeholder="Choose a username"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                Email Address
              </label>
              <input
                type="email"
                value={runnerData.email}
                onChange={(e) => setRunnerData({...runnerData, email: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={runnerData.phone}
                onChange={(e) => setRunnerData({...runnerData, phone: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                placeholder="+27 XX XXX XXXX"
                required
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                SA ID Number
              </label>
              <input
                type="text"
                value={runnerData.idNumber}
                onChange={(e) => setRunnerData({...runnerData, idNumber: e.target.value.replace(/\D/g, '').slice(0, 13)})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                placeholder="13-digit SA ID number"
                required
                disabled={loading}
                maxLength={13}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                Address
              </label>
              <input
                type="text"
                value={runnerData.address}
                onChange={(e) => setRunnerData({...runnerData, address: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                placeholder="Street address"
                required
                disabled={loading}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                  City
                </label>
                <input
                  type="text"
                  value={runnerData.city}
                  onChange={(e) => setRunnerData({...runnerData, city: e.target.value})}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                  placeholder="City"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  value={runnerData.postalCode}
                  onChange={(e) => setRunnerData({...runnerData, postalCode: e.target.value})}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                  placeholder="Postal code"
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                Bio (Optional)
              </label>
              <textarea
                value={runnerData.bio}
                onChange={(e) => setRunnerData({...runnerData, bio: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' }}
                placeholder="Tell us a bit about yourself and your experience..."
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                Password
              </label>
              <input
                type="password"
                value={runnerData.password}
                onChange={(e) => setRunnerData({...runnerData, password: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                placeholder="Create a password (min. 6 characters)"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={runnerData.confirmPassword}
                onChange={(e) => setRunnerData({...runnerData, confirmPassword: e.target.value})}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              style={{ 
                backgroundColor: colors.forest, 
                color: colors.white, 
                width: '100%', 
                padding: '1rem', 
                borderRadius: '50px', 
                border: 'none', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontWeight: '600',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                transition: 'all 0.2s',
                boxShadow: `0 4px 12px ${colors.forest}40`,
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Become a Runner'}
            </button>
          </form>
        )}

        {/* Back to type selection */}
        {selectedType && !loading && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={() => {
                setSelectedType(null);
                setError('');
              }}
              style={{ 
                color: colors.moss, 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.forest}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.moss}
            >
              ← Choose different account type
            </button>
          </div>
        )}

        {/* Sign In Link */}
        <p style={{ 
          textAlign: 'center', 
          color: colors.leaf,
          fontSize: '0.95rem'
        }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={{ 
              color: colors.moss, 
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.forest}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.moss}
          >
            Sign in
          </Link>
        </p>

        {/* Admin Link */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${colors.sage}30`
        }}>
          <Link 
            to="/admin" 
            style={{ 
              color: colors.sage, 
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.moss}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.sage}
          >
            Admin Access →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;