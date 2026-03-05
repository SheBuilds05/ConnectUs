import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: '' // Empty initially to force selection
  });

  const [selectedType, setSelectedType] = useState(null);

  // Your exact color palette
  const colors = {
    forest: '#0D330E',    // Pakistan Green
    leaf: '#2D531A',      // Dark Moss
    moss: '#477023',      // Fern Green
    sage: '#6E8649',      // Reseda Green
    canvas: '#D3D3D3',    // Gray background
    white: '#FFFFFF',
    text: '#1F2E2A'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.accountType) {
      alert('Please select whether you want to register as a Customer or a Runner');
      return;
    }
    console.log('Register:', formData);
  };

  const selectAccountType = (type) => {
    setFormData({...formData, accountType: type});
    setSelectedType(type);
  };

  // Professional SVG Icons (matching landing page)
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
        maxWidth: '500px',
        width: '90%',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        margin: '2rem auto'
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
            Create Account
          </h2>
          <p style={{ 
            color: colors.leaf, 
            fontSize: '1rem',
            opacity: 0.9
          }}>
            Join ConnectUs and start your journey
          </p>
        </div>

        {/* Account Type Selection */}
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
              onClick={() => selectAccountType('customer')}
              style={{
                padding: '2rem 1rem',
                borderRadius: '16px',
                border: `2px solid ${selectedType === 'customer' ? colors.moss : `${colors.sage}30`}`,
                backgroundColor: selectedType === 'customer' ? `${colors.moss}08` : colors.white,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: selectedType === 'customer' ? `0 8px 20px ${colors.moss}20` : 'none'
              }}
              onMouseEnter={(e) => {
                if (selectedType !== 'customer') {
                  e.currentTarget.style.borderColor = colors.moss;
                  e.currentTarget.style.backgroundColor = `${colors.moss}05`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedType !== 'customer') {
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
                color: selectedType === 'customer' ? colors.moss : colors.forest, 
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
              {selectedType === 'customer' && (
                <div style={{ 
                  color: colors.moss, 
                  fontSize: '1rem', 
                  marginTop: '1rem',
                  fontWeight: '500'
                }}>
                  Selected ✓
                </div>
              )}
            </div>

            {/* Runner Card */}
            <div
              onClick={() => selectAccountType('runner')}
              style={{
                padding: '2rem 1rem',
                borderRadius: '16px',
                border: `2px solid ${selectedType === 'runner' ? colors.moss : `${colors.sage}30`}`,
                backgroundColor: selectedType === 'runner' ? `${colors.moss}08` : colors.white,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: selectedType === 'runner' ? `0 8px 20px ${colors.moss}20` : 'none'
              }}
              onMouseEnter={(e) => {
                if (selectedType !== 'runner') {
                  e.currentTarget.style.borderColor = colors.moss;
                  e.currentTarget.style.backgroundColor = `${colors.moss}05`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedType !== 'runner') {
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
                color: selectedType === 'runner' ? colors.moss : colors.forest, 
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
              {selectedType === 'runner' && (
                <div style={{ 
                  color: colors.moss, 
                  fontSize: '1rem', 
                  marginTop: '1rem',
                  fontWeight: '500'
                }}>
                  Selected ✓
                </div>
              )}
            </div>
          </div>
          
          {!formData.accountType && (
            <p style={{ 
              color: '#e53e3e', 
              fontSize: '0.85rem', 
              marginTop: '1rem', 
              textAlign: 'center' 
            }}>
              Please select an account type to continue
            </p>
          )}
        </div>

        {/* Form - Only shown after account type selection */}
        {formData.accountType && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                color: colors.forest, 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: `1px solid ${colors.sage}30`,
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your full name"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.moss;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.moss}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${colors.sage}30`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                color: colors.forest, 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: `1px solid ${colors.sage}30`,
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your email"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.moss;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.moss}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${colors.sage}30`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                color: colors.forest, 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: `1px solid ${colors.sage}30`,
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Create a password"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.moss;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.moss}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${colors.sage}30`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                color: colors.forest, 
                display: 'block', 
                marginBottom: '0.5rem',
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: `1px solid ${colors.sage}30`,
                  outline: 'none',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Confirm your password"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.moss;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.moss}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${colors.sage}30`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
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
                cursor: 'pointer', 
                fontWeight: '600',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                transition: 'all 0.2s',
                boxShadow: `0 4px 12px ${colors.forest}40`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.moss;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 16px ${colors.forest}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.forest;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.forest}40`;
              }}
            >
              Create {formData.accountType === 'customer' ? 'Customer' : 'Runner'} Account
            </button>
          </form>
        )}

        {/* Change selection link */}
        {formData.accountType && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button
              onClick={() => {
                setFormData({...formData, accountType: ''});
                setSelectedType(null);
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
              ← Change account type
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
