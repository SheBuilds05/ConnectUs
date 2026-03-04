import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [showAbout, setShowAbout] = useState(false);

  // Your color codes
  const colors = {
    background: '#D3D3D3',    // Gray background (keep this)
    teal: '#008080',          // New teal color (replaces #4fb9af)
    mint: '#b3e0dc',          // Keeping mint as accent
    forest: '#0D330E',        // Pakistan Green (keep for contrast)
    leaf: '#2D531A',          // Dark Moss (keep for contrast)
    moss: '#477023',          // Fern Green (keep for contrast)
    sage: '#6E8649',          // Reseda Green (keep for contrast)
    white: '#FFFFFF',
    text: '#1F2E2A'
  };

  // Professional SVG Icons (updated with new teal color)
  const UploadIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V4M12 4L8 8M12 4L16 8" stroke="#008080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke="#0D330E" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const AIIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="#008080" strokeWidth="1.5"/>
      <path d="M12 5V3M12 21V19M19 12H21M3 12H5M17.66 6.34L19.07 4.93M4.93 19.07L6.34 17.66M17.66 17.66L19.07 19.07M4.93 4.93L6.34 6.34" 
            stroke="#b3e0dc" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const PaymentIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="#0D330E" strokeWidth="1.5"/>
      <path d="M2 10H22M7 15H9M16 15H18" stroke="#008080" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1" fill="#b3e0dc"/>
    </svg>
  );

  const RunnerIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3" stroke="#0D330E" strokeWidth="1.5"/>
      <path d="M5 18L7 15L10 18L14 13L17 16L19 14" stroke="#008080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 21L15 18L12 20L9 18L6 21" stroke="#b3e0dc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const CalendarIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#0D330E" strokeWidth="1.5"/>
      <path d="M3 9H21M8 2V6M16 2V6" stroke="#008080" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="14" r="1" fill="#b3e0dc"/>
      <circle cx="16" cy="14" r="1" fill="#b3e0dc"/>
      <circle cx="8" cy="14" r="1" fill="#b3e0dc"/>
    </svg>
  );

  // Scroll function for navigation links
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#D3D3D3', 
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto'
    }}>
      {/* Decorative Background Elements with new teal */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #00808020, #b3e0dc20)',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0D330E20, #00808020)',
        zIndex: 0
      }} />

      {/* Navigation */}
      <div style={{ 
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #00808030',
        padding: '1rem 5%',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255,255,255,0.95)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          
          {/* Logo with new teal gradient */}
          <Link to="/" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #008080, #b3e0dc)',
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 10px #00808040'
            }}>
              <span style={{ color: '#0D330E', fontWeight: '600', fontSize: '1.2rem' }}>C</span>
            </div>
            <span style={{ 
              color: '#0D330E', 
              fontWeight: '700', 
              fontSize: '1.3rem',
              letterSpacing: '-0.5px'
            }}>
              ConnectUs<span style={{ color: '#008080' }}>.</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <div style={{ display: 'flex', gap: '2.5rem' }}>
              <button
                onClick={() => setShowAbout(true)}
                style={{ 
                  color: '#2D531A', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#008080'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2D531A'}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('services')}
                style={{ 
                  color: '#2D531A', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#008080'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2D531A'}
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                style={{ 
                  color: '#2D531A', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#008080'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2D531A'}
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                style={{ 
                  color: '#2D531A', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#008080'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2D531A'}
              >
                Contact
              </button>
            </div>

            {/* Auth Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link 
                to="/login" 
                style={{ 
                  color: '#0D330E', 
                  textDecoration: 'none', 
                  fontSize: '1rem',
                  fontWeight: '500',
                  padding: '0.5rem 1.5rem'
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={{ 
                  background: 'linear-gradient(135deg, #008080, #b3e0dc)',
                  color: '#0D330E', 
                  padding: '0.6rem 1.8rem', 
                  borderRadius: '8px', 
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 10px #00808040'
                }}
              >
                Sign Up
              </Link>
              <Link 
                to="/admin" 
                style={{ 
                  color: '#008080', 
                  textDecoration: 'none', 
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginLeft: '0.5rem'
                }}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '2.5rem', 
            borderRadius: '20px', 
            maxWidth: '500px', 
            width: '90%',
            position: 'relative',
            boxShadow: '0 20px 50px #00808040'
          }}>
            <button 
              onClick={() => setShowAbout(false)} 
              style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                right: '1.5rem', 
                background: 'none', 
                border: 'none', 
                fontSize: '1.5rem', 
                cursor: 'pointer',
                color: '#2D531A'
              }}
            >
              ✕
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #008080, #b3e0dc)',
                width: '70px', 
                height: '70px', 
                borderRadius: '15px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 20px #00808040'
              }}>
                <span style={{ color: '#0D330E', fontSize: '2rem', fontWeight: '600' }}>C</span>
              </div>
              
              <h2 style={{ color: '#0D330E', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: '600' }}>About ConnectUs</h2>
              
              <p style={{ lineHeight: '1.8', color: '#2D531A', marginBottom: '2rem' }}>
                ConnectUs is a two-sided marketplace platform connecting customers who need products 
                with local runners who can shop for them. The platform features product photo uploads, 
                runner availability calendars, AI-powered chatbot assistance, secure escrow payments, 
                and hybrid delivery options.
              </p>
              
              <button 
                onClick={() => setShowAbout(false)} 
                style={{ 
                  background: 'linear-gradient(135deg, #008080, #b3e0dc)',
                  color: '#0D330E', 
                  padding: '0.8rem 2.5rem', 
                  borderRadius: '8px', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #0D330E, #008080)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #008080, #b3e0dc)';
                  e.currentTarget.style.color = '#0D330E';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Banner with new teal */}
      <div id="services" style={{
        margin: '2rem 5% 0',
        padding: '2rem 3rem',
        background: 'linear-gradient(135deg, #008080, #b3e0dc)',
        borderRadius: '20px',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
        boxShadow: '0 10px 30px #00808040'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FFFFFF20, transparent)',
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: '#0D330E', fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Your Local Items, Delivered
          </h1>
          <p style={{ color: '#0D330E', opacity: 0.8, fontSize: '1.1rem' }}>
            Connect with trusted local runners in your area
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ 
        padding: '2rem 5%',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Left Column */}
          <div>
            <div style={{ 
              backgroundColor: '#FFFFFF',
              color: '#008080',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              display: 'inline-block',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '2rem',
              border: '1px solid #00808030',
              boxShadow: '0 4px 10px #00000010'
            }}>
              ⚡ Trusted by 10,000+ users
            </div>
            
            <h1 style={{ 
              color: '#0D330E', 
              fontSize: '3.5rem', 
              fontWeight: '800', 
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              letterSpacing: '-1px'
            }}>
              Your Local Items,
              <br />
              <span style={{ color: '#008080' }}>Delivered Instantly</span>
            </h1>
            
            <p style={{ 
              color: '#2D531A', 
              fontSize: '1.1rem', 
              lineHeight: '1.8',
              marginBottom: '2rem'
            }}>
              Connect with trusted local runners who can shop and deliver anything you need. 
              Fast, reliable, and secure.
            </p>

            {/* Search Bar */}
            <div style={{ 
              display: 'flex',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #00808030',
              marginBottom: '2rem',
              overflow: 'hidden',
              width: '100%'
            }}>
              <input 
                type="text" 
                placeholder="What would you like delivered?" 
                style={{ 
                  flex: 1,
                  padding: '1rem 1.5rem',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  width: '100%'
                }} 
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#008080';
                  e.currentTarget.style.boxShadow = '0 0 0 3px #00808020';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#00808030';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button style={{ 
                background: 'linear-gradient(135deg, #008080, #b3e0dc)',
                color: '#0D330E', 
                padding: '1rem 2rem', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0D330E, #008080)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #008080, #b3e0dc)';
                e.currentTarget.style.color = '#0D330E';
              }}>
                Search
              </button>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link 
                to="/find-runner" 
                style={{ 
                  backgroundColor: '#0D330E', 
                  color: '#FFFFFF', 
                  padding: '1rem 2.5rem', 
                  borderRadius: '8px', 
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 10px #0D330E40'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#008080';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0D330E';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Find a Runner
              </Link>
              <Link 
                to="/become-runner" 
                style={{ 
                  border: `2px solid #0D330E`, 
                  color: '#0D330E', 
                  padding: '1rem 2.5rem', 
                  borderRadius: '8px', 
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0D330E';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#0D330E';
                }}
              >
                Become a Runner
              </Link>
            </div>
          </div>

          {/* Right Column - Stats Card */}
          <div style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 10px 30px #00000010',
            border: '1px solid #00808030'
          }}>
            <h3 style={{ color: '#0D330E', fontSize: '1.5rem', fontWeight: '600', marginBottom: '2rem' }}>
              Platform Statistics
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {[
                { value: '10k+', label: 'Active Runners' },
                { value: '50k+', label: 'Deliveries' },
                { value: '98%', label: 'Satisfaction Rate' },
                { value: '100+', label: 'Cities Covered' }
              ].map((stat, i) => (
                <div key={i} style={{ 
                  backgroundColor: '#D3D3D3',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#008080', fontSize: '2rem', fontWeight: '700' }}>{stat.value}</div>
                  <div style={{ color: '#2D531A', fontSize: '0.9rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ 
              borderTop: '1px solid #00808030',
              paddingTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#0D330E', fontWeight: '500' }}>Live Activity</span>
              <span style={{ 
                backgroundColor: '#008080',
                color: '#FFFFFF',
                padding: '0.2rem 1rem',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>24 online</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" style={{ 
        backgroundColor: '#FFFFFF',
        padding: '5rem 5%',
        width: '100%',
        boxSizing: 'border-box',
        marginTop: '3rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ width: '100%' }}>
          <h2 style={{ 
            color: '#0D330E', 
            fontSize: '2.5rem', 
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '1rem',
            letterSpacing: '-0.5px'
          }}>
            How It Works
          </h2>
          <p style={{ 
            color: '#2D531A', 
            fontSize: '1.1rem', 
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            Simple steps to get your items delivered
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '2rem',
            width: '100%'
          }}>
            {[
              { icon: <UploadIcon />, title: 'Upload Photos', desc: 'Take photos of the items you need and upload them to our platform' },
              { icon: <AIIcon />, title: 'AI Matching', desc: 'Our AI matches you with the perfect runner for your specific needs' },
              { icon: <PaymentIcon />, title: 'Secure Payments', desc: 'Pay securely with escrow protection and buyer guarantee' }
            ].map((item, i) => (
              <div key={i} style={{ 
                padding: '2.5rem 2rem',
                border: '1px solid #00808030',
                borderRadius: '16px',
                textAlign: 'center',
                backgroundColor: '#D3D3D3',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px #00808040';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ marginBottom: '1.5rem' }}>{item.icon}</div>
                <h3 style={{ color: '#0D330E', fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>{item.title}</h3>
                <p style={{ color: '#2D531A', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ 
        padding: '5rem 5%',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{ 
          color: '#0D330E', 
          fontSize: '2rem', 
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Platform Features
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '2rem',
          width: '100%'
        }}>
          {[
            { icon: <UploadIcon />, title: 'Product Photo Uploads', desc: 'High-quality image uploads with automatic categorization' },
            { icon: <CalendarIcon />, title: 'Runner Availability', desc: 'Real-time calendar showing available runners in your area' },
            { icon: <AIIcon />, title: 'AI-Powered Chatbot', desc: 'Intelligent assistant to help with your delivery needs' },
            { icon: <RunnerIcon />, title: 'Hybrid Delivery', desc: 'Flexible delivery options to suit your schedule' }
          ].map((feature, i) => (
            <div key={i} style={{ 
              display: 'flex',
              gap: '1.5rem',
              padding: '2rem',
              border: '1px solid #00808030',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 30px #00808040';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ flexShrink: 0 }}>{feature.icon}</div>
              <div>
                <h3 style={{ color: '#0D330E', fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: '#2D531A', lineHeight: '1.7' }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section with updated colors */}
      <div id="contact" style={{ 
        background: '#0D330E', // Changed to match footer color
        padding: '5rem 5%',
        width: '100%',
        boxSizing: 'border-box',
        marginTop: '3rem',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #00808020, transparent)',
          zIndex: 0
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ 
            color: '#FFFFFF', 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '1rem'
          }}>
            Ready to Get Started?
          </h2>
          <p style={{ 
            color: '#FFFFFF', 
            fontSize: '1.2rem', 
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            Join thousands of users who trust ConnectUs for their delivery needs
          </p>
          <Link 
            to="/register" 
            style={{ 
              backgroundColor: '#008080', // Teal background
              color: '#FFFFFF', // White text
              padding: '1rem 3rem', 
              borderRadius: '8px', 
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              display: 'inline-block',
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b3e0dc';
              e.currentTarget.style.color = '#0D330E';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px #00808080';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#008080';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: '#0D330E',
        padding: '4rem 5% 2rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 1fr', 
            gap: '3rem',
            marginBottom: '3rem',
            width: '100%'
          }}>
            <div>
              <h3 style={{ color: '#FFFFFF', fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>ConnectUs</h3>
              <p style={{ color: '#FFFFFF', opacity: 0.8, lineHeight: '1.8' }}>
                Connecting customers with trusted local runners for fast, reliable delivery.
              </p>
            </div>
            {[
              { title: 'Company', links: ['About', 'Careers', 'Press'] },
              { title: 'Services', links: ['Find Runner', 'Become Runner', 'Pricing'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Legal'] }
            ].map((section, i) => (
              <div key={i}>
                <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9 }}>{section.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {section.links.map((link, j) => (
                    <li key={j} style={{ marginBottom: '0.8rem' }}>
                      <a 
                        href="#" 
                        style={{ color: '#FFFFFF', textDecoration: 'none', opacity: 0.7 }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                        onClick={(e) => {
                          e.preventDefault();
                          if (link === 'About') setShowAbout(true);
                          else if (link === 'Find Runner') window.location.href = '/find-runner';
                          else if (link === 'Become Runner') window.location.href = '/become-runner';
                          else if (link === 'Pricing') scrollToSection('pricing');
                          else if (link === 'Contact') scrollToSection('contact');
                          else if (link === 'Careers' || link === 'Press' || link === 'Help Center' || link === 'Legal') {
                            alert(`${link} page is under construction`);
                          }
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div style={{ 
            paddingTop: '2rem', 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            color: '#FFFFFF',
            opacity: 0.7
          }}>
            <p>© 2026 ConnectUs. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;