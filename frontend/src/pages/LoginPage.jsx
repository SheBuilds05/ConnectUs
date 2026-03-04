import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

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
    console.log('Login:', formData);
  };

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
      justifyContent: 'center'
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

      {/* Login Card */}
      <div style={{ 
        backgroundColor: colors.white,
        borderRadius: '24px',
        padding: '3rem',
        maxWidth: '450px',
        width: '90%',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
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
            Welcome Back
          </h2>
          <p style={{ 
            color: colors.leaf, 
            fontSize: '1rem',
            opacity: 0.9
          }}>
            Sign in to continue to ConnectUs
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
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

          <div style={{ marginBottom: '1rem' }}>
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
              placeholder="Enter your password"
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

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem' 
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox" 
                checked={formData.rememberMe} 
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                style={{ 
                  width: '18px', 
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: colors.moss
                }} 
              />
              <span style={{ color: colors.leaf, fontSize: '0.95rem' }}>Remember me</span>
            </label>
            <Link 
              to="/forgot-password" 
              style={{ 
                color: colors.moss, 
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.forest}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.moss}
            >
              Forgot Password?
            </Link>
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
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: `${colors.sage}30` }} />
          <span style={{ color: colors.leaf, fontSize: '0.9rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: `${colors.sage}30` }} />
        </div>

        {/* Social Login */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <button
            style={{ 
              padding: '0.8rem',
              borderRadius: '50px',
              border: `1px solid ${colors.sage}30`,
              backgroundColor: colors.white,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.canvas;
              e.currentTarget.style.borderColor = colors.moss;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.white;
              e.currentTarget.style.borderColor = `${colors.sage}30`;
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📧</span>
            <span style={{ color: colors.forest }}>Email</span>
          </button>
          <button
            style={{ 
              padding: '0.8rem',
              borderRadius: '50px',
              border: `1px solid ${colors.sage}30`,
              backgroundColor: colors.white,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.canvas;
              e.currentTarget.style.borderColor = colors.moss;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.white;
              e.currentTarget.style.borderColor = `${colors.sage}30`;
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📱</span>
            <span style={{ color: colors.forest }}>Phone</span>
          </button>
        </div>

        {/* Register Link */}
        <p style={{ 
          textAlign: 'center', 
          color: colors.leaf,
          fontSize: '0.95rem'
        }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ 
              color: colors.moss, 
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.forest}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.moss}
          >
            Register here
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
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;