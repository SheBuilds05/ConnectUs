import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from 'axios'; // Ensure axios is installed: npm install axios

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [error, setError] = useState(''); // Added error state for feedback
  const [loading, setLoading] = useState(false); // Added loading state for UX

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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

  // UPDATED: Logic to connect to your backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Send data to your authController.login endpoint
      const response = await axios.post('http://localhost:5002/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // 2. Save token and user info to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // 3. Navigate based on role (using the role from your backend)
        if (response.data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      // 4. Handle errors (Invalid credentials, etc.)
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: colors.canvas, 
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Background Decorative Elements */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px',
        borderRadius: '50%', background: `linear-gradient(135deg, ${colors.moss}20, ${colors.sage}20)`,
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px',
        borderRadius: '50%', background: `linear-gradient(135deg, ${colors.forest}20, ${colors.leaf}20)`,
        zIndex: 0
      }} />

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
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            backgroundColor: colors.forest, 
            width: '64px', height: '64px', borderRadius: '16px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 1.5rem', boxShadow: `0 10px 20px ${colors.forest}30`
          }}>
            <span style={{ color: colors.white, fontSize: '2rem', fontWeight: '600' }}>C</span>
          </div>
          <h2 style={{ color: colors.forest, fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
            Welcome Back
          </h2>
          <p style={{ color: colors.leaf, fontSize: '1rem', opacity: 0.9 }}>
            Sign in to continue to ConnectUs
          </p>

          {/* Added Error Message Display */}
          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', 
              borderRadius: '12px', marginTop: '1rem', fontSize: '0.9rem' 
            }}>
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '12px', 
                border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box'
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: colors.forest, display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.95rem' }}>
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '12px', 
                border: `1px solid ${colors.sage}30`, outline: 'none', fontSize: '1rem', boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={formData.rememberMe} 
                onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: colors.moss }} 
              />
              <span style={{ color: colors.leaf, fontSize: '0.95rem' }}>Remember me</span>
            </label>
            <Link to="/forgot-password" style={{ color: colors.moss, textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading} // Disable while loading
            style={{ 
              backgroundColor: loading ? colors.sage : colors.forest, 
              color: colors.white, width: '100%', padding: '1rem', 
              borderRadius: '50px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: '600', fontSize: '1rem', marginBottom: '1.5rem', transition: 'all 0.2s',
              boxShadow: `0 4px 12px ${colors.forest}40`
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: `${colors.sage}30` }} />
          <span style={{ color: colors.leaf, fontSize: '0.9rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: `${colors.sage}30` }} />
        </div>

        <p style={{ textAlign: 'center', color: colors.leaf, fontSize: '0.95rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: colors.moss, textDecoration: 'none', fontWeight: '600' }}>
            Register here
          </Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.sage}30` }}>
          <Link to="/admin" style={{ color: colors.sage, textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;